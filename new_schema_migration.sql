-- =========================
-- NEW MINIMAL SCHEMA & MIGRATION FOR GASTROHUB
-- =========================
-- Drops all old tables, creates new schema, sets up RLS, seeds with test data

-- 1. DROP ALL EXISTING TABLES (CASCADE for FKs)
DROP TABLE IF EXISTS order_tracking CASCADE;
DROP TABLE IF EXISTS payment_method CASCADE;
DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS notification CASCADE;
DROP TABLE IF EXISTS cart_item CASCADE;
DROP TABLE IF EXISTS business_hour CASCADE;
DROP TABLE IF EXISTS delivery_zone CASCADE;
DROP TABLE IF EXISTS favorite CASCADE;
DROP TABLE IF EXISTS custom_category CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS order_item CASCADE;
DROP TABLE IF EXISTS "order" CASCADE;
DROP TABLE IF EXISTS listing CASCADE;
DROP TABLE IF EXISTS invoice CASCADE;
DROP TABLE IF EXISTS conversation_participant CASCADE;
DROP TABLE IF EXISTS conversation CASCADE;
DROP TABLE IF EXISTS message CASCADE;
DROP TABLE IF EXISTS profile CASCADE;

-- 2. CREATE TABLES
CREATE TABLE profile (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    full_name text NOT NULL,
    role text NOT NULL CHECK (role IN ('buyer', 'supplier', 'delivery_partner')),
    business_name text,
    phone text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE category (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    icon_name text,
    parent_id uuid REFERENCES category(id) ON DELETE CASCADE,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE custom_category (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by uuid REFERENCES profile(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    icon_name text,
    parent_id uuid REFERENCES custom_category(id) ON DELETE CASCADE,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE listing (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id uuid REFERENCES profile(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    price numeric NOT NULL,
    unit text NOT NULL,
    min_quantity integer,
    max_quantity integer,
    stock_quantity integer,
    category_id uuid REFERENCES category(id),
    location text,
    images text[],
    availability text DEFAULT 'in_stock',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE "order" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id uuid REFERENCES profile(id) ON DELETE SET NULL,
    buyer_id uuid REFERENCES profile(id) ON DELETE SET NULL,
    status text NOT NULL,
    total_amount numeric,
    payment_status text,
    estimated_delivery_date timestamptz,
    tracking_number text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE order_item (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES "order"(id) ON DELETE CASCADE,
    product_id uuid REFERENCES listing(id) ON DELETE SET NULL,
    quantity integer NOT NULL,
    unit_price numeric NOT NULL,
    total_price numeric NOT NULL
);

CREATE TABLE invoice (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES "order"(id) ON DELETE CASCADE,
    supplier_id uuid REFERENCES profile(id),
    buyer_id uuid REFERENCES profile(id),
    status text NOT NULL,
    pdf_url text,
    sent_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE favorite (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profile(id) ON DELETE CASCADE,
    target_type text NOT NULL,
    target_id uuid NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE delivery_zone (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id uuid REFERENCES profile(id) ON DELETE CASCADE,
    zone_name text NOT NULL,
    base_delivery_fee numeric,
    free_delivery_threshold numeric,
    max_delivery_distance integer,
    estimated_delivery_hours integer,
    cities text[],
    postal_codes text[],
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE business_hour (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id uuid REFERENCES profile(id) ON DELETE CASCADE,
    day_of_week text NOT NULL,
    open_time time,
    close_time time,
    is_closed boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE cart_item (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profile(id) ON DELETE CASCADE,
    product_id uuid REFERENCES listing(id) ON DELETE CASCADE,
    quantity integer NOT NULL,
    added_at timestamptz DEFAULT now()
);

CREATE TABLE notification (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profile(id) ON DELETE CASCADE,
    type text NOT NULL,
    message text NOT NULL,
    read boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE review (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id uuid REFERENCES profile(id) ON DELETE SET NULL,
    target_id uuid NOT NULL,
    target_type text NOT NULL,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE payment_method (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profile(id) ON DELETE CASCADE,
    method_type text NOT NULL,
    details jsonb,
    is_default boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE order_tracking (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES "order"(id) ON DELETE CASCADE,
    status text NOT NULL,
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE conversation (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    archived boolean DEFAULT false
);

CREATE TABLE conversation_participant (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid REFERENCES conversation(id) ON DELETE CASCADE,
    user_id uuid REFERENCES profile(id) ON DELETE CASCADE
);

CREATE TABLE message (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid REFERENCES conversation(id) ON DELETE CASCADE,
    sender_id uuid REFERENCES profile(id) ON DELETE SET NULL,
    body text NOT NULL,
    created_at timestamptz DEFAULT now(),
    read_at timestamptz
);

-- 3. RLS POLICIES (EXAMPLES, ADJUST AS NEEDED)
-- Enable RLS for all tables
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing ENABLE ROW LEVEL SECURITY;
ALTER TABLE category ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_category ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zone ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hour ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification ENABLE ROW LEVEL SECURITY;
ALTER TABLE review ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_method ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participant ENABLE ROW LEVEL SECURITY;
ALTER TABLE message ENABLE ROW LEVEL SECURITY;

-- Example RLS: Only user can select/update their own profile
CREATE POLICY "Users can view their own profile" ON profile FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profile FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profile FOR INSERT WITH CHECK (auth.uid() = id);

-- Example RLS: Only supplier can manage their listings
CREATE POLICY "Suppliers can manage their listings" ON listing FOR ALL USING (auth.uid() = supplier_id);

-- Example RLS: Only participants can access a conversation
CREATE POLICY "Participants can view conversation" ON conversation_participant FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Participants can insert themselves" ON conversation_participant FOR INSERT WITH CHECK (auth.uid() = user_id);

-- (Add more policies for each table as needed, following this pattern)

-- 4. SEED DATA (ROBUST, FOR TESTING)
-- Insert test users
INSERT INTO profile (id, email, full_name, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'supplier6@test.com', 'Supplier Six', 'supplier'),
  ('22222222-2222-2222-2222-222222222222', 'buyer6@test.com', 'Buyer Six', 'buyer'),
  ('33333333-3333-3333-3333-333333333333', 'delivery6@test.com', 'Delivery Partner', 'delivery_partner'),
  ('44444444-4444-4444-4444-444444444444', 'supplier7@test.com', 'Supplier Seven', 'supplier'),
  ('55555555-5555-5555-5555-555555555555', 'buyer7@test.com', 'Buyer Seven', 'buyer')
ON CONFLICT (id) DO NOTHING;

-- Insert categories
-- Insert parent categories
INSERT INTO category (id, name, description, parent_id, icon_name, is_active, created_at, updated_at) VALUES
  ('c6215aa2-718b-4323-a32d-15ca11a5ee3c','Fresh Produce',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('e5eefcb1-b929-4c7b-81bd-73e0abbea020','Meat & Poultry',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('b580c967-7144-4465-81ef-152e50d3285c','Seafood',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('0c0e9797-3f8c-4d84-8eea-4c87c946fc3d','Dairy & Eggs',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('ea8f01d1-ec92-45f8-adab-9006b1feae6a','Dry Goods & Pantry',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('b8d1f5f8-0d61-4ac5-b3f6-080e849858df','Canned & Jarred Goods',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('f169657d-c004-41d6-ad87-202afb7afbb8','Beverages',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('ca08eeed-1e42-42e1-9bd6-a0d4b84602d2','Alcoholic Beverages',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('d7b92c97-b8b6-4298-aa2f-30defd3b6b4e','Frozen Goods',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('90def4f0-ef81-4f58-b0ea-8f397bd6dab6','Baked Goods',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('a84b5c3a-267e-4e6e-ae28-5d459b3f1beb','Sauces & Condiments',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('91c9f0f2-af50-443b-bd1d-56ed27d3ae62','Oils & Fats',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('2673ed25-d475-4fe9-a464-954f615f9055','Spices & Seasonings',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('478993ce-2f49-476b-b779-1b86029fd785','Baking Supplies',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('b8e7c7d1-4f09-4804-92e8-6d943ad1ac61','Cleaning & Hygiene Supplies',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('3b08bf0c-1024-49d5-acda-553963992795','Packaging & Disposables',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('fd282389-0ed7-4605-9fd1-5ba721ab473b','Kitchen Staples',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('682db2eb-d454-4564-808d-53216d027f4c','Breakfast Items',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('216e4a58-6334-4087-899f-db985e280d71','Snacks & Confectionery',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('2f6f662d-73de-4179-9949-8e4aeca4b07b','Dairy Alternatives',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00'),
  ('41fdfa7d-95fe-4d35-91f7-ac188de234a9','Vegetarian & Vegan Products',NULL,NULL,NULL,TRUE,'2025-06-17T20:31:03.096981+00:00','2025-06-17T20:31:03.096981+00:00');

-- Insert child categories
INSERT INTO category (name, description, parent_id) VALUES
  ('Vegetables', NULL, 'c6215aa2-718b-4323-a32d-15ca11a5ee3c'),
  ('Fruits', NULL, 'c6215aa2-718b-4323-a32d-15ca11a5ee3c'),
  ('Herbs', NULL, 'c6215aa2-718b-4323-a32d-15ca11a5ee3c'),
  ('Leafy Greens', NULL, 'c6215aa2-718b-4323-a32d-15ca11a5ee3c'),
  ('Microgreens', NULL, 'c6215aa2-718b-4323-a32d-15ca11a5ee3c'),
  ('Exotic Produce', NULL, 'c6215aa2-718b-4323-a32d-15ca11a5ee3c'),
  ('Beef', NULL, 'e5eefcb1-b929-4c7b-81bd-73e0abbea020'),
  ('Pork', NULL, 'e5eefcb1-b929-4c7b-81bd-73e0abbea020'),
  ('Lamb', NULL, 'e5eefcb1-b929-4c7b-81bd-73e0abbea020'),
  ('Poultry', NULL, 'e5eefcb1-b929-4c7b-81bd-73e0abbea020'),
  ('Fish', NULL, 'b580c967-7144-4465-81ef-152e50d3285c'),
  ('Shellfish', NULL, 'b580c967-7144-4465-81ef-152e50d3285c'),
  ('Crustaceans', NULL, 'b580c967-7144-4465-81ef-152e50d3285c'),
  ('Mollusks', NULL, 'b580c967-7144-4465-81ef-152e50d3285c'),
  ('Dairy', NULL, '0c0e9797-3f8c-4d84-8eea-4c87c946fc3d'),
  ('Eggs', NULL, '0c0e9797-3f8c-4d84-8eea-4c87c946fc3d'),
  ('Grains', NULL, 'ea8f01d1-ec92-45f8-adab-9006b1feae6a'),
  ('Canned Goods', NULL, 'b8d1f5f8-0d61-4ac5-b3f6-080e849858df'),
  ('Bottled Goods', NULL, 'b8d1f5f8-0d61-4ac5-b3f6-080e849858df'),
  ('Juices', NULL, 'f169657d-c004-41d6-ad87-202afb7afbb8'),
  ('Soda', NULL, 'f169657d-c004-41d6-ad87-202afb7afbb8'),
  ('Wine', NULL, 'ca08eeed-1e42-42e1-9bd6-a0d4b84602d2'),
  ('Beer', NULL, 'ca08eeed-1e42-42e1-9bd6-a0d4b84602d2'),
  ('Liquor', NULL, 'ca08eeed-1e42-42e1-9bd6-a0d4b84602d2'),
  ('Frozen Fruits', NULL, 'd7b92c97-b8b6-4298-aa2f-30defd3b6b4e'),
  ('Frozen Vegetables', NULL, 'd7b92c97-b8b6-4298-aa2f-30defd3b6b4e'),
  ('Frozen Meats', NULL, 'd7b92c97-b8b6-4298-aa2f-30defd3b6b4e'),
  ('Bread', NULL, '90def4f0-ef81-4f58-b0ea-8f397bd6dab6'),
  ('Pastries', NULL, '90def4f0-ef81-4f58-b0ea-8f397bd6dab6'),
  ('Cakes', NULL, '90def4f0-ef81-4f58-b0ea-8f397bd6dab6'),
  ('Ketchup', NULL, 'a84b5c3a-267e-4e6e-ae28-5d459b3f1beb'),
  ('Mayonnaise', NULL, 'a84b5c3a-267e-4e6e-ae28-5d459b3f1beb'),
  ('Mustard', NULL, 'a84b5c3a-267e-4e6e-ae28-5d459b3f1beb'),
  ('Relish', NULL, 'a84b5c3a-267e-4e6e-ae28-5d459b3f1beb'),
  ('Olive Oil', NULL, '91c9f0f2-af50-443b-bd1d-56ed27d3ae62'),
  ('Coconut Oil', NULL, '91c9f0f2-af50-443b-bd1d-56ed27d3ae62'),
  ('Salt', NULL, '2673ed25-d475-4fe9-a464-954f615f9055'),
  ('Pepper', NULL, '2673ed25-d475-4fe9-a464-954f615f9055'),
  ('Sugar', NULL, '2673ed25-d475-4fe9-a464-954f615f9055'),
  ('Flour', NULL, '478993ce-2f49-476b-b779-1b86029fd785'),
  ('Baking Powder', NULL, '478993ce-2f49-476b-b779-1b86029fd785'),
  ('Baking Soda', NULL, '478993ce-2f49-476b-b779-1b86029fd785'),
  ('Cleaning Supplies', NULL, 'b8e7c7d1-4f09-4804-92e8-6d943ad1ac61'),
  ('Hygiene Supplies', NULL, 'b8e7c7d1-4f09-4804-92e8-6d943ad1ac61'),
  ('Packaging Materials', NULL, '3b08bf0c-1024-49d5-acda-553963992795'),
  ('Disposables', NULL, '3b08bf0c-1024-49d5-acda-553963992795'),
  ('Pasta', NULL, 'fd282389-0ed7-4605-9fd1-5ba721ab473b'),
  ('Rice', NULL, 'fd282389-0ed7-4605-9fd1-5ba721ab473b'),
  ('Cereals', NULL, 'fd282389-0ed7-4605-9fd1-5ba721ab473b'),
  ('Breakfast Cereals', NULL, '682db2eb-d454-4564-808d-53216d027f4c'),
  ('Oatmeal', NULL, '682db2eb-d454-4564-808d-53216d027f4c'),
  ('Granola', NULL, '682db2eb-d454-4564-808d-53216d027f4c'),
  ('Chips', NULL, '216e4a58-6334-4087-899f-db985e280d71'),
  ('Cookies', NULL, '216e4a58-6334-4087-899f-db985e280d71'),
  ('Candy', NULL, '216e4a58-6334-4087-899f-db985e280d71'),
  ('Non-Dairy Milk', NULL, '2f6f662d-73de-4179-9949-8e4aeca4b07b'),
  ('Non-Dairy Yogurt', NULL, '2f6f662d-73de-4179-9949-8e4aeca4b07b'),
  ('Vegan Cheese', NULL, '2f6f662d-73de-4179-9949-8e4aeca4b07b'),
  ('Vegan Meat Alternatives', NULL, '41fdfa7d-95fe-4d35-91f7-ac188de234a9'),
  ('Vegan Snacks', NULL, '41fdfa7d-95fe-4d35-91f7-ac188de234a9'),
  ('Vegan Baking Supplies', NULL, '41fdfa7d-95fe-4d35-91f7-ac188de234a9');

-- Insert custom categories
INSERT INTO custom_category (id, created_by, name, description) VALUES
  ('cc111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Exotic Fruits', 'Rare imported fruits'),
  ('cc222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Gluten-Free', 'Gluten-free products'),
  ('cc333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Organic Dairy', 'Organic milk and cheese'),
  ('cc444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'Vegan Snacks', 'Plant-based snacks'),
  ('cc555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Local Greens', 'Locally grown leafy greens');

-- Insert listings
INSERT INTO listing (id, supplier_id, title, description, price, unit, min_quantity, max_quantity, stock_quantity, category_id, location, images) VALUES
  ('l1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Organic Tomatoes', 'Fresh organic tomatoes', 4.50, 'lb', 5, 50, 100, 'c1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Warehouse 1', ARRAY['tomatoes1.jpg']),
  ('l2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Baby Spinach', 'Tender baby spinach leaves', 3.00, 'lb', 2, 30, 80, 'c1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Warehouse 2', ARRAY['spinach.jpg']),
  ('l3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Sourdough Bread', 'Artisan sourdough', 5.00, 'loaf', 1, 20, 50, 'c3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Bakery', ARRAY['sourdough.jpg']),
  ('l4444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Farm Eggs', 'Free-range eggs', 2.50, 'dozen', 1, 10, 40, 'c2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Farm', ARRAY['eggs.jpg']),
  ('l5555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Apple Juice', 'Fresh pressed apple juice', 3.50, 'liter', 1, 25, 60, 'c5555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Warehouse 1', ARRAY['applejuice.jpg']);

INSERT INTO "order" (id, supplier_id, buyer_id, status, total_amount, payment_status) VALUES
  ('11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'pending', 45.00, 'pending'),
  ('22222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'completed', 25.00, 'paid'),
  ('33333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'cancelled', 60.00, 'refunded'),
  ('44444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'processing', 35.00, 'pending'),
  ('55555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'shipped', 28.00, 'paid');

-- Insert order items
INSERT INTO order_item (id, order_id, product_id, quantity, unit_price, total_price) VALUES
  ('oi111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'l1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 10, 4.50, 45.00),
  ('oi222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'l3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, 5.00, 25.00),
  ('oi333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'l4444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 12, 2.50, 30.00),
  ('oi444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o4444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'l2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 7, 3.00, 21.00),
  ('oi555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o5555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'l5555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 8, 3.50, 28.00);

-- Insert invoices
INSERT INTO invoice (id, order_id, supplier_id, buyer_id, status) VALUES
  ('inv11111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'draft'),
  ('inv22222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'sent'),
  ('inv33333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'paid'),
  ('inv44444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o4444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'cancelled'),
  ('inv55555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o5555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'paid');

-- Insert conversations
INSERT INTO conversation (id) VALUES
  ('conv1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('conv2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('conv3333-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('conv4444-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('conv5555-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

-- Insert conversation participants
INSERT INTO conversation_participant (id, conversation_id, user_id) VALUES
  ('cp111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'conv1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  ('cp222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'conv1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),
  ('cp333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'conv2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444'),
  ('cp444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'conv2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555'),
  ('cp555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'conv3333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333');

-- Insert messages
INSERT INTO message (id, conversation_id, sender_id, body) VALUES
  ('m1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'conv1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Hello, do you have more tomatoes?'),
  ('m2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'conv1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Yes, we have plenty available.'),
  ('m3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'conv2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Can I get 10 loaves of sourdough?'),
  ('m4444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'conv2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'Sure, I will reserve them for you.'),
  ('m5555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'conv3333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Delivery is scheduled for tomorrow.');

-- Insert favorites
INSERT INTO favorite (id, user_id, target_type, target_id) VALUES
  ('fav11111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'listing', 'l1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('fav22222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'listing', 'l3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('fav33333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'supplier', '11111111-1111-1111-1111-111111111111'),
  ('fav44444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'supplier', '44444444-4444-4444-4444-444444444444'),
  ('fav55555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'listing', 'l2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

-- Insert delivery zones
INSERT INTO delivery_zone (id, supplier_id, zone_name, base_delivery_fee, free_delivery_threshold, max_delivery_distance, estimated_delivery_hours, cities, postal_codes) VALUES
  ('dz111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Downtown', 5.00, 50.00, 10, 2, ARRAY['CityA'], ARRAY['1000']),
  ('dz222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Uptown', 7.00, 60.00, 15, 3, ARRAY['CityB'], ARRAY['2000']),
  ('dz333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Suburbs', 6.00, 55.00, 20, 4, ARRAY['CityC'], ARRAY['3000']),
  ('dz444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Industrial', 8.00, 70.00, 12, 2, ARRAY['CityD'], ARRAY['4000']),
  ('dz555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Old Town', 4.00, 40.00, 8, 1, ARRAY['CityE'], ARRAY['5000']);

-- Insert business hours
INSERT INTO business_hour (id, supplier_id, day_of_week, open_time, close_time, is_closed) VALUES
  ('bh111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Monday', '08:00', '17:00', false),
  ('bh222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Tuesday', '09:00', '18:00', false),
  ('bh333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Wednesday', '08:00', '17:00', false),
  ('bh444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Thursday', '09:00', '18:00', false),
  ('bh555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Friday', '08:00', '17:00', false);

-- Insert cart items
INSERT INTO cart_item (id, user_id, product_id, quantity) VALUES
  ('cart1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'l1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2),
  ('cart2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'l3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1),
  ('cart3333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'l2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3),
  ('cart4444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'l4444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2),
  ('cart5555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'l5555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1);

-- Insert notifications
INSERT INTO notification (id, user_id, type, message) VALUES
  ('notif111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'order', 'Your order has been shipped.'),
  ('notif222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'promo', 'New supplier discount available!'),
  ('notif333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'invoice', 'Your invoice is ready.'),
  ('notif444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'review', 'Thank you for your feedback!'),
  ('notif555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'delivery', 'Delivery scheduled for tomorrow.')
ON CONFLICT (id) DO NOTHING;

-- Insert reviews
INSERT INTO review (id, reviewer_id, target_id, target_type, rating, comment) VALUES
  ('rev11111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'l1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listing', 5, 'Excellent tomatoes!'),
  ('rev22222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'l3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listing', 4, 'Great bread!'),
  ('rev33333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'supplier', 5, 'Very responsive supplier.'),
  ('rev44444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'supplier', 4, 'Good communication.'),
  ('rev55555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'l2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listing', 5, 'Very fresh spinach.')
ON CONFLICT (id) DO NOTHING;

-- Insert payment methods
INSERT INTO payment_method (id, user_id, method_type, details, is_default) VALUES
  ('pm111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'card', '{"last4":"1234","brand":"Visa"}', true),
  ('pm222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'paypal', '{"email":"buyer2@paypal.com"}', true),
  ('pm333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'card', '{"last4":"5678","brand":"Mastercard"}', false),
  ('pm444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'card', '{"last4":"4321","brand":"Amex"}', false),
  ('pm555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'bank_transfer', '{"bank":"Bank A","iban":"RO1234"}', true)
ON CONFLICT (id) DO NOTHING;

-- Insert order tracking
INSERT INTO order_tracking (id, order_id, status) VALUES
  ('ot111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'processing'),
  ('ot222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'shipped'),
  ('ot333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'delivered'),
  ('ot444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o4444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cancelled'),
  ('ot555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o5555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'completed')
ON CONFLICT (id) DO NOTHING;

-- =========================
-- END OF SEED DATA
-- =========================

INSERT INTO order_item (id, order_id, product_id, quantity, unit_price, total_price) VALUES
  ('oi111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'l1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 10, 4.50, 45.00);

-- Insert invoice
INSERT INTO invoice (id, order_id, supplier_id, buyer_id, status) VALUES
  ('inv11111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'draft');

-- Insert a conversation and participants
INSERT INTO conversation (id) VALUES ('conv1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
INSERT INTO conversation_participant (id, conversation_id, user_id) VALUES
  ('cp111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'conv1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  ('cp222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'conv1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222');
INSERT INTO message (id, conversation_id, sender_id, body) VALUES
  ('m1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'conv1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Hello, do you have more tomatoes?');

-- Add more seed data as needed for your tests!
-- =========================
-- END OF MIGRATION
-- =========================
