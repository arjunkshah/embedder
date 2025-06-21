
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Pricing = () => {
  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: ["10 embeds per month", "Basic customization", "Standard support", "YouTube, TikTok, Instagram support"],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      description: "For content creators",
      features: ["Unlimited embeds", "Advanced customization", "Priority support", "Analytics dashboard", "Custom branding", "API access"],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      description: "For large organizations",
      features: ["Everything in Pro", "Dedicated support", "Custom integrations", "White-label solution", "SLA guarantee", "Team management"],
      cta: "Contact Sales",
      popular: false
    }
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
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for your video embedding needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-card border rounded-lg p-8 relative ${
                  plan.popular 
                    ? "border-brand shadow-lg scale-105" 
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-3xl font-bold text-foreground mt-4">{plan.price}</p>
                  <p className="text-muted-foreground mt-1">/month</p>
                  <p className="text-muted-foreground mt-4">{plan.description}</p>
                </div>

                <ul className="space-y-3 mt-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-brand flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full mt-8 ${
                    plan.popular 
                      ? "bg-brand hover:bg-brand/90 text-white" 
                      : "bg-background border border-border hover:bg-accent"
                  }`}
                  asChild
                >
                  <a href="/login">{plan.cta}</a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                What platforms do you support?
              </h3>
              <p className="text-muted-foreground">
                We support YouTube (including Shorts), TikTok, and Instagram Reels. More platforms are coming soon!
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Can I customize the embed appearance?
              </h3>
              <p className="text-muted-foreground">
                Yes! You can customize width, height, positioning, autoplay settings, and more. Pro plans include advanced customization options.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Is there a free trial?
              </h3>
              <p className="text-muted-foreground">
                Yes! Our Free plan includes 10 embeds per month. Pro plans come with a 14-day free trial.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
