import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bell, Package, Heart, Star, Tag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: "order",
      icon: Package,
      color: "text-primary",
      title: "Order Delivered",
      message: "Your order #ORD12345 has been delivered successfully",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      type: "offer",
      icon: Tag,
      color: "text-accent",
      title: "Exclusive Offer",
      message: "Get 40% off on all sneakers. Limited time only!",
      time: "5 hours ago",
      read: false
    },
    {
      id: 3,
      type: "wishlist",
      icon: Heart,
      color: "text-secondary",
      title: "Price Drop Alert",
      message: "Nike Air Max 90 is now ₹1,499 (was ₹2,499)",
      time: "1 day ago",
      read: true
    },
    {
      id: 4,
      type: "review",
      icon: Star,
      color: "text-accent-glow",
      title: "Review Request",
      message: "How was your recent purchase? Share your feedback",
      time: "2 days ago",
      read: true
    },
    {
      id: 5,
      type: "new",
      icon: Sparkles,
      color: "text-primary-glow",
      title: "New Arrivals",
      message: "Check out the latest streetwear collection",
      time: "3 days ago",
      read: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <motion.header 
        className="glass-strong border-b border-border/20 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/dashboard">
              <Button variant="glass" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Notifications</h1>
          </div>
          <Button variant="outline-neon" size="sm">
            Mark all as read
          </Button>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Notifications List */}
        <motion.div
          className="space-y-4"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {notifications.map((notification, index) => {
            const Icon = notification.icon;
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`glass p-4 hover:glass-strong transition-all duration-300 border-0 ${
                  !notification.read ? 'ring-2 ring-primary/20' : ''
                }`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-primary/20 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${notification.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-sm">{notification.title}</h3>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State (when no notifications) */}
        {notifications.length === 0 && (
          <motion.div
            className="text-center py-12"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="w-20 h-20 bg-gradient-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">No Notifications</h2>
            <p className="text-muted-foreground mb-6">
              You're all caught up! Check back later for updates.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
