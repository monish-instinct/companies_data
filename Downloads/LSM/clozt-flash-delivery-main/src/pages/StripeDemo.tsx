import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Shield, CreditCard, ArrowLeft } from "lucide-react";

export default function StripeDemo() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const orderId = params.get("orderId") || `CLZ${Date.now().toString().slice(-8)}`;
  const total = useMemo(() => Number(params.get("total") || 0), [params]);

  const handlePay = async () => {
    setLoading(true);
    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 1200));
    navigate(`/order/${orderId}/confirmation`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Button variant="ghost" className="mb-4" onClick={() => navigate("/checkout")}> 
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Checkout
        </Button>

        <Card className="glass-strong p-6 border-border/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary/15 flex items-center justify-center">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              <h1 className="text-xl font-semibold">Secure Payment (Stripe Demo)</h1>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              PCI Compliant
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Order</span>
              <span className="font-medium">#{orderId}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">Amount due</span>
              <span className="text-2xl font-bold">₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Card form (demo only) */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Card number</label>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
                <Input placeholder="4242 4242 4242 4242" className="glass" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Expiry</label>
              <Input placeholder="MM / YY" className="glass mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium">CVC</label>
              <Input placeholder="123" className="glass mt-2" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Name on card</label>
              <Input placeholder="John Doe" className="glass mt-2" />
            </div>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-lg py-6"
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay ₹${total.toLocaleString()}`}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            This is a demo payment screen that simulates Stripe Checkout.
          </p>
        </Card>
      </div>
    </div>
  );
}
