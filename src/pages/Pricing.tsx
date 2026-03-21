import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const plans = [
  {
    name: "Starter",
    price: "$0",
    cadence: "/mo",
    description: "For creators validating ideas quickly.",
    features: ["10 embeds per month", "Basic customization", "Community support"],
    cta: "Get Started",
    href: "/register",
  },
  {
    name: "Pro",
    price: "$10",
    cadence: "/mo",
    description: "For teams shipping social-native experiences.",
    features: ["Unlimited embeds", "Advanced controls", "Priority support"],
    cta: "Upgrade to Pro",
    href: "/register",
    highlighted: true,
  },
];

const faqs = [
  {
    question: "What platforms do you support?",
    answer:
      "YouTube Shorts, TikTok videos, Instagram Reels, plus slide embeds from Google Slides and compatible decks.",
  },
  {
    question: "Can I customize appearance and behavior?",
    answer:
      "Yes. You can configure dimensions, alignment, autoplay, controls, and copy clean embed code for your site.",
  },
  {
    question: "Do plans include a free trial?",
    answer:
      "The Starter plan is free. Pro unlocks unlimited embeds and advanced controls immediately.",
  },
  {
    question: "Do you offer support?",
    answer:
      "All users get support. Pro customers receive faster response and deeper implementation help.",
  },
];

const Pricing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_5%,hsl(var(--brand)/0.24),transparent_35%),radial-gradient(circle_at_95%_15%,hsl(var(--brand)/0.18),transparent_30%),linear-gradient(180deg,hsl(240_20%_7%),hsl(240_15%_5%))]" />

      <header className="relative z-20 border-b border-border/70 bg-background/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="inline-flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-brand/40 bg-brand/20 text-brand">E</div>
            <span className="font-semibold">EmbedGen</span>
          </a>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <a href="/login">Login</a>
            </Button>
            <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
              <a href="/register">Start free</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-16">
        <section className="text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/15 px-3 py-1 text-xs text-brand">
            <Sparkles className="h-3.5 w-3.5" />
            Transparent pricing
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-5xl font-semibold leading-tight md:text-6xl">
            Simple plans built for high-converting video embeds.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Launch with Starter. Scale with Pro when you need unlimited embeds and deeper controls.
          </p>
        </section>

        <section className="mt-14 grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-3xl border p-7 backdrop-blur-xl ${
                plan.highlighted
                  ? "border-brand/60 bg-brand/15 shadow-2xl shadow-brand/15"
                  : "border-border/70 bg-card/70"
              }`}
            >
              <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">{plan.name}</p>
              <p className="mt-4 text-5xl font-semibold">
                {plan.price}
                <span className="ml-2 text-base font-normal text-muted-foreground">{plan.cadence}</span>
              </p>
              <p className="mt-3 text-muted-foreground">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="inline-flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-brand" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 h-11 w-full bg-brand text-brand-foreground hover:bg-brand/90">
                <a href={plan.href}>{plan.cta}</a>
              </Button>
            </article>
          ))}
        </section>

        <section id="faq" className="mt-20 rounded-3xl border border-border/70 bg-card/60 p-8 backdrop-blur-xl">
          <h2 className="text-3xl font-semibold">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-6 w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={faq.question}>
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>
    </div>
  );
};

export default Pricing;
