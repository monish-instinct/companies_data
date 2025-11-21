-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('customer', 'store_owner', 'delivery_partner', 'ops_manager', 'super_admin');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT,
  name TEXT,
  date_of_birth DATE,
  gender TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  role user_role NOT NULL DEFAULT 'customer',
  is_suspended BOOLEAN DEFAULT FALSE,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create stores table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  address TEXT NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  service_radius_km INTEGER DEFAULT 15,
  open_hours JSONB DEFAULT '{"monday": {"open": "09:00", "close": "21:00"}, "tuesday": {"open": "09:00", "close": "21:00"}, "wednesday": {"open": "09:00", "close": "21:00"}, "thursday": {"open": "09:00", "close": "21:00"}, "friday": {"open": "09:00", "close": "21:00"}, "saturday": {"open": "09:00", "close": "21:00"}, "sunday": {"open": "10:00", "close": "20:00"}}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'suspended')),
  logo_url TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  mrp DECIMAL(10, 2) NOT NULL,
  variants JSONB DEFAULT '[]',
  images TEXT[] DEFAULT '{}',
  material TEXT,
  care_instructions TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(store_id, sku)
);

-- Create inventory table
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_key TEXT NOT NULL DEFAULT 'default',
  stock_count INTEGER NOT NULL DEFAULT 0,
  reserved_count INTEGER NOT NULL DEFAULT 0,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, variant_key)
);

-- Create cart table
CREATE TABLE public.cart (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_key TEXT DEFAULT 'default',
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id, variant_key)
);

-- Create wishlist table
CREATE TABLE public.wishlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  store_id UUID NOT NULL REFERENCES public.stores(id),
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  delivery_charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  order_status TEXT DEFAULT 'placed' CHECK (order_status IN ('placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned')),
  delivery_address JSONB NOT NULL,
  delivery_type TEXT DEFAULT 'standard' CHECK (delivery_type IN ('express', 'standard')),
  assigned_delivery_id UUID REFERENCES auth.users(id),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create order events table for tracking
CREATE TABLE public.order_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  message TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create exchanges table
CREATE TABLE public.exchanges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'rejected', 'pickup_scheduled', 'picked_up', 'completed')),
  images TEXT[] DEFAULT '{}',
  approved_by UUID REFERENCES auth.users(id),
  pickup_scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create ratings table
CREATE TABLE public.ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  store_id UUID REFERENCES public.stores(id),
  product_id UUID REFERENCES public.products(id),
  order_id UUID REFERENCES public.orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, order_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for stores (public read, owner write)
CREATE POLICY "Stores are viewable by everyone" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Store owners can update their stores" ON public.stores FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Store owners can insert stores" ON public.stores FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Create RLS policies for products (public read, store owner write)
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Store owners can manage their products" ON public.products FOR ALL USING (
  auth.uid() IN (SELECT owner_id FROM public.stores WHERE id = store_id)
);

-- Create RLS policies for inventory (public read, store owner write)
CREATE POLICY "Inventory is viewable by everyone" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Store owners can manage inventory" ON public.inventory FOR ALL USING (
  auth.uid() IN (
    SELECT s.owner_id FROM public.stores s 
    JOIN public.products p ON s.id = p.store_id 
    WHERE p.id = product_id
  )
);

-- Create RLS policies for cart (user-specific)
CREATE POLICY "Users can manage their own cart" ON public.cart FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for wishlist (user-specific)
CREATE POLICY "Users can manage their own wishlist" ON public.wishlist FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Store owners can view orders for their stores" ON public.orders FOR SELECT USING (
  auth.uid() IN (SELECT owner_id FROM public.stores WHERE id = store_id)
);
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for order events
CREATE POLICY "Users can view events for their orders" ON public.order_events FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM public.orders WHERE id = order_id)
);

-- Create RLS policies for exchanges
CREATE POLICY "Users can manage exchanges for their orders" ON public.exchanges FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM public.orders WHERE id = order_id)
);

-- Create RLS policies for ratings
CREATE POLICY "Users can manage their own ratings" ON public.ratings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Ratings are viewable by everyone" ON public.ratings FOR SELECT USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_exchanges_updated_at BEFORE UPDATE ON public.exchanges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();