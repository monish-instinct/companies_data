import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Users, Award, Heart, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const AboutUs = () => {
  const values = [
    {
      icon: Award,
      title: "Quality First",
      description: "We partner with premium brands to ensure you get authentic, high-quality fashion"
    },
    {
      icon: Heart,
      title: "Customer Love",
      description: "Your satisfaction is our priority. We're here to make your shopping experience exceptional"
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "From AI try-on to express delivery, we use technology to revolutionize fashion shopping"
    },
    {
      icon: Users,
      title: "Community",
      description: "Join thousands of fashion enthusiasts who trust CLOZET for their style needs"
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
        <div className="container mx-auto px-4 py-4 flex items-center space-x-3">
          <Link to="/dashboard">
            <Button variant="glass" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">About Us</h1>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to CLOZET
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your ultimate fashion destination, connecting you with the best local stores and brands for an unparalleled shopping experience.
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.section
          className="mb-12"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Card className="glass-strong p-8 border-0">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                CLOZET was born from a simple idea: make fashion shopping easier, faster, and more personalized for everyone. We noticed the gap between online convenience and the instant gratification of physical stores.
              </p>
              <p>
                By partnering with local fashion stores, we bring you the best of both worlds - browse online, get it delivered in 60 minutes, or pick it up from a store nearby. Our AI-powered try-on feature lets you see how clothes look on you before buying.
              </p>
              <p>
                Today, we're proud to serve thousands of fashion enthusiasts, connecting them with hundreds of stores and brands in their city.
              </p>
            </div>
          </Card>
        </motion.section>

        {/* Our Values */}
        <motion.section
          className="mb-12"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">What We Stand For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass p-6 hover:glass-strong transition-all duration-300 border-0 h-full">
                    <div className="w-12 h-12 bg-gradient-primary/20 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Card className="glass-strong p-8 border-0">
            <h2 className="text-2xl font-bold mb-6 text-center">Get in Touch</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Email Us</h3>
                <p className="text-sm text-muted-foreground">support@clozet.com</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Call Us</h3>
                <p className="text-sm text-muted-foreground">1800-123-4567</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Visit Us</h3>
                <p className="text-sm text-muted-foreground">Mumbai, India</p>
              </div>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutUs;
