import { useState, useEffect } from "react";
import { Bell, Package, Heart, Star, Gift, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "order" | "wishlist" | "review" | "promotion";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notificationIcons = {
  order: Package,
  wishlist: Heart,
  review: Star,
  promotion: Gift,
};

const notificationColors = {
  order: "from-blue-500/20 to-cyan-500/20",
  wishlist: "from-pink-500/20 to-rose-500/20",
  review: "from-amber-500/20 to-orange-500/20",
  promotion: "from-purple-500/20 to-violet-500/20",
};

export const NotificationPopover = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    // Demo notifications - replace with real data
    const demoNotifications: Notification[] = [
      {
        id: "1",
        type: "order",
        title: "Order Shipped",
        message: "Your order #12345 has been shipped and will arrive soon!",
        time: "5 min ago",
        read: false,
      },
      {
        id: "2",
        type: "promotion",
        title: "Weekend Sale",
        message: "Get 50% off on all sneakers this weekend!",
        time: "1 hour ago",
        read: false,
      },
      {
        id: "3",
        type: "wishlist",
        title: "Back in Stock",
        message: "Nike Air Max is now available in your size!",
        time: "3 hours ago",
        read: true,
      },
    ];

    setNotifications(demoNotifications);
    setUnreadCount(demoNotifications.filter(n => !n.read).length);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="glass" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground"
            >
              {unreadCount}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[380px] p-0 glass-ultra border-border/20" 
        align="end"
        sideOffset={8}
      >
        <div className="p-4 border-b border-border/20">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs text-primary hover:text-primary"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center"
              >
                <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </motion.div>
            ) : (
              notifications.map((notification, index) => {
                const Icon = notificationIcons[notification.type];
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "p-4 border-b border-border/10 hover:bg-white/5 transition-colors cursor-pointer group",
                      !notification.read && "bg-white/5"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br",
                        notificationColors[notification.type]
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                          {notification.message}
                        </p>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-border/20">
            <Button 
              variant="ghost" 
              className="w-full text-xs text-primary hover:text-primary"
              onClick={() => {
                setOpen(false);
                // Navigate to full notifications page if needed
              }}
            >
              View All Notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
