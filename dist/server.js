import cors from 'cors';
import express from 'express';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import prisma from './lib/db.js';
const app = express();
const PORT = Number(process.env.PORT ?? 3001);
const APP_ORIGIN = process.env.APP_ORIGIN ?? 'http://localhost:5173';
const DEFAULT_PRICE_ID = 'price_1RdfCNBII1IxzjEQdPf7jBsM';
const DEFAULT_PROMO_COUPON_ID = 'gE50WGCD';
const PROMO_CODE = 'XBETA';
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret
    ? new Stripe(stripeSecret)
    : null;
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    console.warn('[startup] JWT_SECRET is not set. Auth endpoints are disabled until it is configured.');
}
app.use(cors({ origin: APP_ORIGIN, credentials: true }));
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    if (!stripe) {
        return sendError(res, 503, 'Stripe is not configured');
    }
    const stripeSignature = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripeSignature || !webhookSecret) {
        return sendError(res, 400, 'Stripe webhook signing secret is missing');
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, stripeSignature, webhookSecret);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to verify webhook';
        return sendError(res, 400, message);
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        if (userId) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    plan: 'pro',
                },
            });
        }
    }
    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        if (userId) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    plan: 'free',
                },
            });
        }
    }
    return res.status(200).json({ received: true });
});
app.use(express.json());
app.get('/api/health', async (_req, res) => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        return res.json({ status: 'ok' });
    }
    catch {
        return sendError(res, 503, 'Database unavailable');
    }
});
app.post('/api/register', async (req, res) => {
    if (!jwtSecret) {
        return sendError(res, 503, 'Server is missing JWT configuration');
    }
    const email = normalizeEmail(req.body?.email);
    const password = normalizePassword(req.body?.password);
    if (!email || !password) {
        return sendError(res, 400, 'A valid email and password are required');
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        const token = createToken(user, jwtSecret);
        return res.status(201).json({
            message: 'User created successfully',
            token,
            user: toPublicUser(user),
        });
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return sendError(res, 409, 'User already exists');
        }
        console.error('[register]', error);
        return sendError(res, 500, 'Internal server error');
    }
});
app.post('/api/login', async (req, res) => {
    if (!jwtSecret) {
        return sendError(res, 503, 'Server is missing JWT configuration');
    }
    const email = normalizeEmail(req.body?.email);
    const password = normalizePassword(req.body?.password);
    if (!email || !password) {
        return sendError(res, 400, 'A valid email and password are required');
    }
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return sendError(res, 401, 'Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return sendError(res, 401, 'Invalid credentials');
        }
        const token = createToken(user, jwtSecret);
        return res.json({ token, user: toPublicUser(user) });
    }
    catch (error) {
        console.error('[login]', error);
        return sendError(res, 500, 'Internal server error');
    }
});
app.get('/api/me', authenticate, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
        if (!user) {
            return sendError(res, 404, 'User not found');
        }
        return res.json({ user: toPublicUser(user) });
    }
    catch (error) {
        console.error('[me]', error);
        return sendError(res, 500, 'Internal server error');
    }
});
app.post('/api/create-checkout-session', async (req, res) => {
    if (!stripe) {
        return sendError(res, 503, 'Stripe is not configured');
    }
    const priceId = typeof req.body?.priceId === 'string' && req.body.priceId.trim().length > 0
        ? req.body.priceId.trim()
        : process.env.STRIPE_PRO_PRICE_ID || DEFAULT_PRICE_ID;
    const promoCode = typeof req.body?.promoCode === 'string' ? req.body.promoCode.trim().toUpperCase() : '';
    const origin = typeof req.headers.origin === 'string' ? req.headers.origin : APP_ORIGIN;
    const authUser = parseAuthHeader(req.headers.authorization);
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: `${origin}/success`,
            cancel_url: `${origin}/cancel`,
            ...(promoCode === PROMO_CODE ? { discounts: [{ coupon: process.env.STRIPE_PROMO_COUPON_ID || DEFAULT_PROMO_COUPON_ID }] } : {}),
            ...(authUser ? { metadata: { userId: authUser.userId } } : {}),
        });
        return res.json({ sessionId: session.id });
    }
    catch (error) {
        console.error('[create-checkout-session]', error);
        return sendError(res, 500, 'Unable to create Stripe Checkout session');
    }
});
app.use((error, _req, res, _next) => {
    console.error('[unhandled]', error);
    return sendError(res, 500, 'Internal server error');
});
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const shutdown = async () => {
    server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
function sendError(res, status, message) {
    return res.status(status).json({ error: message });
}
function normalizeEmail(email) {
    if (typeof email !== 'string') {
        return null;
    }
    const normalized = email.trim().toLowerCase();
    if (!normalized || !normalized.includes('@')) {
        return null;
    }
    return normalized;
}
function normalizePassword(password) {
    if (typeof password !== 'string') {
        return null;
    }
    const normalized = password.trim();
    if (normalized.length < 8 || normalized.length > 128) {
        return null;
    }
    return normalized;
}
function createToken(user, secret) {
    return jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '7d' });
}
function toPublicUser(user) {
    return {
        id: user.id,
        email: user.email,
        plan: user.plan,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
function parseAuthHeader(authorizationHeader) {
    if (!authorizationHeader || !jwtSecret) {
        return null;
    }
    const [scheme, token] = authorizationHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
        return null;
    }
    try {
        const payload = jwt.verify(token, jwtSecret);
        if (typeof payload === 'object' &&
            payload !== null &&
            'userId' in payload &&
            typeof payload.userId === 'string' &&
            'email' in payload &&
            typeof payload.email === 'string') {
            return { userId: payload.userId, email: payload.email };
        }
        return null;
    }
    catch {
        return null;
    }
}
function authenticate(req, res, next) {
    const user = parseAuthHeader(req.headers.authorization);
    if (!user) {
        return sendError(res, 401, 'Unauthorized');
    }
    req.user = user;
    return next();
}
