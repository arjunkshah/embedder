import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
  },
};

const proofItems = [
  "Pixel-perfect shorts embeds",
  "One-click responsive wrappers",
  "Works with YouTube, TikTok, Instagram",
];

const showcaseCards = [
  {
    title: "Hero Reel",
    metric: "38% more play starts",
    detail: "Pinned creator intro with branded CTA.",
  },
  {
    title: "UGC Wall",
    metric: "2.6x dwell time",
    detail: "Mosaic rail with adaptive feed density.",
  },
  {
    title: "Course Snippets",
    metric: "18% more signups",
    detail: "Vertical stories embedded inside pricing page.",
  },
  {
    title: "Launch Countdown",
    metric: "97/100 perf",
    detail: "Motion-first reveal with lightweight scripts.",
  },
];

export function HeroSection() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--brand)/0.30),transparent_40%),radial-gradient(circle_at_85%_15%,hsl(var(--brand)/0.16),transparent_30%),linear-gradient(180deg,hsl(221_39%_8%),hsl(240_20%_6%))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:46px_46px] opacity-25" />

      <header className="relative z-20 border-b border-border/70 bg-background/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="inline-flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-brand/40 bg-brand/20 text-sm font-semibold text-brand">
              E
            </div>
            <span className="text-base font-semibold tracking-wide">EmbedGen</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="/pricing" className="transition hover:text-foreground">
              Pricing
            </a>
            <a href="/pricing#faq" className="transition hover:text-foreground">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <a href="/login">Login</a>
            </Button>
            <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
              <a href="/login">Start Building</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl gap-16 px-6 pb-14 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-10">
            <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/15 px-3 py-1 text-xs font-medium text-brand">
              <Sparkles className="h-3.5 w-3.5" />
              New generation embed studio
            </motion.div>

            <motion.div variants={item} className="space-y-5">
              <h1 className="max-w-2xl text-balance text-5xl font-semibold leading-[1.02] md:text-7xl">
                Crafted embeds that make short-form video feel native to your brand.
              </h1>
              <p className="max-w-xl text-pretty text-lg text-muted-foreground md:text-xl">
                Design beautiful social video placements in minutes with cinematic previews, responsive controls, and publish-ready embed code.
              </p>
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-12 rounded-xl bg-brand px-7 text-base text-brand-foreground hover:bg-brand/90">
                <a href="/dashboard">
                  Open Workspace <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-xl border-border/90 bg-background/50 px-7 text-base backdrop-blur">
                <a href="/pricing">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Explore plans
                </a>
              </Button>
            </motion.div>

            <motion.ul variants={container} className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {proofItems.map((point) => (
                <motion.li key={point} variants={item} className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background/35 px-3 py-2 backdrop-blur-sm">
                  <CheckCircle2 className="h-4 w-4 text-brand" />
                  {point}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
            className="grid gap-3 sm:grid-cols-2"
          >
            {showcaseCards.map((card, index) => (
              <motion.article
                key={card.title}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className={`relative overflow-hidden rounded-2xl border border-border/70 bg-card/65 p-5 backdrop-blur-xl ${
                  index === 0 ? "sm:col-span-2" : ""
                }`}
              >
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-brand/20 blur-2xl" />
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{card.title}</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{card.metric}</p>
                <p className="mt-3 text-sm text-muted-foreground">{card.detail}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
