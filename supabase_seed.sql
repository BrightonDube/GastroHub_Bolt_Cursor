-- ============================================
-- COMPREHENSIVE SEED DATA FOR ALL TABLES
-- ============================================

-- WARNING: This script assumes a fresh DB. Remove DELETEs if running on production data!
-- Clear existing data (order matters for FKs)
DELETE FROM order_tracking;
DELETE FROM orderitem;
DELETE FROM order;
DELETE FROM delivery_zones;
DELETE FROM inventory;
DELETE FROM listing;
DELETE FROM categories;
DELETE FROM custom_categories;
DELETE FROM favorites;
DELETE FROM business_hours;
DELETE FROM cart_items;
DELETE FROM conversations;
DELETE FROM conversation_participants;
DELETE FROM messages;
DELETE FROM notifications;
DELETE FROM payment_methods;
DELETE FROM reviews;
DELETE FROM invoices;
DELETE FROM profiles;
DELETE FROM subscription_plans;

-- 1. Insert subscription plans
INSERT INTO subscription_plans (title, description, price_monthly, price_yearly, features, max_listings, max_orders_per_month, commission_rate) VALUES
('Free', 'Basic plan for getting started', 0, 0, '["Basic listing", "Standard support", "Up to 5 listings"]', 5, 10, 0.10),
('Pro', 'Professional plan for growing businesses', 29.99, 299.99, '["Unlimited listings", "Priority support", "Analytics dashboard", "Advanced messaging"]', NULL, 100, 0.05),
('Enterprise', 'Enterprise plan for large operations', 99.99, 999.99, '["Everything in Pro", "Custom integrations", "Dedicated support", "White-label options"]', NULL, NULL, 0.03)
ON CONFLICT DO NOTHING;

-- 2. Insert 10 suppliers into profiles
INSERT INTO profiles (
  id, email, full_title, role, business_title, business_address, business_type, business_description,
  website_url, registration_number, tax_number, subscription_tier, logo_url, banking_details,
  is_verified, created_at, updated_at
) VALUES
  ('11111111-1111-1111-1111-111111111111', 'supplier1@example.com', 'Supplier One', 'supplier', 'Supplier One Pty', '123 Main St', 'Food', 'Quality food supplier', 'https://supplier1.com', 'REG001', 'TAX001', 'Pro', 'https://logo.com/1.png', 'Bank 1', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('22222222-2222-2222-2222-222222222222', 'supplier2@example.com', 'Supplier Two', 'supplier', 'Supplier Two Pty', '234 Main St', 'Beverage', 'Drinks and more', 'https://supplier2.com', 'REG002', 'TAX002', 'Pro', 'https://logo.com/2.png', 'Bank 2', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('33333333-3333-3333-3333-333333333333', 'supplier3@example.com', 'Supplier Three', 'supplier', 'Supplier Three Pty', '345 Main St', 'Bakery', 'Fresh bread daily', 'https://supplier3.com', 'REG003', 'TAX003', 'Pro', 'https://logo.com/3.png', 'Bank 3', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('44444444-4444-4444-4444-444444444444', 'supplier4@example.com', 'Supplier Four', 'supplier', 'Supplier Four Pty', '456 Main St', 'Produce', 'Organic produce', 'https://supplier4.com', 'REG004', 'TAX004', 'Pro', 'https://logo.com/4.png', 'Bank 4', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('55555555-5555-5555-5555-555555555555', 'supplier5@example.com', 'Supplier Five', 'supplier', 'Supplier Five Pty', '567 Main St', 'Dairy', 'Dairy products', 'https://supplier5.com', 'REG005', 'TAX005', 'Pro', 'https://logo.com/5.png', 'Bank 5', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('66666666-6666-6666-6666-666666666666', 'supplier6@example.com', 'Supplier Six', 'supplier', 'Supplier Six Pty', '678 Main St', 'Meat', 'Meat supplier', 'https://supplier6.com', 'REG006', 'TAX006', 'Pro', 'https://logo.com/6.png', 'Bank 6', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('77777777-7777-7777-7777-777777777777', 'supplier7@example.com', 'Supplier Seven', 'supplier', 'Supplier Seven Pty', '789 Main St', 'Seafood', 'Seafood supplier', 'https://supplier7.com', 'REG007', 'TAX007', 'Pro', 'https://logo.com/7.png', 'Bank 7', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('88888888-8888-8888-8888-888888888888', 'supplier8@example.com', 'Supplier Eight', 'supplier', 'Supplier Eight Pty', '890 Main St', 'Snacks', 'Snack foods', 'https://supplier8.com', 'REG008', 'TAX008', 'Pro', 'https://logo.com/8.png', 'Bank 8', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('99999999-9999-9999-9999-999999999999', 'supplier9@example.com', 'Supplier Nine', 'supplier', 'Supplier Nine Pty', '901 Main St', 'Frozen', 'Frozen foods', 'https://supplier9.com', 'REG009', 'TAX009', 'Pro', 'https://logo.com/9.png', 'Bank 9', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'supplier10@example.com', 'Supplier Ten', 'supplier', 'Supplier Ten Pty', '999 Main St', 'Bakery', 'Fresh bread daily', 'https://supplier10.com', 'REG010', 'TAX010', 'Pro', 'https://logo.com/10.png', 'Bank 10', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3. Insert 3 buyers into profiles
INSERT INTO profiles (
  id, email, full_title, role, created_at, updated_at
) VALUES
  ('b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'buyer1@example.com', 'Buyer One', 'buyer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'buyer2@example.com', 'Buyer Two', 'buyer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('b3333333-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'buyer3@example.com', 'Buyer Three', 'buyer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 4. Insert categories
INSERT INTO categories (title, description, icon_title, is_active, created_at, updated_at) VALUES
  ('Fresh Produce', 'Fruits, vegetables, herbs and fresh organic produce', 'leaf', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Meat & Seafood', 'Fresh meat, poultry, fish and seafood products', 'fish', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Dairy & Eggs', 'Milk, cheese, yogurt, eggs and dairy products', 'milk', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Beverages', 'Alcoholic and non-alcoholic drinks', 'wine', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Dry Goods', 'Grains, pasta, flour, sugar and pantry staples', 'wheat', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Kitchen Equipment', 'Cooking equipment, utensils, and kitchen tools', 'chef-hat', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Cleaning Supplies', 'Cleaning products, sanitizers, and hygiene supplies', 'spray-can', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Paper Products', 'Napkins, containers, packaging materials', 'package', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Frozen Foods', 'Frozen vegetables, meats, and prepared foods', 'snowflake', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Spices & Condiments', 'Seasonings, sauces, and flavor enhancers', 'pepper', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- 5. Insert listings for each supplier
INSERT INTO listing (
  id, supplier_id, title, description, category_id, price, unit, min_quantity, max_quantity, images, availability, created_at, updated_at
) VALUES
  ('l1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Organic Tomatoes', 'Fresh organic tomatoes', 'Fresh Produce', 4.50, 'lb', 5, 50, ARRAY['tomatoes1.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('l2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Fresh Salmon', 'Wild-caught salmon', 'Meat & Seafood', 18.99, 'lb', 2, 20, ARRAY['salmon1.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('l3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Farm Eggs', 'Free-range eggs', 'Dairy & Eggs', 5.50, 'dozen', 1, 20, ARRAY['eggs1.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 6. Insert delivery zones for suppliers
INSERT INTO delivery_zones (
  id, supplier_id, zone_title, base_delivery_fee, free_delivery_threshold, max_delivery_distance, estimated_delivery_hours, cities, postal_codes, is_active, created_at, updated_at
) VALUES
  ('dz111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'City Center', 5.00, 100.00, 10, 2, ARRAY['Downtown'], ARRAY['10001'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('dz222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Suburban', 8.50, 150.00, 20, 4, ARRAY['Suburbs'], ARRAY['10101'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 7. Insert inventory
INSERT INTO inventory (
  id, supplier_id, listing_id, product_title, description, category_id_id, current_stock, minimum_stock, unit_price, unit_type, is_available, created_at, updated_at
) VALUES
  ('inv11111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'l1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Organic Tomatoes', 'Fresh organic tomatoes', 'c1111111-cccc-cccc-cccc-cccccccccccc', 150, 25, 4.50, 'lb', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('inv22222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'l2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Fresh Salmon', 'Wild-caught salmon', 'c2222222-cccc-cccc-cccc-cccccccccccc', 45, 10, 18.99, 'lb', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 8. Insert orders
INSERT INTO order (
  id, buyer_id, supplier_id, totalAmount, deliveryAddress, deliveryNotes, status, created_at, updated_at
) VALUES
  ('o1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 127.50, '123 Restaurant Ave', 'Please deliver to back entrance', 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('o2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 89.25, '456 Cafe Street', 'Call upon arrival', 'APPROVED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 9. Insert order items
INSERT INTO orderitem (
  id, orderId, listingId, quantity, price, created_at
) VALUES
  ('oi111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'l1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 10, 4.50, CURRENT_TIMESTAMP),
  ('oi222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'l2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, 18.99, CURRENT_TIMESTAMP);

-- 10. Insert business hours for suppliers
INSERT INTO business_hours (
  id, user_id, day_of_week, open_time, close_time, is_closed, created_at, updated_at
) VALUES
  ('bh111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 1, '08:00', '17:00', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('bh222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 1, '08:00', '17:00', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 11. Insert cart items for buyers
INSERT INTO cart_items (
  id, user_id, listing_id, quantity, created_at, updated_at
) VALUES
  ('ci111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'l1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 12. Insert custom categories for suppliers
INSERT INTO custom_categories (
  id, user_id, title, description, parent_id, icon_title, is_active, created_at, updated_at
) VALUES
  ('cc111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Specialty Produce', 'Unique produce', NULL, 'star', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 13. Insert favorites for buyers
INSERT INTO favorites (
  id, user_id, target_type, target_id, created_at
) VALUES
  ('fav11111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'listing', 'l1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_TIMESTAMP);

-- 14. Insert invoices
INSERT INTO invoices (
  id, order_id, supplier_id, buyer_id, status, pdf_url, sent_at, created_at, updated_at
) VALUES
  ('inv11111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'SENT', 'https://pdf.com/inv1.pdf', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 15. Insert messages and conversations
INSERT INTO conversations (
  id, order_id, created_at, updated_at
) VALUES
  ('conv1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO conversation_participants (
  conversation_id, user_id
) VALUES
  ('conv1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('conv1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111');
INSERT INTO messages (
  id, conversation_id, sender_id, body, created_at
) VALUES
  ('msg11111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'conv1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Hello, when will my order arrive?', CURRENT_TIMESTAMP);

-- 16. Insert notifications
INSERT INTO notifications (
  id, user_id, type, title, message, data, is_read, created_at
) VALUES
  ('notif111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'order', 'Order Update', 'Your order has shipped!', '{}', false, CURRENT_TIMESTAMP);

-- 17. Insert order tracking
INSERT INTO order_tracking (
  id, order_id, status, message, location, updated_by, estimated_delivery, created_at
) VALUES
  ('track111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'IN_TRANSIT', 'On the way', 'Warehouse', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP + interval '2 hours', CURRENT_TIMESTAMP);

-- 18. Insert payment methods for buyers
INSERT INTO payment_methods (
  id, user_id, type, provider, last_four, expiry_month, expiry_year, is_default, is_active, metadata, created_at, updated_at
) VALUES
  ('pay11111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'card', 'visa', '4242', 12, 2026, true, true, '{}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 19. Insert reviews
INSERT INTO reviews (
  id, reviewer_id, reviewee_id, rating, comment, created_at
) VALUES
  ('rev11111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 5, 'Great supplier!', CURRENT_TIMESTAMP);

-- COMMIT
COMMIT;
('Fresh Produce', 'Fruits, vegetables, herbs and fresh organic produce', 'leaf'),
('Meat & Seafood', 'Fresh meat, poultry, fish and seafood products', 'fish'),
('Dairy & Eggs', 'Milk, cheese, yogurt, eggs and dairy products', 'milk'),
('Beverages', 'Alcoholic and non-alcoholic drinks', 'wine'),
('Dry Goods', 'Grains, pasta, flour, sugar and pantry staples', 'wheat'),
('Kitchen Equipment', 'Cooking equipment, utensils, and kitchen tools', 'chef-hat'),
('Cleaning Supplies', 'Cleaning products, sanitizers, and hygiene supplies', 'spray-can'),
('Paper Products', 'Napkins, containers, packaging materials', 'package'),
('Frozen Foods', 'Frozen vegetables, meats, and prepared foods', 'snowflake'),
('Spices & Condiments', 'Seasonings, sauces, and flavor enhancers', 'pepper')
ON CONFLICT DO NOTHING;

-- Insert subcategories with parent relationships
WITH main_categories AS (
  SELECT id, title FROM categories WHERE parent_id IS NULL
)
INSERT INTO categories (title, description, parent_id, icon_title)
SELECT 'Organic Vegetables', 'Certified organic vegetables', mc.id, 'sprout'
FROM main_categories mc WHERE mc.title = 'Fresh Produce'
UNION ALL
SELECT 'Tropical Fruits', 'Exotic and tropical fruits', mc.id, 'apple'
FROM main_categories mc WHERE mc.title = 'Fresh Produce'
UNION ALL
SELECT 'Local Herbs', 'Fresh locally grown herbs', mc.id, 'leaf'
FROM main_categories mc WHERE mc.title = 'Fresh Produce'
UNION ALL
SELECT 'Grass-Fed Beef', 'Premium grass-fed beef products', mc.id, 'beef'
FROM main_categories mc WHERE mc.title = 'Meat & Seafood'
UNION ALL
SELECT 'Wild-Caught Fish', 'Sustainably sourced wild fish', mc.id, 'fish'
FROM main_categories mc WHERE mc.title = 'Meat & Seafood'
UNION ALL
SELECT 'Artisan Cheese', 'Handcrafted artisanal cheeses', mc.id, 'milk'
FROM main_categories mc WHERE mc.title = 'Dairy & Eggs'
UNION ALL
SELECT 'Craft Beer', 'Local and craft beer selection', mc.id, 'glass-water'
FROM main_categories mc WHERE mc.title = 'Beverages'
UNION ALL
SELECT 'Fine Wine', 'Curated wine selection', mc.id, 'wine'
FROM main_categories mc WHERE mc.title = 'Beverages'
ON CONFLICT DO NOTHING;

-- Insert delivery zones
INSERT INTO delivery_zones (supplier_id, zone_title, base_delivery_fee, free_delivery_threshold, cities, postal_codes, estimated_delivery_hours) VALUES
(gen_random_uuid(), 'City Center', 5.00, 100.00, ARRAY['Downtown', 'Midtown'], ARRAY['10001', '10002', '10003'], 2),
(gen_random_uuid(), 'Suburban Area', 8.50, 150.00, ARRAY['Suburbs', 'Residential'], ARRAY['10101', '10102'], 4),
(gen_random_uuid(), 'Extended Area', 12.00, 200.00, ARRAY['Extended City'], ARRAY['10201', '10202'], 6)
ON CONFLICT DO NOTHING;

-- Insert sample listings
INSERT INTO listing ("supplier_id", title, description, category_id, price, unit, "min_quantity", "max_quantity", images, "availability", "created_at", "updated_at") VALUES
(gen_random_uuid(), 'Organic Tomatoes', 'Fresh organic tomatoes from local farm', 'Fresh Produce', 4.50, 'lb', 5, 50, ARRAY['tomatoes1.jpg', 'tomatoes2.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Fresh Salmon Fillet', 'Wild-caught Atlantic salmon fillet', 'Meat & Seafood', 18.99, 'lb', 2, 20, ARRAY['salmon1.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Artisan Sourdough Bread', 'Hand-crafted sourdough bread', 'Dry Goods', 6.50, 'loaf', 1, 10, ARRAY['bread1.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Local Honey', 'Raw unfiltered local honey', 'Spices & Condiments', 12.00, 'jar', 1, 25, ARRAY['honey1.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Grass-Fed Ground Beef', 'Premium grass-fed ground beef', 'Meat & Seafood', 8.99, 'lb', 3, 30, ARRAY['beef1.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Organic Mixed Greens', 'Fresh organic salad mix', 'Fresh Produce', 3.25, 'bag', 2, 40, ARRAY['greens1.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Farm Fresh Eggs', 'Free-range chicken eggs', 'Dairy & Eggs', 5.50, 'dozen', 1, 20, ARRAY['eggs1.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Craft Beer Selection', 'Local brewery craft beer pack', 'Beverages', 24.99, '6-pack', 1, 15, ARRAY['beer1.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Artisan Pasta', 'Handmade fresh pasta', 'Dry Goods', 7.25, 'lb', 2, 25, ARRAY['pasta1.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Seasonal Fruit Box', 'Mixed seasonal fruit selection', 'Fresh Produce', 15.00, 'box', 1, 12, ARRAY['fruits1.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Premium Olive Oil', 'Extra virgin cold-pressed olive oil', 'Spices & Condiments', 18.50, 'bottle', 1, 20, ARRAY['oil1.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Organic Chicken Breast', 'Free-range organic chicken breast', 'Meat & Seafood', 12.99, 'lb', 2, 25, ARRAY['chicken1.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Whole Grain Flour', 'Stone-ground whole wheat flour', 'Dry Goods', 4.25, 'bag', 3, 30, ARRAY['flour1.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Fresh Mozzarella', 'House-made fresh mozzarella cheese', 'Dairy & Eggs', 8.75, 'lb', 1, 15, ARRAY['mozzarella1.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Seasonal Vegetables', 'Mixed seasonal vegetable box', 'Fresh Produce', 22.00, 'box', 1, 10, ARRAY['vegbox1.jpg'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert inventory data
INSERT INTO inventory (supplier_id, product_title, description, current_stock, minimum_stock, unit_price, unit_type, is_available) VALUES
(gen_random_uuid(), 'Organic Tomatoes', 'Fresh organic tomatoes', 150.0, 25.0, 4.50, 'lbs', true),
(gen_random_uuid(), 'Fresh Salmon', 'Wild-caught salmon fillets', 45.0, 10.0, 18.99, 'lbs', true),
(gen_random_uuid(), 'Sourdough Bread', 'Artisan sourdough loaves', 25.0, 5.0, 6.50, 'loaves', true),
(gen_random_uuid(), 'Local Honey', 'Raw unfiltered honey', 40.0, 8.0, 12.00, 'jars', true),
(gen_random_uuid(), 'Ground Beef', 'Grass-fed ground beef', 80.0, 15.0, 8.99, 'lbs', true),
(gen_random_uuid(), 'Mixed Greens', 'Organic salad mix', 60.0, 12.0, 3.25, 'bags', true),
(gen_random_uuid(), 'Farm Eggs', 'Free-range eggs', 50.0, 10.0, 5.50, 'dozens', true),
(gen_random_uuid(), 'Craft Beer', 'Local brewery selection', 30.0, 6.0, 24.99, '6-packs', true),
(gen_random_uuid(), 'Olive Oil', 'Premium extra virgin olive oil', 35.0, 8.0, 18.50, 'bottles', true),
(gen_random_uuid(), 'Chicken Breast', 'Organic free-range chicken', 65.0, 12.0, 12.99, 'lbs', true),
(gen_random_uuid(), 'Whole Wheat Flour', 'Stone-ground flour', 45.0, 10.0, 4.25, 'bags', true),
(gen_random_uuid(), 'Fresh Mozzarella', 'House-made mozzarella', 20.0, 5.0, 8.75, 'lbs', true)
ON CONFLICT DO NOTHING;

-- Insert sample orders
INSERT INTO order ("buyer_id", "supplier_id", "totalAmount", "deliveryAddress", "deliveryNotes", status, "created_at", "updated_at") VALUES
(gen_random_uuid(), gen_random_uuid(), 127.50, '123 Restaurant Ave, Food City, FC 12345', 'Please deliver to back entrance', 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), gen_random_uuid(), 89.25, '456 Cafe Street, Dine Town, DT 67890', 'Call upon arrival', 'APPROVED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), gen_random_uuid(), 234.80, '789 Hotel Plaza, Service City, SC 13579', 'Security desk check-in required', 'IN_PREPARATION', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), gen_random_uuid(), 156.40, '321 Bistro Lane, Cuisine City, CC 24680', 'Delivery between 8-10 AM only', 'DELIVERED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), gen_random_uuid(), 98.75, '654 Market Street, Fresh Town, FT 97531', 'Leave at loading dock', 'IN_TRANSIT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

COMMIT;
