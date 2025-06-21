import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const Cancel = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center p-8 bg-card rounded-lg shadow-2xl max-w-md w-full">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-muted-foreground mb-6">
          Your payment was not processed. You can try again from the pricing page.
        </p>
        <Button asChild>
          <a href="/pricing">Back to Pricing</a>
        </Button>
      </div>
    </div>
  );
};

export default Cancel; 