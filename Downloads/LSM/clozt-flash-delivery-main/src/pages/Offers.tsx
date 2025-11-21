import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ChevronLeft,
  Tag,
  Gift,
  Percent,
  Zap,
  Star,
  TrendingUp,
  Clock,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Offers = () => {
  const { toast } = useToast();

  const offers = [
    {
      id: 1,
      title: "First Order Special",
      description: "Get 40% off on your first purchase",
      code: "FIRST40",
      discount: "40% OFF",
      icon: Gift,
      color: "from-primary to-primary-glow",
      minOrder: "₹999",
      validUntil: "Dec 31, 2025",
      featured: true
    },
    {
      id: 2,
      title: "Flash Sale",
      description: "Lightning deals on trending products",
      code: "FLASH25",
      discount: "25% OFF",
      icon: Zap,
      color: "from-accent to-accent-glow",
      minOrder: "₹1499",
      validUntil: "Dec 25, 2025",
      featured: true
    },
    {
      id: 3,
      title: "Weekend Special",
      description: "Extra savings this weekend",
      code: "WEEKEND15",
      discount: "15% OFF",
      icon: Star,
      color: "from-secondary to-secondary-glow",
      minOrder: "₹799",
      validUntil: "Dec 24, 2025",
      featured: false
    },
    {
      id: 4,
      title: "Free Delivery",
      description: "No delivery charges on all orders",
      code: "FREEDEL",
      discount: "FREE",
      icon: TrendingUp,
      color: "from-primary to-secondary",
      minOrder: "₹599",
      validUntil: "Dec 31, 2025",
      featured: false
    },
    {
      id: 5,
      title: "Premium Member",
      description: "Exclusive discount for members",
      code: "PREMIUM20",
      discount: "20% OFF",
      icon: Star,
      color: "from-accent to-primary",
      minOrder: "₹1299",
      validUntil: "Dec 31, 2025",
      featured: false
    },
    {
      id: 6,
      title: "Student Offer",
      description: "Special discount for students",
      code: "STUDENT10",
      discount: "10% OFF",
      icon: Tag,
      color: "from-secondary to-accent",
      minOrder: "No minimum",
      validUntil: "Dec 31, 2025",
      featured: false
    }
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied!",
      description: `${code} has been copied to clipboard`,
    });
  };

  const featuredOffers = offers.filter(offer => offer.featured);
  const regularOffers = offers.filter(offer => !offer.featured);

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
          <Link to="/dashboard" className="flex items-center space-x-2">
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-lg font-semibold">Offers & Deals</h1>
          <div className="w-20" />
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Featured Offers */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-primary" />
            Featured Deals
          </h2>
          <div className="space-y-4">
            {featuredOffers.map((offer, idx) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="glass-strong p-6 overflow-hidden relative">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${offer.color} opacity-10 rounded-full blur-3xl`} />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${offer.color} rounded-xl flex items-center justify-center`}>
                          <offer.icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-1">{offer.title}</h3>
                          <p className="text-sm text-muted-foreground">{offer.description}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-2 bg-gradient-to-r ${offer.color} rounded-lg text-white font-bold`}>
                        {offer.discount}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Tag className="w-4 h-4" />
                          <span>Min: {offer.minOrder}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>Valid till {offer.validUntil}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="glass px-4 py-2 rounded-lg font-mono font-bold">
                          {offer.code}
                        </div>
                        <Button
                          variant="hero"
                          size="sm"
                          onClick={() => handleCopyCode(offer.code)}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Regular Offers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Percent className="w-6 h-6 mr-2 text-secondary" />
            More Offers
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {regularOffers.map((offer, idx) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="glass p-4 hover:glass-strong transition-all duration-300">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${offer.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <offer.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold mb-1">{offer.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{offer.description}</p>
                    </div>
                    <div className={`px-3 py-1 bg-gradient-to-r ${offer.color} rounded-md text-white text-sm font-bold`}>
                      {offer.discount}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>Min: {offer.minOrder}</span>
                    <span>Valid till {offer.validUntil}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 glass px-3 py-2 rounded-lg font-mono font-bold text-sm text-center">
                      {offer.code}
                    </div>
                    <Button
                      variant="outline-neon"
                      size="sm"
                      onClick={() => handleCopyCode(offer.code)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass p-4">
            <p className="text-sm text-muted-foreground text-center">
              * Offer codes can be applied at checkout. Terms and conditions apply.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Offers;
