-- ============================================
-- COMPLETE DATABASE RECREATION MIGRATION
-- ============================================

-- Drop all existing tables, policies, and constraints
DROP POLICY IF EXISTS "Users can view their own orders as buyer" ON "Order";
DROP POLICY IF EXISTS "Users can view their own orders as supplier" ON "Order";
DROP POLICY IF EXISTS "Users can create orders as buyer" ON "Order";
DROP POLICY IF EXISTS "Suppliers can update their orders" ON "Order";
DROP POLICY IF EXISTS "Everyone can view active listings" ON "Listing";
DROP POLICY IF EXISTS "Suppliers can manage their own listings" ON "Listing";
DROP POLICY IF EXISTS "Users can view order items for their orders" ON "OrderItem";
DROP POLICY IF EXISTS "Users can create order items for their orders" ON "OrderItem";
DROP POLICY IF EXISTS "Users can manage their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can create their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Suppliers can manage their own inventory" ON inventory;
DROP POLICY IF EXISTS "Everyone can view available inventory" ON inventory;
DROP POLICY IF EXISTS "Anyone can view available inventory" ON inventory;
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON messages;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view participants in their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can add themselves to conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can join conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Order participants can view tracking" ON order_tracking;
DROP POLICY IF EXISTS "Suppliers and delivery partners can update tracking" ON order_tracking;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Drop all tables in dependency order
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_tracking CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS "OrderItem" CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "Listing" CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS delivery_zones CASCADE;
DROP TABLE IF EXISTS custom_categories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS business_hours CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop enums
DROP TYPE IF EXISTS "OrderStatus" CASCADE;
DROP TYPE IF EXISTS "DeliveryStatus" CASCADE;
DROP TYPE IF EXISTS "UserRole" CASCADE;
DROP TYPE IF EXISTS app_role CASCADE;

-- Create enums
CREATE TYPE "OrderStatus" AS ENUM (
  'PENDING',
  'APPROVED',
  'REJECTED',
  'IN_PREPARATION',
  'READY_FOR_PICKUP',
  'IN_TRANSIT',
  'DELIVERED',
  'CANCELLED'
);

CREATE TYPE "DeliveryStatus" AS ENUM (
  'PENDING',
  'ASSIGNED',
  'PICKED_UP',
  'IN_TRANSIT',
  'DELIVERED',
  'FAILED'
);

CREATE TYPE "UserRole" AS ENUM (
  'SUPPLIER',
  'BUYER',
  'DELIVERY_PARTNER'
);

CREATE TYPE app_role AS ENUM (
  'admin',
  'moderator',
  'user'
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'buyer',
  business_name text,
  business_address text,
  business_type text,
  business_description text,
  website_url text,
  registration_number text,
  tax_number text,
  subscription_tier text DEFAULT 'free',
  logo_url text,
  banking_details jsonb,
  is_verified boolean DEFAULT false,
  reset_token text,
  reset_token_expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  parent_id uuid REFERENCES categories(id),
  icon_name text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create custom_categories table
CREATE TABLE custom_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  parent_id uuid REFERENCES categories(id),
  icon_name text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create business_hours table
CREATE TABLE business_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time time,
  close_time time,
  is_closed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create subscription_plans table
CREATE TABLE subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price_monthly numeric,
  price_yearly numeric,
  max_listings integer,
  max_orders_per_month integer,
  commission_rate numeric DEFAULT 0.05,
  features jsonb NOT NULL DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create user_subscriptions table
CREATE TABLE user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES subscription_plans(id),
  status text NOT NULL DEFAULT 'active',
  stripe_subscription_id text,
  current_period_start timestamp with time zone DEFAULT now(),
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create Listing table
CREATE TABLE "Listing" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "supplierId" uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  price numeric NOT NULL,
  unit text NOT NULL,
  "minOrder" integer NOT NULL DEFAULT 1,
  "maxOrder" integer,
  images text[],
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp without time zone NOT NULL
);

-- Create Order table
CREATE TABLE "Order" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "buyerId" uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  "supplierId" uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  "totalAmount" numeric NOT NULL,
  "deliveryAddress" text NOT NULL,
  "deliveryNotes" text,
  status "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp without time zone NOT NULL
);

-- Create OrderItem table
CREATE TABLE "OrderItem" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "orderId" uuid NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  "listingId" uuid NOT NULL REFERENCES "Listing"(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create cart_items table
CREATE TABLE cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES "Listing"(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Create inventory table
CREATE TABLE inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES "Listing"(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id),
  current_stock numeric NOT NULL DEFAULT 0,
  minimum_stock numeric DEFAULT 0,
  unit_price numeric NOT NULL,
  unit_type text NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create conversations table
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES "Order"(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create conversation_participants table
CREATE TABLE conversation_participants (
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, user_id)
);

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create remaining tables
CREATE TABLE delivery_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  zone_name text NOT NULL,
  base_delivery_fee numeric NOT NULL DEFAULT 0,
  free_delivery_threshold numeric,
  max_delivery_distance integer,
  estimated_delivery_hours integer DEFAULT 24,
  cities text[],
  postal_codes text[],
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES "Order"(id) ON DELETE CASCADE,
  supplier_id uuid REFERENCES profiles(id),
  buyer_id uuid REFERENCES profiles(id),
  status text DEFAULT 'draft',
  pdf_url text,
  sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE order_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  status text NOT NULL,
  message text,
  location jsonb,
  updated_by uuid REFERENCES profiles(id),
  estimated_delivery timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  provider text NOT NULL,
  last_four text,
  expiry_month integer,
  expiry_year integer,
  is_default boolean DEFAULT false,
  is_active boolean DEFAULT true,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id uuid REFERENCES "Order"(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_custom_categories_updated_at BEFORE UPDATE ON custom_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_hours_updated_at BEFORE UPDATE ON business_hours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delivery_zones_updated_at BEFORE UPDATE ON delivery_zones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Listing" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);

-- Custom categories policies
CREATE POLICY "Users can manage their own custom categories" ON custom_categories FOR ALL USING (user_id = auth.uid());

-- Business hours policies
CREATE POLICY "Users can manage their own business hours" ON business_hours FOR ALL USING (user_id = auth.uid());

-- Subscription plans policies (public read)
CREATE POLICY "Anyone can view subscription plans" ON subscription_plans FOR SELECT USING (is_active = true);

-- User subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions FOR SELECT USING (user_id = auth.uid());

-- Listing policies
CREATE POLICY "Everyone can view active listings" ON "Listing" FOR SELECT USING ("isActive" = true);
CREATE POLICY "Suppliers can manage their own listings" ON "Listing" FOR ALL USING ("supplierId" = auth.uid());

-- Order policies
CREATE POLICY "Users can view their own orders as buyer" ON "Order" FOR SELECT USING ("buyerId" = auth.uid());
CREATE POLICY "Users can view their own orders as supplier" ON "Order" FOR SELECT USING ("supplierId" = auth.uid());
CREATE POLICY "Users can create orders as buyer" ON "Order" FOR INSERT WITH CHECK ("buyerId" = auth.uid());
CREATE POLICY "Suppliers can update their orders" ON "Order" FOR UPDATE USING ("supplierId" = auth.uid());

-- OrderItem policies
CREATE POLICY "Users can view order items for their orders" ON "OrderItem" FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "Order" o 
    WHERE o.id = "OrderItem"."orderId" 
    AND (o."buyerId" = auth.uid() OR o."supplierId" = auth.uid())
  )
);
CREATE POLICY "Users can create order items for their orders" ON "OrderItem" FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "Order" o 
    WHERE o.id = "OrderItem"."orderId" 
    AND o."buyerId" = auth.uid()
  )
);

-- Cart items policies
CREATE POLICY "Users can manage their own cart items" ON cart_items FOR ALL USING (user_id = auth.uid());

-- Inventory policies
CREATE POLICY "Suppliers can manage their own inventory" ON inventory FOR ALL USING (supplier_id = auth.uid());
CREATE POLICY "Everyone can view available inventory" ON inventory FOR SELECT USING (is_available = true);

-- Messaging policies
CREATE POLICY "Users can view their own conversations" ON conversations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = conversations.id
    AND cp.user_id = auth.uid()
  )
);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view participants in their conversations" ON conversation_participants FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
  )
);
CREATE POLICY "Users can add themselves to conversations" ON conversation_participants FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own messages" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = messages.conversation_id
    AND cp.user_id = auth.uid()
  )
);
CREATE POLICY "Users can send messages to their conversations" ON messages FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = messages.conversation_id
    AND cp.user_id = auth.uid()
  )
);

-- Remaining policies
CREATE POLICY "Users can manage their own delivery zones" ON delivery_zones FOR ALL USING (supplier_id = auth.uid());
CREATE POLICY "Users can manage their own favorites" ON favorites FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can view their own invoices" ON invoices FOR SELECT USING (supplier_id = auth.uid() OR buyer_id = auth.uid());
CREATE POLICY "Users can view their own notifications" ON notifications FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Order participants can view tracking" ON order_tracking FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "Order" o 
    WHERE o.id = order_tracking.order_id 
    AND (o."buyerId" = auth.uid() OR o."supplierId" = auth.uid())
  )
);
CREATE POLICY "Suppliers can add tracking updates" ON order_tracking FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "Order" o 
    WHERE o.id = order_tracking.order_id 
    AND o."supplierId" = auth.uid()
  )
);
CREATE POLICY "Users can manage their own payment methods" ON payment_methods FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can view reviews about them" ON reviews FOR SELECT USING (reviewee_id = auth.uid() OR reviewer_id = auth.uid());
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_listing_supplier ON "Listing"("supplierId");
CREATE INDEX idx_listing_category ON "Listing"(category);
CREATE INDEX idx_listing_active ON "Listing"("isActive");
CREATE INDEX idx_order_buyer ON "Order"("buyerId");
CREATE INDEX idx_order_supplier ON "Order"("supplierId");
CREATE INDEX idx_order_status ON "Order"(status);
CREATE INDEX idx_orderitem_order ON "OrderItem"("orderId");
CREATE INDEX idx_orderitem_listing ON "OrderItem"("listingId");
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_cart_listing ON cart_items(listing_id);
CREATE INDEX idx_inventory_supplier ON inventory(supplier_id);
CREATE INDEX idx_inventory_available ON inventory(is_available);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_conversation_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Enable realtime for messages
ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Create handle_new_user function for auth trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
    );
    
    -- Assign free subscription plan
    INSERT INTO public.user_subscriptions (user_id, plan_id, status, current_period_end)
    SELECT 
        NEW.id,
        sp.id,
        'active',
        now() + interval '1 year'
    FROM subscription_plans sp 
    WHERE sp.name = 'Free'
    LIMIT 1;
    
    RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
