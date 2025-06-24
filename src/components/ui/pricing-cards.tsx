import { Check, MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { plans, setUserPlan } from "@/lib/plans";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  "pk_live_51Rdf5TBII1IxzjEQuSctPsTbukpTLkozTpV2XMxCwcCedYnkaS0FhI9zstdUDKwir250P32ilYy0j0mRVmjbf9ye001ZiU48ny"
);

const CheckoutForm = ({ children }) => {
  const stripe = useStripe();

  const handleCheckout = async (priceId) => {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await response.json();
    if (data.sessionId) {
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (error) {
        console.error(error);
      }
    } else {
      alert("Failed to create Stripe Checkout session. Please try again.");
    }
  };

  return <>{children(handleCheckout)}</>;
};

function Pricing() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm>
        {(handleCheckout) => (
          <div className="w-full">
            <div className="container mx-auto">
              <div className="flex text-center justify-center items-center gap-4 flex-col">
                <div className="grid pt-20 text-left grid-cols-1 lg:grid-cols-2 w-full gap-8">
                  <Card className="w-full rounded-md">
                    <CardHeader>
                      <CardTitle>
                        <span className="flex flex-row gap-4 items-center font-normal">
                          Free
                        </span>
                      </CardTitle>
                      <CardDescription>
                        For individuals and hobbyists starting with video embeds.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-8 justify-start">
                        <p className="flex flex-row  items-center gap-2 text-xl">
                          <span className="text-4xl">$0</span>
                          <span className="text-sm text-muted-foreground"> / month</span>
                        </p>
                        <div className="flex flex-col gap-4 justify-start">
                          <div className="flex flex-row gap-4">
                            <Check className="w-4 h-4 mt-1 text-primary" />
                            <p>10 Embeds/Month</p>
                          </div>
                          <div className="flex flex-row gap-4">
                            <Check className="w-4 h-4 mt-1 text-primary" />
                            <p>Basic Customization</p>
                          </div>
                          <div className="flex flex-row gap-4">
                            <Check className="w-4 h-4 mt-1 text-primary" />
                            <p>Community Support</p>
                          </div>
                        </div>
                        <Button asChild variant="outline" className="gap-4" onClick={() => setUserPlan(plans.free)}>
                          <a href="/login">
                            Get Started <MoveRight className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="w-full shadow-2xl rounded-md border-primary">
                    <CardHeader>
                      <CardTitle>
                        <span className="flex flex-row gap-4 items-center font-normal">
                          Pro
                        </span>
                      </CardTitle>
                      <CardDescription>
                        For growing businesses that need more power and customization.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-8 justify-start">
                        <p className="flex flex-row  items-center gap-2 text-xl">
                          <span className="text-4xl">$10</span>
                          <span className="text-sm text-muted-foreground"> / year</span>
                        </p>
                        <div className="flex flex-col gap-4 justify-start">
                          <div className="flex flex-row gap-4">
                            <Check className="w-4 h-4 mt-1 text-primary" />
                            <p>Unlimited Embeds</p>
                          </div>
                          <div className="flex flex-row gap-4">
                            <Check className="w-4 h-4 mt-1 text-primary" />
                            <p>Advanced Customization</p>
                          </div>
                          <div className="flex flex-row gap-4">
                            <Check className="w-4 h-4 mt-1 text-primary" />
                            <p>Remove Branding</p>
                          </div>
                          <div className="flex flex-row gap-4">
                            <Check className="w-4 h-4 mt-1 text-primary" />
                            <p>Priority Support</p>
                          </div>
                        </div>
                        <Button className="gap-4" onClick={() => {
                          handleCheckout("price_123");
                          setUserPlan(plans.pro);
                        }}>
                          Upgrade to Pro <MoveRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
      </CheckoutForm>
    </Elements>
  );
}

export { Pricing };
