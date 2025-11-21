import { motion } from "framer-motion";
import { CheckCircle, Package, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showConfetti, setShowConfetti] = useState(true);
  const [paid, setPaid] = useState<boolean | null>(null);
  const [orderId, setOrderId] = useState<string | undefined>(id);

  useEffect(() => {
    setTimeout(() => setShowConfetti(false), 5000);
  }, []);

  useEffect(() => {
    // If redirected from Stripe, confirm payment server-side
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (!sessionId) return;

    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('complete-payment', {
          body: { sessionId },
        });
        if (error) throw new Error(error.message || 'Failed to confirm payment');
        setPaid(!!data?.paid);
        if (data?.orderId) setOrderId(data.orderId);
      } catch (e) {
        console.error('Confirm payment error:', e);
        setPaid(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
              }}
              animate={{
                y: ["0vh", "110vh"],
                x: [0, Math.random() * 200 - 100],
                rotate: [0, Math.random() * 720],
                opacity: [1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                ease: "easeOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="max-w-2xl mx-auto"
        >
          <Card className="glass-strong border-2 border-primary/50 p-8 md:p-12 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary p-1">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <CheckCircle className="w-16 h-16 text-primary" />
                </div>
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Order Confirmed!
              </h1>
              <p className="text-lg text-muted-foreground">
                Thank you for your order. We'll send you updates on your delivery.
              </p>
            </motion.div>

            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass border border-border/20 rounded-2xl p-6 mb-8"
            >
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Order Number</div>
                    <div className="font-display font-bold text-foreground">{orderId || id || "CLZ2024001"}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Estimated Delivery</div>
                    <div className="font-display font-bold text-foreground">45-60 minutes</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Delivery Address</div>
                    <div className="font-display font-semibold text-foreground">
                      123 Customer Street, Mumbai
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Payment Status</div>
                    <div className="font-display font-bold text-primary">{paid === null ? 'Verifying...' : paid ? 'Paid' : 'Unpaid'}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={() => navigate(`/order/${orderId || id || "CLZ2024001"}/track`)}
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-lg py-6 font-semibold rounded-xl hover:scale-105 transition-all"
              >
                Track Order
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/products")}
                className="flex-1 border-2 border-border/20 text-lg py-6 font-semibold rounded-xl"
              >
                Continue Shopping
              </Button>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 pt-8 border-t border-border/20"
            >
              <p className="text-sm text-muted-foreground">
                You will receive order updates via SMS and email.
                <br />
                Order confirmation has been sent to your registered email.
              </p>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;