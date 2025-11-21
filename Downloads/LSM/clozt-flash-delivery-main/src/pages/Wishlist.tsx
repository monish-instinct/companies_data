import { motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Wishlist = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: "1",
      title: "Diamond Necklace",
      price: 12999,
      mrp: 19999,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
      inStock: false,
      store: "Elite Boutique",
    },
    {
      id: "2",
      title: "Casual Sneakers",
      price: 1799,
      mrp: 2999,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      inStock: true,
      store: "Fashion Hub",
    },
  ]);

  const removeFromWishlist = (id: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  const addToCart = (item: any) => {
    toast({
      title: "Added to Cart",
      description: `${item.title} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        className="relative z-10 border-b border-border/20 glass-strong"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-primary fill-primary" />
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                My Wishlist
              </h1>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/products")}
              className="text-muted-foreground hover:text-primary"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {wishlistItems.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Heart className="w-24 h-24 text-muted-foreground/30 mx-auto mb-6" />
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-8">
              Save items you love for later!
            </p>
            <Button
              onClick={() => navigate("/products")}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:scale-105 transition-all"
            >
              Explore Products
            </Button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-border/20 hover:border-primary/30 transition-all overflow-hidden group">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full glass-strong text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>

                    {/* Stock Badge */}
                    {!item.inStock && (
                      <Badge className="absolute top-4 left-4 bg-destructive/80 backdrop-blur">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">{item.store}</div>
                      <h3 className="text-xl font-display font-bold text-foreground mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-display font-bold text-primary">
                        ₹{item.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{item.mrp.toLocaleString()}
                      </span>
                      <Badge variant="secondary" className="ml-auto">
                        {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {item.inStock ? (
                        <>
                          <Button
                            onClick={() => addToCart(item)}
                            className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:scale-105 transition-all"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/product/${item.id}`)}
                            className="border-border/20"
                          >
                            →
                          </Button>
                        </>
                      ) : (
                        <Button
                          disabled
                          className="flex-1"
                        >
                          Notify When Available
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recommendation Section */}
        {wishlistItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <Card className="glass-strong border-border/20 p-8 text-center">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                Looking for more?
              </h2>
              <p className="text-muted-foreground mb-6">
                Explore our latest collection and discover amazing deals
              </p>
              <Button
                onClick={() => navigate("/products")}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary text-primary-foreground"
              >
                Browse All Products
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;