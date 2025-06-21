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

const stripePromise = loadStripe("pk_test_51RcSjsBNBx6FicItofkBwq8naZKej6g2B0iRIrj6hhbHdDKOUGeRCn1sHShdl3iMHgstdNSgLSlE4ZeBoeo3uT7w00ol6p1h5F");

const CheckoutForm = ({ children }) => {
  const stripe = useStripe();

  const handleCheckout = async (priceId) => {
    if (!stripe) return;

    // IMPORTANT: In a real-world application, you would not create a checkout session
    // on the client-side with a secret key. This is insecure.
    // Instead, you should have a backend endpoint that creates the session
    // and returns the session ID to the client.
    //
    // Example backend call:
    // const response = await fetch('/api/create-checkout-session', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ priceId }),
    // });
    // const { sessionId } = await response.json();
    //
    // const { error } = await stripe.redirectToCheckout({ sessionId });
    // if (error) {
    //   console.error(error);
    // }
    
    // For demonstration purposes, we are creating a checkout session here.
    // This is NOT secure and should NOT be used in production.
    const checkoutSession = {
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/cancel`,
    };

    alert("This is a demo. In a real application, you would be redirected to Stripe to complete your purchase.");
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
                <div className="grid pt-20 text-left grid-cols-1 lg:grid-cols-3 w-full gap-8">
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
                        <Button asChild variant="outline" className="gap-4">
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
                          <span className="text-4xl">$29</span>
                          <span className="text-sm text-muted-foreground"> / month</span>
                        </p>
                        <div className="flex flex-col gap-4 justify-start">
                          <div className="flex flex-row gap-4">
                            <Check className="w-4 h-4 mt-1 text-primary" />
                            <p>100 Embeds/Month</p>
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
                        <Button className="gap-4" onClick={() => handleCheckout("price_123")}>
                          Upgrade to Pro <MoveRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="w-full rounded-md">
                    <CardHeader>
                      <CardTitle>
                        <span className="flex flex-row gap-4 items-center font-normal">
                          Enterprise
                        </span>
                      </CardTitle>
                      <CardDescription>
                        For large-scale applications with custom requirements.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-8 justify-start">
                        <p className="flex flex-row  items-center gap-2 text-xl">
                          <span className="text-4xl">Custom</span>
                        </p>
                        <div className="flex flex-col gap-4 justify-start">
                          <div className="flex flex-row gap-4">
                            <Check className="w-4 h-4 mt-1 text-primary" />
                           <p>Unlimited Embeds</p>
                          </div>
                          <div className="flex flex-row gap-4">
                            <Check className="w-4 h-4 mt-1 text-primary" />
                            <p>Custom Integrations</p>
                          </div>
                          <div className="flex flex-row gap-4">
                            <Check className="w-4 h-4 mt-1 text-primary" />
                            <p>Dedicated Support</p>
                          </div>
                           <div className="flex flex-row gap-4">
                            <Check className="w-4 h-4 mt-1 text-primary" />
                            <p>Advanced Analytics</p>
                          </div>
                        </div>
                        <Button variant="outline" className="gap-4">
                          Contact Sales <PhoneCall className="w-4 h-4" />
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
