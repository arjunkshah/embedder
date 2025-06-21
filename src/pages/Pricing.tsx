
import { Button } from "@/components/ui/button";
import { PricingDemo } from "@/components/ui/demo";

const Pricing = () => {

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

          <PricingDemo />
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
