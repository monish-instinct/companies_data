import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      title: "Premium Cotton T-Shirt",
      variant: "Medium/Blue",
      price: 899,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
    },
    {
      id: "2",
      title: "Designer Jeans",
      variant: "32/Blue",
      price: 2499,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"
    }
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.10;
  const deliveryCharge = 50;
  const total = subtotal + tax + deliveryCharge;

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
              <ShoppingBag className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Shopping Cart
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
        {cartItems.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ShoppingBag className="w-24 h-24 text-muted-foreground/30 mx-auto mb-6" />
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-8">
              Add some amazing products to get started!
            </p>
            <Button
              onClick={() => navigate("/products")}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:scale-105 transition-all"
            >
              Browse Products
            </Button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass border-border/20 hover:border-primary/30 transition-all p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-display font-semibold text-foreground">
                              {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">{item.variant}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, 0)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="text-xl font-display font-bold text-primary">
                            ₹{item.price.toLocaleString()}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg border-primary/20"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-display font-semibold text-foreground w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg border-primary/20"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="glass-strong border-border/20 p-6 sticky top-6">
                <h2 className="text-2xl font-display font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Order Summary
                </h2>

                {/* Coupon Input */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coupon code"
                      className="glass border-border/20 focus:border-primary/40"
                    />
                    <Button variant="outline" className="border-primary/20">
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Tax (10%)</span>
                    <span className="font-semibold">₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Delivery Charge</span>
                    <span className="font-semibold">₹{deliveryCharge}</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  <div className="flex justify-between text-lg font-display font-bold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-lg py-6 font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-border/20">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-2xl">🔒</div>
                      <p className="text-xs text-muted-foreground">Secure</p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl">⚡</div>
                      <p className="text-xs text-muted-foreground">Fast</p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl">✓</div>
                      <p className="text-xs text-muted-foreground">Safe</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;