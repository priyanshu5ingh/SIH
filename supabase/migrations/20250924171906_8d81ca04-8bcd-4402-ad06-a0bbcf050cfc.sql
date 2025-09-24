-- Create enum types for product categories and supply chain stages
CREATE TYPE product_category AS ENUM ('herb', 'powder', 'oil', 'capsule', 'tablet', 'tincture');
CREATE TYPE supply_chain_stage AS ENUM ('cultivation', 'harvesting', 'processing', 'packaging', 'distribution', 'retail');
CREATE TYPE transaction_status AS ENUM ('pending', 'verified', 'completed');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  role TEXT DEFAULT 'consumer',
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category product_category NOT NULL,
  description TEXT,
  origin_location TEXT,
  cultivation_method TEXT,
  certifications TEXT[],
  created_by UUID REFERENCES public.profiles(user_id),
  qr_code_data TEXT,
  blockchain_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create supply chain events table
CREATE TABLE public.supply_chain_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  stage supply_chain_stage NOT NULL,
  actor_id UUID REFERENCES public.profiles(user_id),
  actor_name TEXT NOT NULL,
  location TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  temperature DECIMAL,
  humidity DECIMAL,
  notes TEXT,
  verification_status transaction_status DEFAULT 'pending',
  blockchain_hash TEXT,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blockchain transactions table for simulation
CREATE TABLE public.blockchain_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_hash TEXT NOT NULL UNIQUE,
  block_number INTEGER NOT NULL,
  product_id UUID REFERENCES public.products(id),
  event_id UUID REFERENCES public.supply_chain_events(id),
  transaction_type TEXT NOT NULL,
  data JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  gas_used INTEGER DEFAULT 21000,
  verification_status transaction_status DEFAULT 'pending'
);

-- Create QR code scans table for analytics
CREATE TABLE public.qr_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  scanner_ip TEXT,
  location TEXT,
  user_agent TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_chain_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_scans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for products
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create products" ON public.products FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own products" ON public.products FOR UPDATE USING (auth.uid() = created_by);

-- Create RLS policies for supply chain events
CREATE POLICY "Supply chain events are viewable by everyone" ON public.supply_chain_events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add supply chain events" ON public.supply_chain_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = actor_id);

-- Create RLS policies for blockchain transactions (read-only for transparency)
CREATE POLICY "Blockchain transactions are viewable by everyone" ON public.blockchain_transactions FOR SELECT USING (true);

-- Create RLS policies for QR scans (public read for analytics)
CREATE POLICY "QR scans are viewable by everyone" ON public.qr_scans FOR SELECT USING (true);
CREATE POLICY "Anyone can insert QR scans" ON public.qr_scans FOR INSERT WITH CHECK (true);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_products_product_id ON public.products(product_id);
CREATE INDEX idx_supply_chain_events_product_id ON public.supply_chain_events(product_id);
CREATE INDEX idx_blockchain_transactions_product_id ON public.blockchain_transactions(product_id);
CREATE INDEX idx_qr_scans_product_id ON public.qr_scans(product_id);