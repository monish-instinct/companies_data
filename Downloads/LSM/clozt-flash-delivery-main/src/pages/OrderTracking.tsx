import { motion } from "framer-motion";
import { MapPin, Phone, Package, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Map from "@/components/Map";

const OrderTracking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // Default to Vellore area (approx). You can override via VITE_DEFAULT_MAP_CENTER="lat,lng"
  const envCenter = (() => {
    try {
      const raw = (import.meta as any).env?.VITE_DEFAULT_MAP_CENTER as string | undefined;
      if (!raw) return null;
      const [lat, lng] = raw.split(',').map((n) => parseFloat(n.trim()));
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
      return null;
    } catch {
      return null;
    }
  })();
  const [deliveryLocation, setDeliveryLocation] = useState({ lat: envCenter?.lat ?? 12.9165, lng: envCenter?.lng ?? 79.1325 });

  // Simulate delivery vehicle movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveryLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const timeline = [
    {
      status: "placed",
      label: "Order Placed",
      time: "2:30 PM",
      completed: true,
      icon: Package,
    },
    {
      status: "confirmed",
      label: "Confirmed",
      time: "2:35 PM",
      completed: true,
      icon: CheckCircle,
    },
    {
      status: "packed",
      label: "Packed",
      time: "2:50 PM",
      completed: true,
      icon: Package,
    },
    {
      status: "picked_up",
      label: "Picked Up",
      time: "3:10 PM",
      completed: true,
      icon: Package,
    },
    {
      status: "out_for_delivery",
      label: "Out for Delivery",
      time: "3:25 PM",
      completed: true,
      icon: MapPin,
    },
    {
      status: "delivered",
      label: "Delivered",
      time: "Est. 3:45 PM",
      completed: false,
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      {/* Header */}
      <motion.header
        className="relative z-10 border-b border-border/20 glass-strong"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/account/orders")}
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Track Order #{id || "CLZ2024002"}
            </h1>
            <div className="w-32" />
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass border-border/20 overflow-hidden">
                {/* Map Container */}
                <div className="relative h-[500px]">
                  <Map
                    center={[deliveryLocation.lat, deliveryLocation.lng]}
                    marker={[deliveryLocation.lat, deliveryLocation.lng]}
                    height="500px"
                  />
                </div>

                {/* Delivery Partner Info */}
                <div className="p-6 border-t border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-xl font-bold text-primary-foreground">SP</span>
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground">
                          Speed Delivery Partner
                        </h3>
                        <p className="text-sm text-muted-foreground">Delivery Partner</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-12 h-12 rounded-full border-primary/20"
                    >
                      <Phone className="w-5 h-5 text-primary" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Timeline & Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-strong border-border/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Order Status
                  </h2>
                  <Badge className="bg-blue-500 text-white">
                    Out for Delivery
                  </Badge>
                </div>

                {/* Timeline */}
                <div className="space-y-6">
                  {timeline.map((item, index) => (
                    <div key={item.status} className="relative flex gap-4">
                      {/* Line */}
                      {index < timeline.length - 1 && (
                        <div
                          className={`absolute left-5 top-12 w-0.5 h-full ${
                            item.completed ? "bg-primary" : "bg-border/20"
                          }`}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                          item.completed
                            ? "bg-gradient-to-br from-primary to-secondary"
                            : "glass border border-border/20"
                        }`}
                      >
                        <item.icon
                          className={`w-5 h-5 ${
                            item.completed ? "text-primary-foreground" : "text-muted-foreground"
                          }`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3
                            className={`font-display font-semibold ${
                              item.completed ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {item.label}
                          </h3>
                          <span className="text-sm text-muted-foreground">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-strong border-border/20 p-6">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  Order Details
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop"
                      alt="Product"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-foreground">
                        Floral Summer Dress
                      </h3>
                      <p className="text-sm text-muted-foreground">Qty: 1 × ₹1,299</p>
                    </div>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold text-foreground">₹1,299</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-semibold text-foreground">₹30</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-semibold text-foreground">₹129.90</span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <div className="flex justify-between">
                      <span className="font-display font-bold text-foreground">Total</span>
                      <span className="font-display font-bold text-primary">₹1,458.90</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;