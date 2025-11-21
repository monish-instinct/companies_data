import { motion } from "framer-motion";
import { Package, MapPin, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const navigate = useNavigate();

  const orders = [
    {
      id: "CLZ2024002",
      date: "1 day ago",
      status: "out_for_delivery",
      statusLabel: "Out for Delivery",
      statusColor: "bg-blue-500",
      items: [
        {
          title: "Floral Summer Dress",
          quantity: 1,
          price: 1299,
          image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop",
        },
      ],
      total: 1458.90,
      store: "Trendy Styles",
    },
    {
      id: "CLZ2024001",
      date: "5 days ago",
      status: "delivered",
      statusLabel: "Delivered",
      statusColor: "bg-green-500",
      items: [
        {
          title: "Premium Cotton T-Shirt",
          quantity: 2,
          price: 899,
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        },
      ],
      total: 2027.80,
      store: "Fashion Hub",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return "✓";
      case "out_for_delivery":
        return "🚚";
      case "packed":
        return "📦";
      default:
        return "⏳";
    }
  };

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
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Order History
              </h1>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/products")}
              className="text-muted-foreground hover:text-primary"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass border-border/20 hover:border-primary/30 transition-all overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-border/20">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-display font-bold text-foreground">
                          Order #{order.id}
                        </h2>
                        <Badge className={`${order.statusColor} text-white`}>
                          {getStatusIcon(order.status)} {order.statusLabel}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {order.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {order.store}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-display font-bold text-primary">
                        ₹{order.total.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 flex gap-3">
                  {order.status === "out_for_delivery" && (
                    <Button
                      onClick={() => navigate(`/order/${order.id}/track`)}
                      className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Track Order
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/order/${order.id}`)}
                    className="flex-1 border-border/20"
                  >
                    View Details
                  </Button>
                  {order.status === "delivered" && (
                    <Button
                      variant="outline"
                      className="flex-1 border-border/20"
                    >
                      Rate & Review
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Package className="w-24 h-24 text-muted-foreground/30 mx-auto mb-6" />
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              No orders yet
            </h2>
            <p className="text-muted-foreground mb-8">
              Start shopping and your orders will appear here!
            </p>
            <Button
              onClick={() => navigate("/products")}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground"
            >
              Start Shopping
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;