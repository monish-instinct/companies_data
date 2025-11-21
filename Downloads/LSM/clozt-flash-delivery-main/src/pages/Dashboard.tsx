import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search,
  Filter,
  MapPin,
  Clock,
  Star,
  Zap,
  Sparkles,
  Bell,
  ShoppingCart,
  TrendingUp,
  Package,
  DollarSign,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AITryOn } from "@/components/AITryOn";
import { NotificationPopover } from "@/components/NotificationPopover";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface Product {
  id: string;
  title: string;
  price: number;
  mrp: number;
  images: string[];
  brand: string;
  stores: {
    name: string;
    rating: number;
  };
}

interface Store {
  id: string;
  name: string;
  rating: number;
  total_reviews: number;
  logo_url: string;
  location_lat: number;
  location_lng: number;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch products with store information
      const { data: productsData } = await supabase
        .from('products')
        .select(`
          id,
          title,
          price,
          mrp,
          images,
          brand,
          stores!inner (
            name,
            rating
          )
        `)
        .eq('is_available', true)
        .limit(8);

      // Fetch stores
      const { data: storesData } = await supabase
        .from('stores')
        .select('*')
        .eq('status', 'active')
        .limit(6);

      setProducts(productsData || []);
      setStores(storesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredCollections = [
    { name: "Streetwear", items: "245+ items", color: "from-primary to-primary-glow", category: "streetwear" },
    { name: "Sneakers", items: "180+ items", color: "from-secondary to-secondary-glow", category: "footwear" },
    { name: "Accessories", items: "320+ items", color: "from-accent to-accent-glow", category: "accessories" },
    { name: "Athleisure", items: "156+ items", color: "from-primary to-accent", category: "athleisure" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

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
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CLOZET
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <NotificationPopover />
            <Link to="/cart">
              <Button variant="glass" size="sm">
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/wishlist">
              <Button variant="glass" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/account/profile">
              <Button variant="glass" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline-neon" size="sm" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Search Bar */}
      <section className="py-6 px-4">
        <div className="container mx-auto">
          <motion.div
            className="flex items-center space-x-4 max-w-2xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search for products, brands, stores..."
                className="w-full pl-10 pr-4 py-3 glass rounded-xl border-0 bg-white/10 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button variant="glass">
              <Filter className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-6 px-4">
        <div className="container mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Card className="glass-strong border-border/20 p-4 text-center hover:scale-105 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-display font-bold text-foreground mb-1">12</div>
                <div className="text-xs text-muted-foreground">Active Orders</div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="glass-strong border-border/20 p-4 text-center hover:scale-105 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-glow rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-display font-bold text-foreground mb-1">45</div>
                <div className="text-xs text-muted-foreground">Wishlist Items</div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="glass-strong border-border/20 p-4 text-center hover:scale-105 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-glow rounded-xl flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-display font-bold text-foreground mb-1">₹24K</div>
                <div className="text-xs text-muted-foreground">Total Saved</div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="glass-strong border-border/20 p-4 text-center hover:scale-105 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-display font-bold text-foreground mb-1">Gold</div>
                <div className="text-xs text-muted-foreground">Member Status</div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <motion.h2
            className="text-2xl font-bold mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            Featured Collections
          </motion.h2>

          <motion.div
            className="flex gap-4 overflow-x-auto pb-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {featuredCollections.map((collection, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-48"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/products?category=${collection.category}`}>
                  <Card className="glass p-4 hover:glass-strong transition-all duration-300 border-0">
                    <div className={`w-full h-24 bg-gradient-to-br ${collection.color} rounded-lg mb-3 opacity-20`} />
                    <h3 className="font-semibold mb-1">{collection.name}</h3>
                    <p className="text-sm text-muted-foreground">{collection.items}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <motion.div
            className="flex items-center justify-between mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h2 className="text-2xl font-bold">Trending Now</h2>
            <Link to="/products">
              <Button variant="outline-neon" size="sm">
                View All
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/product/${product.id}`}>
                  <Card className="glass hover:glass-strong transition-all duration-300 border-0 overflow-hidden">
                    <div className="aspect-square bg-gradient-subtle rounded-lg mb-3 overflow-hidden">
                      <img 
                        src={product.images[0] || '/placeholder.svg'} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1">{product.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm">₹{product.price}</span>
                          <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-accent fill-current" />
                          <span className="text-xs">{product.stores.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Nearby Stores */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <motion.div
            className="flex items-center justify-between mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h2 className="text-2xl font-bold">Stores Near You</h2>
            <Link to="/stores">
              <Button variant="outline-neon" size="sm">
                View All
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {stores.map((store, index) => (
              <motion.div
                key={store.id}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/store/${store.id}`}>
                  <Card className="glass p-4 hover:glass-strong transition-all duration-300 border-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src={store.logo_url || '/placeholder.svg'} 
                        alt={store.name} 
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{store.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>2.3 km</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-accent fill-current" />
                        <span className="text-sm font-medium">{store.rating}</span>
                        <span className="text-sm text-muted-foreground">({store.total_reviews})</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-primary">
                        <Zap className="w-3 h-3" />
                        <span>Express</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Try-On Feature */}
      <section className="py-8 px-4 bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto">
          <AITryOn />
        </div>
      </section>

      {/* Recent Orders */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <motion.div
            className="flex items-center justify-between mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Link to="/account/orders">
              <Button variant="outline-neon" size="sm">
                View All
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="space-y-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[1, 2, 3].map((order) => (
              <motion.div key={order} variants={fadeInUp}>
                <Card className="glass-strong border-border/20 p-4 hover:scale-[1.01] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl glass overflow-hidden">
                        <img 
                          src={`https://images.unsplash.com/photo-${1521572163474 + order}?w=100&h=100&fit=crop`}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-foreground">Order #CLZ202400{order}</h4>
                        <p className="text-sm text-muted-foreground">2 items • ₹3,499</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${order === 1 ? 'bg-primary' : 'bg-accent'} animate-pulse`} />
                          <span className="text-xs text-primary font-medium">
                            {order === 1 ? 'Out for Delivery' : 'Delivered'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Track
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Express Delivery Banner */}
      <section className="py-8 px-4 mb-12">
        <div className="container mx-auto">
          <motion.div
            className="glass-strong p-8 rounded-2xl text-center relative overflow-hidden"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <Zap className="w-12 h-12 text-accent mr-3 animate-pulse" />
                <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Express Delivery Available
                </h2>
              </div>
              <p className="text-muted-foreground mb-6 text-lg">
                Get your fashion delivered in under 60 minutes from nearby stores
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full glass-strong flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-semibold">60 min delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full glass-strong flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="font-semibold">15km radius</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full glass-strong flex items-center justify-center">
                    <Star className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-semibold">Top rated</span>
                </div>
              </div>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:scale-105 transition-all"
              >
                <Zap className="w-5 h-5 mr-2" />
                Try Express Delivery
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;