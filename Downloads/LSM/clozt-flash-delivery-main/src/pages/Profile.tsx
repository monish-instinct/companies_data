import { motion } from "framer-motion";
import { User, MapPin, CreditCard, Heart, Package, Settings, LogOut, Camera, Mail, Phone, Calendar, TrendingUp, Star, ShoppingBag, Upload, Plus, Trash, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, reviews: 0 });
  const isDemoUser = !!(user && typeof (user as any).id === 'string' && (user as any).id.startsWith('demo-'));
  const demoAddrKey = user ? `demoAddresses:${(user as any).id}` : '';
  const demoProfileKey = user ? `demoProfile:${(user as any).id}` : '';
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: "home",
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
  });
  
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    date_of_birth: "",
    gender: "",
  });

  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (user) {
      loadProfile();
      loadStats();
      loadAddresses();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      if (isDemoUser) {
        try {
          const raw = demoProfileKey ? localStorage.getItem(demoProfileKey) : null;
          if (raw) {
            const data = JSON.parse(raw);
            setProfile({
              name: data.name || "",
              phone: data.phone || "",
              date_of_birth: data.date_of_birth || "",
              gender: data.gender || "",
            });
            return;
          }
        } catch {}
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile({
          name: data.name || "",
          phone: data.phone || "",
          date_of_birth: data.date_of_birth || "",
          gender: data.gender || "",
        });
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
    }
  };

  const loadStats = async () => {
    try {
      const [ordersRes, wishlistRes, ratingsRes] = await Promise.all([
        supabase.from('orders').select('id', { count: 'exact' }).eq('user_id', user?.id),
        supabase.from('wishlist').select('id', { count: 'exact' }).eq('user_id', user?.id),
        supabase.from('ratings').select('id', { count: 'exact' }).eq('user_id', user?.id),
      ]);

      setStats({
        orders: ordersRes.count || 0,
        wishlist: wishlistRes.count || 0,
        reviews: ratingsRes.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadAddresses = async () => {
    try {
      if (isDemoUser) {
        try {
          const raw = demoAddrKey ? localStorage.getItem(demoAddrKey) : null;
          const data: Address[] = raw ? JSON.parse(raw) : [];
          setAddresses(data);
          return;
        } catch {}
      }

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const handleAddressSubmit = async () => {
    if (!addressForm.full_name || !addressForm.phone || !addressForm.address_line1 || !addressForm.city || !addressForm.state || !addressForm.postal_code) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isDemoUser) {
        // Demo-mode local CRUD
        const raw = demoAddrKey ? localStorage.getItem(demoAddrKey) : null;
        const list: Address[] = raw ? JSON.parse(raw) : [];
        if (editingAddress) {
          const updated = list.map(a => a.id === editingAddress.id ? { ...a, ...addressForm } : a);
          try { if (demoAddrKey) localStorage.setItem(demoAddrKey, JSON.stringify(updated)); } catch {}
          setAddresses(updated);
          toast({ title: "Address Updated", description: "Your address has been updated successfully" });
        } else {
          const id = 'addr-' + Math.random().toString(36).slice(2, 10);
          const addr: Address = { id, is_default: list.length === 0, ...(addressForm as any) } as Address;
          const updated = [...list, addr];
          try { if (demoAddrKey) localStorage.setItem(demoAddrKey, JSON.stringify(updated)); } catch {}
          setAddresses(updated);
          toast({ title: "Address Added", description: "Your address has been added successfully" });
        }
      } else {
        if (editingAddress) {
          // Update existing address
          const { error } = await supabase
            .from('addresses')
            .update(addressForm)
            .eq('id', editingAddress.id);

          if (error) throw error;

          toast({ title: "Address Updated", description: "Your address has been updated successfully" });
        } else {
          // Add new address
          const { error } = await supabase
            .from('addresses')
            .insert([{
              user_id: user?.id,
              ...addressForm,
              is_default: addresses.length === 0,
            }]);

          if (error) throw error;

          toast({ title: "Address Added", description: "Your address has been added successfully" });
        }
      }

      setShowAddressDialog(false);
      setEditingAddress(null);
      setAddressForm({
        label: "home",
        full_name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
      });
      loadAddresses();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      if (isDemoUser) {
        const raw = demoAddrKey ? localStorage.getItem(demoAddrKey) : null;
        const list: Address[] = raw ? JSON.parse(raw) : [];
        const updated = list.filter(a => a.id !== id);
        try { if (demoAddrKey) localStorage.setItem(demoAddrKey, JSON.stringify(updated)); } catch {}
        setAddresses(updated);
        toast({ title: "Address Deleted", description: "Your address has been removed" });
        return;
      }

      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({ title: "Address Deleted", description: "Your address has been removed" });

      loadAddresses();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setAddressForm({
      label: addr.label,
      full_name: addr.full_name,
      phone: addr.phone,
      address_line1: addr.address_line1,
      address_line2: addr.address_line2 || "",
      city: addr.city,
      state: addr.state,
      postal_code: addr.postal_code,
    });
    setShowAddressDialog(true);
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      if (isDemoUser) {
        const raw = demoAddrKey ? localStorage.getItem(demoAddrKey) : null;
        const list: Address[] = raw ? JSON.parse(raw) : [];
        const updated = list.map(a => ({ ...a, is_default: a.id === id }));
        try { if (demoAddrKey) localStorage.setItem(demoAddrKey, JSON.stringify(updated)); } catch {}
        setAddresses(updated);
        toast({ title: "Default Address Updated", description: "Your default address has been changed" });
        return;
      }

      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;

      toast({ title: "Default Address Updated", description: "Your default address has been changed" });

      loadAddresses();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isDemoUser) {
        try {
          if (demoProfileKey) localStorage.setItem(demoProfileKey, JSON.stringify(profile));
        } catch {}
        toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          name: profile.name,
          phone: profile.phone,
          date_of_birth: profile.date_of_birth || null,
          gender: profile.gender || null,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const quickLinks = [
    { icon: Package, label: "Orders", path: "/account/orders", count: stats.orders },
    { icon: Heart, label: "Wishlist", path: "/wishlist", count: stats.wishlist },
    { icon: Star, label: "Reviews", path: "#reviews", count: stats.reviews },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const statCards = [
    { icon: ShoppingBag, label: "Total Orders", value: stats.orders, color: "from-blue-500 to-cyan-500" },
    { icon: Heart, label: "Wishlist Items", value: stats.wishlist, color: "from-pink-500 to-rose-500" },
    { icon: Star, label: "Reviews Given", value: stats.reviews, color: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Floating Orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Header */}
      <motion.header
        className="relative z-10 border-b border-border/20 glass-strong"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  My Profile
                </h1>
                <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="border-border/20"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {statCards.map((stat, idx) => (
            <Card key={stat.label} className="glass border-border/20 overflow-hidden group hover:scale-105 transition-transform">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
            </Card>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="glass-strong border-border/20 p-6 sticky top-6">
              {/* Profile Avatar */}
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4 group">
                  <Avatar className="w-24 h-24 border-4 border-primary/20">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-2xl font-bold">
                      {profile.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>
                <h3 className="text-xl font-display font-bold text-foreground">
                  {profile.name || "User"}
                </h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>

              {/* Quick Links */}
              <div className="space-y-2">
                {quickLinks.map((link) => (
                  <Button
                    key={link.label}
                    variant="ghost"
                    onClick={() => navigate(link.path)}
                    className="w-full justify-between hover:bg-primary/10 group"
                  >
                    <div className="flex items-center">
                      <link.icon className="w-4 h-4 mr-3 group-hover:text-primary transition-colors" />
                      {link.label}
                    </div>
                    {link.count !== undefined && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                        {link.count}
                      </span>
                    )}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  onClick={signOut}
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass border-border/20 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    Personal Information
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="glass border-border/20 mt-2"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="glass border-border/20 mt-2 opacity-50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="glass border-border/20 mt-2"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dob" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={profile.date_of_birth}
                      onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                      className="glass border-border/20 mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gender" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Gender
                    </Label>
                    <Select value={profile.gender} onValueChange={(value) => setProfile({ ...profile, gender: value })}>
                      <SelectTrigger className="glass border-border/20 mt-2">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button
                  className="mt-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </Card>
            </motion.div>

            {/* Saved Addresses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              id="addresses"
            >
              <Card className="glass border-border/20 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-foreground">
                      Saved Addresses
                    </h2>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                    onClick={() => {
                      setEditingAddress(null);
                      setAddressForm({
                        label: "home",
                        full_name: "",
                        phone: "",
                        address_line1: "",
                        address_line2: "",
                        city: "",
                        state: "",
                        postal_code: "",
                      });
                      setShowAddressDialog(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Address
                  </Button>
                </div>

{addresses.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <Card
                        key={addr.id}
                        className="glass border-border/20 p-6 hover:border-primary/50 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                              <MapPin className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-display font-semibold text-foreground capitalize">
                              {addr.label}
                            </span>
                          </div>
                          {addr.is_default && (
                            <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 mb-4">
                          <p className="text-sm font-medium text-foreground">{addr.full_name}</p>
                          <p className="text-sm text-muted-foreground">{addr.address_line1}</p>
                          {addr.address_line2 && (
                            <p className="text-sm text-muted-foreground">{addr.address_line2}</p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {addr.city}, {addr.state} - {addr.postal_code}
                          </p>
                          <p className="text-sm text-muted-foreground">Phone: {addr.phone}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 border-border/20"
                            onClick={() => handleEditAddress(addr)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          {!addr.is_default && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 border-border/20"
                              onClick={() => handleSetDefaultAddress(addr.id)}
                            >
                              Set Default
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-border/20 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteAddress(addr.id)}
                          >
                            <Trash className="w-3 h-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No addresses saved yet</p>
                    <Button 
                      onClick={() => setShowAddressDialog(true)}
                      className="bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Address
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              id="payments"
            >
              <Card className="glass border-border/20 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-foreground">
                      Payment Methods
                    </h2>
                  </div>
                  <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Card
                  </Button>
                </div>

                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="w-10 h-10 text-primary/50" />
                  </div>
                  <p className="text-lg text-foreground font-medium mb-2">
                    No payment methods saved yet
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Add your first card to make checkout faster
                  </p>
                  <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                    Add Your First Card
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Address Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="glass-strong max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Address Label</Label>
              <Select value={addressForm.label} onValueChange={(value) => setAddressForm({ ...addressForm, label: value })}>
                <SelectTrigger className="glass mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={addressForm.full_name}
                  onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                  className="glass mt-2"
                />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="glass mt-2"
                />
              </div>
            </div>
            <div>
              <Label>Address Line 1 *</Label>
              <Input
                value={addressForm.address_line1}
                onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                className="glass mt-2"
              />
            </div>
            <div>
              <Label>Address Line 2</Label>
              <Input
                value={addressForm.address_line2}
                onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
                className="glass mt-2"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>City *</Label>
                <Input
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="glass mt-2"
                />
              </div>
              <div>
                <Label>State *</Label>
                <Input
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="glass mt-2"
                />
              </div>
              <div>
                <Label>Postal Code *</Label>
                <Input
                  value={addressForm.postal_code}
                  onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                  className="glass mt-2"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddressDialog(false);
                setEditingAddress(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddressSubmit}
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground"
            >
              {editingAddress ? "Update" : "Add"} Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;