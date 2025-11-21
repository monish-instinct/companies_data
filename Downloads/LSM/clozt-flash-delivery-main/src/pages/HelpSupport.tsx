import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Search,
  MessageCircle,
  Phone,
  Mail,
  HelpCircle,
  Package,
  CreditCard,
  Truck,
  RefreshCw,
  Shield,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const helpTopics = [
    {
      icon: Package,
      title: "Order Issues",
      description: "Track, modify or cancel orders",
      articles: 12
    },
    {
      icon: Truck,
      title: "Delivery",
      description: "Shipping and delivery information",
      articles: 8
    },
    {
      icon: RefreshCw,
      title: "Returns & Exchanges",
      description: "Return or exchange your items",
      articles: 10
    },
    {
      icon: CreditCard,
      title: "Payments",
      description: "Payment methods and refunds",
      articles: 7
    },
    {
      icon: Shield,
      title: "Account & Security",
      description: "Manage your account settings",
      articles: 6
    },
    {
      icon: HelpCircle,
      title: "General FAQs",
      description: "Common questions answered",
      articles: 15
    }
  ];

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order from the Orders section in your account."
    },
    {
      question: "What is the return policy?",
      answer: "We offer 7-day return policy on most items. Check product details for specifics."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery takes 3-5 days. Express delivery is available for 60-min delivery."
    },
    {
      question: "Can I change my delivery address?",
      answer: "Yes, you can modify the address before the order is dispatched from our warehouse."
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
          <Link to="/dashboard" className="flex items-center space-x-2">
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-lg font-semibold">Help & Support</h1>
          <div className="w-20" />
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-strong p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">How can we help you?</h2>
            <p className="text-muted-foreground mb-4">Search for answers or browse topics below</p>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 glass border-0 bg-white/10"
              />
            </div>
          </Card>
        </motion.div>

        {/* Contact Options */}
        <motion.div
          className="grid md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass p-6 text-center hover:glass-strong transition-all cursor-pointer">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-3">Available 24/7</p>
            <Button variant="outline-neon" size="sm">Start Chat</Button>
          </Card>

          <Card className="glass p-6 text-center hover:glass-strong transition-all cursor-pointer">
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold mb-1">Call Us</h3>
            <p className="text-sm text-muted-foreground mb-3">Mon-Sat, 9AM-9PM</p>
            <Button variant="outline-neon" size="sm">Call Now</Button>
          </Card>

          <Card className="glass p-6 text-center hover:glass-strong transition-all cursor-pointer">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-1">Email</h3>
            <p className="text-sm text-muted-foreground mb-3">Response in 24 hours</p>
            <Button variant="outline-neon" size="sm">Send Email</Button>
          </Card>
        </motion.div>

        {/* Help Topics */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4">Browse by Topic</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {helpTopics.map((topic, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <Card className="glass p-4 hover:glass-strong transition-all cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <topic.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground">{topic.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">{topic.articles} articles</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Popular FAQs */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-4">Popular Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="glass p-4">
                <h3 className="font-semibold mb-2 flex items-start">
                  <HelpCircle className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-sm text-muted-foreground ml-7">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-strong p-6">
            <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
            <p className="text-muted-foreground mb-6">Send us a message and we'll get back to you</p>
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input className="glass border-0 bg-white/10" placeholder="What do you need help with?" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea className="glass border-0 bg-white/10 min-h-32" placeholder="Describe your issue..." />
              </div>
              <Button variant="hero" className="w-full">
                Send Message
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpSupport;
