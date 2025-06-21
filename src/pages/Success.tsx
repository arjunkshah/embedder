import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const Success = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center p-8 bg-card rounded-lg shadow-2xl max-w-md w-full">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your purchase. Your account has been upgraded.
        </p>
        <Button asChild>
          <a href="/dashboard">Go to Dashboard</a>
        </Button>
      </div>
    </div>
  );
};

export default Success; 