import { Button } from "@/components/ui/button";
import { PricingDemo } from "@/components/ui/demo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const Pricing = () => {

  const faqs = [
    {
      question: "What platforms do you support?",
      answer: "We support YouTube (including Shorts), TikTok, and Instagram Reels. More platforms are coming soon!",
    },
    {
      question: "Can I customize the embed appearance?",
      answer: "Yes! You can customize width, height, positioning, autoplay settings, and more. Pro plans include advanced customization options.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! Our Free plan includes 10 embeds per month. Pro plans come with a 14-day free trial.",
    },
     {
      question: "How many embeds can I create?",
      answer: "The number of embeds depends on your plan. Our Free plan includes 10 embeds per month, the Pro plan offers 100 embeds per month, and the Enterprise plan provides unlimited embeds.",
    },
    {
      question: "Do you offer support?",
      answer: "Yes, we offer email support for all our users. Pro and Enterprise users get priority support.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-foreground font-bold text-xl">EmbedGen</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <a href="/login">Login</a>
            </Button>
            <Button size="sm" asChild>
              <a href="/login">Sign Up</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="pt-12 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for your video embedding needs
            </p>
          </div>

          <PricingDemo />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="pt-8 pb-20 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
