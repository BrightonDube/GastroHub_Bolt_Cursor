-- ============================================
-- CLEAN SEEDING DATA WITHOUT EMOJIS
-- ============================================

-- Clear existing data first
DELETE FROM categories;
DELETE FROM subscription_plans;
DELETE FROM delivery_zones;
DELETE FROM inventory;
DELETE FROM "Listing";
DELETE FROM "Order";

-- Insert subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, features, max_listings, max_orders_per_month, commission_rate) VALUES
('Free', 'Basic plan for getting started', 0, 0, '["Basic listing", "Standard support", "Up to 5 listings"]', 5, 10, 0.10),
('Pro', 'Professional plan for growing businesses', 29.99, 299.99, '["Unlimited listings", "Priority support", "Analytics dashboard", "Advanced messaging"]', NULL, 100, 0.05),
('Enterprise', 'Enterprise plan for large operations', 99.99, 999.99, '["Everything in Pro", "Custom integrations", "Dedicated support", "White-label options"]', NULL, NULL, 0.03)
ON CONFLICT DO NOTHING;

-- Insert main categories without emojis
INSERT INTO categories (name, description, icon_name) VALUES
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
  SELECT id, name FROM categories WHERE parent_id IS NULL
)
INSERT INTO categories (name, description, parent_id, icon_name)
SELECT 'Organic Vegetables', 'Certified organic vegetables', mc.id, 'sprout'
FROM main_categories mc WHERE mc.name = 'Fresh Produce'
UNION ALL
SELECT 'Tropical Fruits', 'Exotic and tropical fruits', mc.id, 'apple'
FROM main_categories mc WHERE mc.name = 'Fresh Produce'
UNION ALL
SELECT 'Local Herbs', 'Fresh locally grown herbs', mc.id, 'leaf'
FROM main_categories mc WHERE mc.name = 'Fresh Produce'
UNION ALL
SELECT 'Grass-Fed Beef', 'Premium grass-fed beef products', mc.id, 'beef'
FROM main_categories mc WHERE mc.name = 'Meat & Seafood'
UNION ALL
SELECT 'Wild-Caught Fish', 'Sustainably sourced wild fish', mc.id, 'fish'
FROM main_categories mc WHERE mc.name = 'Meat & Seafood'
UNION ALL
SELECT 'Artisan Cheese', 'Handcrafted artisanal cheeses', mc.id, 'milk'
FROM main_categories mc WHERE mc.name = 'Dairy & Eggs'
UNION ALL
SELECT 'Craft Beer', 'Local and craft beer selection', mc.id, 'glass-water'
FROM main_categories mc WHERE mc.name = 'Beverages'
UNION ALL
SELECT 'Fine Wine', 'Curated wine selection', mc.id, 'wine'
FROM main_categories mc WHERE mc.name = 'Beverages'
ON CONFLICT DO NOTHING;

-- Insert delivery zones
INSERT INTO delivery_zones (supplier_id, zone_name, base_delivery_fee, free_delivery_threshold, cities, postal_codes, estimated_delivery_hours) VALUES
(gen_random_uuid(), 'City Center', 5.00, 100.00, ARRAY['Downtown', 'Midtown'], ARRAY['10001', '10002', '10003'], 2),
(gen_random_uuid(), 'Suburban Area', 8.50, 150.00, ARRAY['Suburbs', 'Residential'], ARRAY['10101', '10102'], 4),
(gen_random_uuid(), 'Extended Area', 12.00, 200.00, ARRAY['Extended City'], ARRAY['10201', '10202'], 6)
ON CONFLICT DO NOTHING;

-- Insert sample listings
INSERT INTO "Listing" ("supplierId", name, description, category, price, unit, "minOrder", "maxOrder", images, "isActive", "createdAt", "updatedAt") VALUES
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
INSERT INTO inventory (supplier_id, product_name, description, current_stock, minimum_stock, unit_price, unit_type, is_available) VALUES
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
INSERT INTO "Order" ("buyerId", "supplierId", "totalAmount", "deliveryAddress", "deliveryNotes", status, "createdAt", "updatedAt") VALUES
(gen_random_uuid(), gen_random_uuid(), 127.50, '123 Restaurant Ave, Food City, FC 12345', 'Please deliver to back entrance', 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), gen_random_uuid(), 89.25, '456 Cafe Street, Dine Town, DT 67890', 'Call upon arrival', 'APPROVED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), gen_random_uuid(), 234.80, '789 Hotel Plaza, Service City, SC 13579', 'Security desk check-in required', 'IN_PREPARATION', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), gen_random_uuid(), 156.40, '321 Bistro Lane, Cuisine City, CC 24680', 'Delivery between 8-10 AM only', 'DELIVERED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), gen_random_uuid(), 98.75, '654 Market Street, Fresh Town, FT 97531', 'Leave at loading dock', 'IN_TRANSIT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

COMMIT;
