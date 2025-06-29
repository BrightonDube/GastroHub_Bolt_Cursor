-- Migration to fix images and update imperial units to metric
-- This migration will update existing data in production

-- First, update all listings that use imperial units to metric
UPDATE "Listing" 
SET 
  price = CASE 
    WHEN unit = 'lb' AND name ILIKE '%tomato%' THEN 9.92
    WHEN unit = 'lb' AND name ILIKE '%salmon%' THEN 41.88
    WHEN unit = 'lb' AND name ILIKE '%beef%' THEN 19.82
    WHEN unit = 'lb' AND name ILIKE '%pasta%' THEN 15.98
    WHEN unit = 'lb' AND name ILIKE '%chicken%' THEN 28.64
    WHEN unit = 'lb' AND name ILIKE '%mozzarella%' THEN 19.29
    ELSE price
  END,
  unit = CASE 
    WHEN unit = 'lb' THEN 'kg'
    WHEN unit = 'lbs' THEN 'kg'
    WHEN unit = 'pound' THEN 'kg'
    WHEN unit = 'pounds' THEN 'kg'
    WHEN unit = 'liter' THEN 'l'
    WHEN unit = 'liters' THEN 'l'
    ELSE unit
  END,
  "minOrder" = CASE 
    WHEN unit IN ('lb', 'lbs') AND name ILIKE '%tomato%' THEN 2
    WHEN unit IN ('lb', 'lbs') AND name ILIKE '%salmon%' THEN 1
    WHEN unit IN ('lb', 'lbs') AND name ILIKE '%beef%' THEN 1
    WHEN unit IN ('lb', 'lbs') AND name ILIKE '%pasta%' THEN 1
    WHEN unit IN ('lb', 'lbs') AND name ILIKE '%chicken%' THEN 1
    WHEN unit IN ('lb', 'lbs') AND name ILIKE '%mozzarella%' THEN 500  -- 500g minimum
    ELSE "minOrder"
  END,
  "maxOrder" = CASE 
    WHEN unit IN ('lb', 'lbs') AND name ILIKE '%tomato%' THEN 25
    WHEN unit IN ('lb', 'lbs') AND name ILIKE '%salmon%' THEN 10
    WHEN unit IN ('lb', 'lbs') AND name ILIKE '%beef%' THEN 15
    WHEN unit IN ('lb', 'lbs') AND name ILIKE '%pasta%' THEN 12
    WHEN unit IN ('lb', 'lbs') AND name ILIKE '%chicken%' THEN 12
    WHEN unit IN ('lb', 'lbs') AND name ILIKE '%mozzarella%' THEN 7500  -- 7.5kg maximum
    ELSE "maxOrder"
  END,
  images = CASE 
    WHEN name ILIKE '%tomato%' THEN ARRAY['https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400']
    WHEN name ILIKE '%salmon%' THEN ARRAY['https://images.pexels.com/photos/842142/pexels-photo-842142.jpeg?auto=compress&cs=tinysrgb&w=400']
    WHEN name ILIKE '%beef%' THEN ARRAY['https://images.pexels.com/photos/1342712/pexels-photo-1342712.jpeg?auto=compress&cs=tinysrgb&w=400']
    WHEN name ILIKE '%chicken%' THEN ARRAY['https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=400']
    WHEN name ILIKE '%bread%' THEN ARRAY['https://images.pexels.com/photos/298217/pexels-photo-298217.jpeg?auto=compress&cs=tinysrgb&w=400']
    WHEN name ILIKE '%honey%' THEN ARRAY['https://images.pexels.com/photos/33307/honey-jar-honey-organic.jpg?auto=compress&cs=tinysrgb&w=400']
    WHEN name ILIKE '%egg%' THEN ARRAY['https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=400']
    WHEN name ILIKE '%greens%' OR name ILIKE '%spinach%' THEN ARRAY['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400']
    WHEN name ILIKE '%pasta%' THEN ARRAY['https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400']
    WHEN name ILIKE '%cheese%' OR name ILIKE '%mozzarella%' THEN ARRAY['https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=400']
    WHEN name ILIKE '%oil%' THEN ARRAY['https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=400']
    WHEN name ILIKE '%beer%' THEN ARRAY['https://images.pexels.com/photos/159291/beer-machine-alcohol-brewery-159291.jpeg?auto=compress&cs=tinysrgb&w=400']
    WHEN name ILIKE '%flour%' THEN ARRAY['https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?auto=compress&cs=tinysrgb&w=400']
    WHEN name ILIKE '%fruit%' THEN ARRAY['https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400']
    WHEN name ILIKE '%vegetable%' THEN ARRAY['https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=400']
    ELSE images
  END;

-- Update inventory table if it exists
UPDATE inventory 
SET 
  unit_price = CASE 
    WHEN unit_type = 'lbs' AND product_name ILIKE '%tomato%' THEN 9.92
    WHEN unit_type = 'lbs' AND product_name ILIKE '%salmon%' THEN 41.88
    WHEN unit_type = 'lbs' AND product_name ILIKE '%beef%' THEN 19.82
    WHEN unit_type = 'lbs' AND product_name ILIKE '%chicken%' THEN 28.64
    WHEN unit_type = 'lbs' AND product_name ILIKE '%mozzarella%' THEN 19.29
    ELSE unit_price
  END,
  unit_type = CASE 
    WHEN unit_type = 'lbs' THEN 'kg'
    WHEN unit_type = 'lb' THEN 'kg'
    WHEN unit_type = 'pounds' THEN 'kg'
    WHEN unit_type = 'liters' THEN 'l'
    WHEN unit_type = 'liter' THEN 'l'
    ELSE unit_type
  END,
  current_stock = CASE 
    WHEN unit_type IN ('lbs', 'lb') THEN ROUND((current_stock * 0.453592)::numeric, 1)  -- Convert pounds to kg
    ELSE current_stock
  END,
  minimum_stock = CASE 
    WHEN unit_type IN ('lbs', 'lb') THEN ROUND((minimum_stock * 0.453592)::numeric, 1)  -- Convert pounds to kg
    ELSE minimum_stock
  END
WHERE unit_type IN ('lbs', 'lb', 'pounds', 'liters', 'liter'); 