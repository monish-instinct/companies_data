import { motion } from "framer-motion";
import { ArrowRight, Zap, Truck, MapPin, Star, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-fashion.jpg";
import storeImage from "@/assets/store-interior.jpg";

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const glowVariants = {
    initial: { boxShadow: "0 0 20px hsl(189 100% 60% / 0.3)" },
    animate: { 
      boxShadow: [
        "0 0 20px hsl(189 100% 60% / 0.3)",
        "0 0 40px hsl(189 100% 60% / 0.6)",
        "0 0 20px hsl(189 100% 60% / 0.3)"
      ]
    }
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute inset-0">
        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Flowing Lines */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-10 flex justify-between items-center p-6 md:p-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center glow-primary">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            CLOZET
          </h1>
        </motion.div>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="text-foreground hover:text-primary transition-colors"
          >
            Sign In
          </Button>
          <Button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-sm font-medium text-primary">
                <Zap className="w-4 h-4" />
                Express Delivery in 60 Minutes
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Local Fashion,
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Delivered Fast
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                Shop from verified local stores with real-time inventory. 
                Get your fashion delivered in under 60 minutes with live tracking.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <motion.div 
                variants={glowVariants} 
                initial="initial" 
                animate="animate"
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Button
                  onClick={() => navigate("/login")}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/login")}
                className="glass border-primary/20 hover:border-primary/40 px-8 py-4 text-lg transition-all duration-300"
              >
                Become a Partner
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center space-y-2">
                <div className="text-3xl font-display font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Partner Stores</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-display font-bold text-secondary">15km</div>
                <div className="text-sm text-muted-foreground">Service Radius</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-display font-bold text-accent">60min</div>
                <div className="text-sm text-muted-foreground">Average Delivery</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative glass rounded-3xl p-2 border border-primary/10">
              <img
                src={heroImage}
                alt="Fashion shopping experience"
                className="w-full h-[600px] object-cover rounded-2xl"
              />
              
              {/* Floating UI Elements */}
              <motion.div
                className="absolute top-6 right-6 glass rounded-2xl p-4 border border-primary/20"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-medium text-foreground">Live Tracking</span>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute bottom-6 left-6 glass rounded-2xl p-4 border border-secondary/20"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="text-sm font-medium text-foreground">4.9 Rating</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center space-y-16"
        >
          <motion.div variants={fadeInUp} className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CLOZET
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of fashion shopping with our cutting-edge platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: "Express Delivery",
                description: "Get your orders delivered in under 60 minutes with real-time tracking",
                gradient: "from-primary to-primary-glow"
              },
              {
                icon: MapPin,
                title: "Local Stores",
                description: "Shop from verified local retailers within 15km radius",
                gradient: "from-secondary to-secondary-glow"
              },
              {
                icon: Shield,
                title: "Secure Payments",
                description: "Safe and secure transactions with multiple payment options",
                gradient: "from-accent to-accent-glow"
              },
              {
                icon: Clock,
                title: "Real-time Inventory",
                description: "Live stock updates ensure you never order unavailable items",
                gradient: "from-primary to-secondary"
              },
              {
                icon: Star,
                title: "Quality Assured",
                description: "Verified products from trusted local fashion retailers",
                gradient: "from-secondary to-accent"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized for speed with instant search and smooth checkout",
                gradient: "from-accent to-primary"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="glass border-border/20 hover:border-primary/30 transition-all duration-300 p-8 h-full">
                  <div className="space-y-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-full h-full text-primary-foreground" />
                    </div>
                    
                    <div className="space-y-3 text-center">
                      <h3 className="text-xl font-display font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Store Showcase */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="glass rounded-3xl p-2 border border-secondary/10">
              <img
                src={storeImage}
                alt="Partner store interior"
                className="w-full h-[500px] object-cover rounded-2xl"
              />
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-secondary/20 text-sm font-medium text-secondary">
                <MapPin className="w-4 h-4" />
                For Store Owners
              </div>
              
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                Partner with{" "}
                <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  CLOZET
                </span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join our network of verified retailers and expand your reach. 
                Get access to a wider customer base with our advanced delivery network.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-4">
              {[
                "Real-time inventory management",
                "Dedicated delivery partner network",
                "Advanced analytics dashboard",
                "Commission-based pricing model"
              ].map((benefit, index) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-secondary to-accent" />
                  <span className="text-foreground font-medium">{benefit}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Button
                onClick={() => navigate("/login")}
                size="lg"
                className="bg-gradient-to-r from-secondary to-accent text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300"
              >
                Become a Partner
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-10 border-t border-border/20 mt-20"
      >
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  CLOZET
                </h3>
              </div>
              <p className="text-muted-foreground">
                Local fashion, delivered fast. Experience the future of shopping.
              </p>
            </div>

            {[
              {
                title: "Company",
                links: ["About Us", "Careers", "Press", "Contact"]
              },
              {
                title: "Support",
                links: ["Help Center", "Safety", "Guidelines", "Community"]
              },
              {
                title: "Legal",
                links: ["Terms", "Privacy", "Cookies", "Licenses"]
              }
            ].map((section) => (
              <div key={section.title} className="space-y-4">
                <h4 className="font-display font-semibold text-foreground">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border/20 mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 CLOZET. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </main>
  );
};

export default LandingPage;