import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  User,
  Bell,
  Lock,
  CreditCard,
  MapPin,
  Globe,
  Moon,
  Shield,
  HelpCircle,
  LogOut,
  MessageSquare,
  FileText,
  Info,
  Eye,
  Smartphone,
  Mail,
  Volume2,
  ShoppingBag,
  Tag,
  AlertCircle,
  Download,
  Trash2,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: true,
    newsletters: false,
    soundEffects: true,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    toast({
      title: "Settings Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').trim()} ${!preferences[key] ? 'enabled' : 'disabled'}`,
    });
  };

  const accountSettings = [
    { icon: User, label: "Edit Profile", description: "Update your personal information", href: "/account/profile", badge: null },
    { icon: MapPin, label: "Manage Addresses", description: "View and edit delivery addresses", href: "/account/profile#addresses", badge: null },
    { icon: CreditCard, label: "Payment Methods", description: "Manage cards and payment options", href: "/account/profile#payments", badge: null },
    { icon: ShoppingBag, label: "Order History", description: "View past orders and track current", href: "/account/orders", badge: null },
  ];

  const notificationSettings = [
    { key: "emailNotifications", icon: Mail, label: "Email Notifications", description: "Receive updates via email" },
    { key: "pushNotifications", icon: Bell, label: "Push Notifications", description: "Get app notifications" },
    { key: "smsNotifications", icon: Smartphone, label: "SMS Notifications", description: "Receive text messages" },
    { key: "orderUpdates", icon: ShoppingBag, label: "Order Updates", description: "Track your order status" },
    { key: "promotions", icon: Tag, label: "Promotions & Offers", description: "Special deals and discounts" },
    { key: "newsletters", icon: Mail, label: "Newsletters", description: "Weekly fashion updates" },
  ];

  const privacySettings = [
    { icon: Eye, label: "Privacy Settings", description: "Control your data visibility", href: "/settings/privacy" },
    { icon: Shield, label: "Security", description: "Password and authentication", href: "/settings/security" },
    { icon: Lock, label: "Two-Factor Authentication", description: "Add extra security layer", href: "/settings/2fa", badge: "Recommended" },
    { icon: Download, label: "Download Data", description: "Export your account data", action: "download" },
    { icon: Trash2, label: "Delete Account", description: "Permanently remove your account", action: "delete", danger: true },
  ];

  const supportSettings = [
    { icon: HelpCircle, label: "Help Center", description: "FAQs and support articles", href: "/help" },
    { icon: MessageSquare, label: "Contact Support", description: "Get help from our team", href: "/feedback" },
    { icon: FileText, label: "Terms & Policies", description: "Legal information", href: "/terms" },
    { icon: Info, label: "About CLOZET", description: "App version and information", href: "/about" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      {/* Header */}
      <motion.header 
        className="glass-strong border-b border-border/20 sticky top-0 z-50 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-sm text-muted-foreground">Manage your account preferences</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-strong border-border/20 p-6 mb-8 hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground">Demo User</h3>
                  <p className="text-sm text-muted-foreground">{user?.email || "demo@clozet.com"}</p>
                </div>
              </div>
              <Link to="/account/profile">
                <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                  Edit Profile
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Account
          </h2>
          <Card className="glass border-border/20 divide-y divide-border/20">
            {accountSettings.map((item) => (
              <Link key={item.label} to={item.href}>
                <div className="p-5 flex items-center justify-between hover:bg-primary/5 transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </Card>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Preferences
          </h2>
          <Card className="glass border-border/20 divide-y divide-border/20">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Moon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
                </div>
              </div>
              <Switch 
                checked={preferences.darkMode} 
                onCheckedChange={() => handleToggle('darkMode')}
              />
            </div>
            
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Sound Effects</p>
                  <p className="text-sm text-muted-foreground">In-app sound feedback</p>
                </div>
              </div>
              <Switch 
                checked={preferences.soundEffects} 
                onCheckedChange={() => handleToggle('soundEffects')}
              />
            </div>

            <Link to="/settings/language">
              <div className="p-5 flex items-center justify-between hover:bg-primary/5 transition-colors group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Language</p>
                    <p className="text-sm text-muted-foreground">English (US)</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h2>
          <Card className="glass border-border/20 divide-y divide-border/20">
            {notificationSettings.map((item) => (
              <div key={item.key} className="p-5 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <Switch 
                  checked={preferences[item.key as keyof typeof preferences] as boolean}
                  onCheckedChange={() => handleToggle(item.key as keyof typeof preferences)}
                />
              </div>
            ))}
          </Card>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Privacy & Security
          </h2>
          <Card className="glass border-border/20 divide-y divide-border/20">
            {privacySettings.map((item) => (
              <div key={item.label}>
                {item.href ? (
                  <Link to={item.href}>
                    <div className="p-5 flex items-center justify-between hover:bg-primary/5 transition-colors group">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${item.danger ? 'bg-destructive/10' : 'bg-primary/10'} rounded-full flex items-center justify-center group-hover:${item.danger ? 'bg-destructive/20' : 'bg-primary/20'} transition-colors`}>
                          <item.icon className={`w-5 h-5 ${item.danger ? 'text-destructive' : 'text-primary'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`font-medium ${item.danger ? 'text-destructive' : 'text-foreground'}`}>
                              {item.label}
                            </p>
                            {item.badge && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ) : (
                  <button 
                    className="w-full p-5 flex items-center justify-between hover:bg-primary/5 transition-colors group text-left"
                    onClick={() => {
                      toast({
                        title: item.label,
                        description: "This feature will be available soon.",
                      });
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${item.danger ? 'bg-destructive/10' : 'bg-primary/10'} rounded-full flex items-center justify-center group-hover:${item.danger ? 'bg-destructive/20' : 'bg-primary/20'} transition-colors`}>
                        <item.icon className={`w-5 h-5 ${item.danger ? 'text-destructive' : 'text-primary'}`} />
                      </div>
                      <div>
                        <p className={`font-medium ${item.danger ? 'text-destructive' : 'text-foreground'}`}>
                          {item.label}
                        </p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                )}
              </div>
            ))}
          </Card>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Support
          </h2>
          <Card className="glass border-border/20 divide-y divide-border/20">
            {supportSettings.map((item) => (
              <Link key={item.label} to={item.href}>
                <div className="p-5 flex items-center justify-between hover:bg-primary/5 transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </Card>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="outline"
            className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive"
            onClick={signOut}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </motion.div>

        {/* App Info */}
        <motion.div
          className="mt-8 text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-xs text-primary-foreground font-bold">C</span>
            </div>
            <span className="font-medium">CLOZET</span>
          </div>
          <p className="text-sm text-muted-foreground">Version 1.0.0</p>
          <p className="text-xs text-muted-foreground">© 2025 CLOZET. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;