import { motion } from "framer-motion";
import { MapPin, CreditCard, Package, CheckCircle, ArrowLeft, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Address {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isDemoUser = !!(user && typeof (user as any).id === 'string' && (user as any).id.startsWith('demo-'));
  const demoAddrKey = user ? `demoAddresses:${(user as any).id}` : '';
  const [step, setStep] = useState(1);
  const [deliveryType, setDeliveryType] = useState("express");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "home",
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
  });

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (isDemoUser) {
      try {
        const raw = demoAddrKey ? localStorage.getItem(demoAddrKey) : null;
        const data: Address[] = raw ? JSON.parse(raw) : [];
        setAddresses(data);
        const defaultAddr = data.find(a => a.is_default);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (data.length > 0) {
          setSelectedAddressId(data[0].id);
        }
        return;
      } catch {}
    }

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user?.id)
      .order('is_default', { ascending: false });

    if (!error && data) {
      setAddresses(data);
      const defaultAddr = data.find(a => a.is_default);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else if (data.length > 0) {
        setSelectedAddressId(data[0].id);
      }
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.full_name || !newAddress.phone || !newAddress.address_line1 || !newAddress.city || !newAddress.state || !newAddress.postal_code) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (isDemoUser) {
      // Persist to local storage in demo mode
      const demoId = 'addr-' + Math.random().toString(36).slice(2, 10);
      const addr: Address = {
        id: demoId,
        is_default: addresses.length === 0,
        ...newAddress,
      } as Address;
      const updated = [...addresses, addr];
      setAddresses(updated);
      setSelectedAddressId(addr.id);
      try {
        if (demoAddrKey) localStorage.setItem(demoAddrKey, JSON.stringify(updated));
      } catch {}
      setShowNewAddressForm(false);
      setNewAddress({
        label: "home",
        full_name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
      });
      toast({ title: "Address Added", description: "Your address has been saved successfully" });
      return;
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert([{
        user_id: user?.id,
        ...newAddress,
        is_default: addresses.length === 0,
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive",
      });
      return;
    }

    setAddresses([...addresses, data]);
    setSelectedAddressId(data.id);
    setShowNewAddressForm(false);
    setNewAddress({
      label: "home",
      full_name: "",
      phone: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
    });
    toast({
      title: "Address Added",
      description: "Your address has been saved successfully",
    });
  };

  const handlePayment = async () => {
    if (!selectedAddressId) {
      toast({
        title: "No Address Selected",
        description: "Please select a delivery address",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Calculate amounts (placeholder since cart isn't wired here)
      const mockSubtotal = 3398; // INR
      const mockTax = Math.round(mockSubtotal * 0.10 * 100) / 100; // 10%
      const delivery = deliveryType === 'express' ? 100 : 50;
      const orderTotal = Math.round((mockSubtotal + mockTax + delivery) * 100) / 100;

      // DEMO Stripe flow: navigate to internal Stripe-like confirmation page
      const orderId = `CLZ${Date.now().toString().slice(-8)}`;
      navigate(`/pay/stripe-demo?orderId=${orderId}&total=${orderTotal}`);
      return;
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: "Address", icon: MapPin },
    { number: 2, title: "Delivery", icon: Package },
    { number: 3, title: "Payment", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      {/* Header */}
      <motion.header
        className="relative z-10 border-b border-border/20 glass-strong"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/cart")}
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Secure Checkout
            </h1>
            <div className="w-24" />
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Progress Steps */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-4">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      step >= s.number
                        ? "glass-strong border-2 border-primary/50"
                        : "glass border border-border/20"
                    }`}
                    animate={{
                      scale: step === s.number ? 1.1 : 1,
                    }}
                  >
                    <s.icon
                      className={`w-8 h-8 ${
                        step >= s.number ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </motion.div>
                  <span
                    className={`text-sm mt-2 font-medium ${
                      step >= s.number ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-24 h-1 mx-4 rounded-full ${
                      step > s.number
                        ? "bg-gradient-to-r from-primary to-secondary"
                        : "bg-border/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass border-border/20 p-8">
                {/* Step 1: Address */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-display font-bold text-foreground">
                        Delivery Address
                      </h2>
                      {!showNewAddressForm && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowNewAddressForm(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add New
                        </Button>
                      )}
                    </div>

                    {showNewAddressForm ? (
                      <div className="space-y-4 glass p-6 rounded-xl">
                        <h3 className="font-semibold">New Address</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Full Name *</Label>
                            <Input
                              value={newAddress.full_name}
                              onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                              className="glass mt-2"
                            />
                          </div>
                          <div>
                            <Label>Phone *</Label>
                            <Input
                              value={newAddress.phone}
                              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                              className="glass mt-2"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Address Line 1 *</Label>
                          <Input
                            value={newAddress.address_line1}
                            onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                            className="glass mt-2"
                          />
                        </div>
                        <div>
                          <Label>Address Line 2</Label>
                          <Input
                            value={newAddress.address_line2}
                            onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                            className="glass mt-2"
                          />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label>City *</Label>
                            <Input
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                              className="glass mt-2"
                            />
                          </div>
                          <div>
                            <Label>State *</Label>
                            <Input
                              value={newAddress.state}
                              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                              className="glass mt-2"
                            />
                          </div>
                          <div>
                            <Label>Postal Code *</Label>
                            <Input
                              value={newAddress.postal_code}
                              onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                              className="glass mt-2"
                            />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <Button
                            variant="outline"
                            onClick={() => setShowNewAddressForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleAddAddress}>
                            Save Address
                          </Button>
                        </div>
                      </div>
                    ) : addresses.length > 0 ? (
                      <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                        <div className="space-y-4">
                          {addresses.map((addr) => (
                            <motion.div
                              key={addr.id}
                              whileHover={{ scale: 1.02 }}
                              className={`glass border-2 rounded-xl p-6 cursor-pointer transition-all ${
                                selectedAddressId === addr.id
                                  ? "border-primary/50 bg-primary/5"
                                  : "border-border/20"
                              }`}
                            >
                              <div className="flex items-start space-x-4">
                                <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                                <Label htmlFor={addr.id} className="flex-1 cursor-pointer">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-semibold">{addr.full_name}</span>
                                    {addr.is_default && (
                                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground space-y-1">
                                    <p>{addr.address_line1}</p>
                                    {addr.address_line2 && <p>{addr.address_line2}</p>}
                                    <p>{addr.city}, {addr.state} {addr.postal_code}</p>
                                    <p>Phone: {addr.phone}</p>
                                  </div>
                                </Label>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </RadioGroup>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No addresses saved</p>
                        <Button onClick={() => setShowNewAddressForm(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Address
                        </Button>
                      </div>
                    )}

                    {addresses.length > 0 && !showNewAddressForm && (
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!selectedAddressId}
                      className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-lg py-6 hover:scale-105 transition-all"
                    >
                      Continue to Delivery
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    )}
                  </div>
                )}

                {/* Step 2: Delivery */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-display font-bold text-foreground">
                      Delivery Options
                    </h2>
                    <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                      <div className="space-y-4">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`glass border-2 rounded-xl p-6 cursor-pointer transition-all ${
                            deliveryType === "express"
                              ? "border-primary/50 bg-primary/5"
                              : "border-border/20"
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <RadioGroupItem value="express" id="express" />
                            <Label htmlFor="express" className="flex-1 cursor-pointer">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-lg font-display font-semibold text-foreground">
                                    Express Delivery
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Delivered in 60 minutes
                                  </div>
                                </div>
                                <div className="text-xl font-bold text-primary">₹100</div>
                              </div>
                            </Label>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`glass border-2 rounded-xl p-6 cursor-pointer transition-all ${
                            deliveryType === "standard"
                              ? "border-primary/50 bg-primary/5"
                              : "border-border/20"
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <RadioGroupItem value="standard" id="standard" />
                            <Label htmlFor="standard" className="flex-1 cursor-pointer">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-lg font-display font-semibold text-foreground">
                                    Standard Delivery
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Delivered in 2-3 hours
                                  </div>
                                </div>
                                <div className="text-xl font-bold text-primary">₹50</div>
                              </div>
                            </Label>
                          </div>
                        </motion.div>
                      </div>
                    </RadioGroup>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1 border-border/20"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-display font-bold text-foreground">
                      Payment Method
                    </h2>
                    <div className="space-y-4">
                      <div className="glass border-2 border-primary/50 bg-primary/5 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-lg font-display font-semibold text-foreground">
                            Stripe Secure Payment
                          </div>
                          <img src="https://img.icons8.com/color/48/stripe.png" alt="Stripe" className="h-8" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          You'll be redirected to Stripe's secure checkout to complete your payment.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="flex-1 border-border/20"
                        disabled={isProcessing}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-lg py-6 hover:scale-105 transition-all"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            Complete Payment
                            <CheckCircle className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="glass-strong border-border/20 p-6 sticky top-6">
              <h2 className="text-xl font-display font-bold mb-6 text-foreground">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹3,398</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Tax (10%)</span>
                  <span className="font-semibold">₹339.80</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Delivery</span>
                  <span className="font-semibold">
                    ₹{deliveryType === "express" ? "100" : "50"}
                  </span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="flex justify-between text-lg font-display font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">
                    ₹{(3398 + 339.80 + (deliveryType === "express" ? 100 : 50)).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
