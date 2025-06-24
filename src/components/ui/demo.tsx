import { Pricing } from "@/components/ui/pricing-cards";
import { SignInPage } from "@/components/ui/sign-in-flow-1";

function PricingDemo() {
  return (
    <div className="w-full">
      <Pricing />
    </div>
  );
}

const DemoOne = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <SignInPage />
    </div>
  );
};

export { PricingDemo, DemoOne };
