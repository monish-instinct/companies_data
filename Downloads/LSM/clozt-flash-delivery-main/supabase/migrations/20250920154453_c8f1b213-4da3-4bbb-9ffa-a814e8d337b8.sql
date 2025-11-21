-- Insert sample stores
INSERT INTO public.stores (id, owner_id, name, slug, description, address, location_lat, location_lng, service_radius_km, logo_url, rating, total_reviews) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440101', 'Style Hub', 'style-hub', 'Premium fashion destination for trendy millennials', '123 Fashion Street, Mumbai, Maharashtra 400001', 19.0760, 72.8777, 15, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop&crop=center', 4.8, 245),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440102', 'Urban Threads', 'urban-threads', 'Contemporary fashion with sustainable practices', '456 Commerce Plaza, Bangalore, Karnataka 560001', 12.9716, 77.5946, 20, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop&crop=center', 4.9, 189),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440103', 'Fashion Forward', 'fashion-forward', 'Luxury brands and designer collections', '789 Elite Mall, Delhi, Delhi 110001', 28.6139, 77.2090, 12, 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center', 4.7, 156);

-- Insert sample products
INSERT INTO public.products (id, store_id, sku, title, slug, description, brand, category, price, mrp, variants, images, material, care_instructions, is_available) VALUES
-- Style Hub Products
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'SH001', 'Neon Streetwear Hoodie', 'neon-streetwear-hoodie', 'Futuristic hoodie with neon accents and LED trim', 'UrbanFlex', 'Streetwear', 2499.00, 3999.00, '[{"size": "S", "color": "Neon Green"}, {"size": "M", "color": "Neon Green"}, {"size": "L", "color": "Neon Green"}, {"size": "XL", "color": "Neon Green"}]', '{https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop&crop=center, https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop&crop=center}', 'Cotton Blend with LED strips', 'Machine wash cold, do not bleach, tumble dry low', true),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'SH002', 'Cyberpunk Jacket', 'cyberpunk-jacket', 'Tech-inspired jacket with holographic details', 'NeonCore', 'Outerwear', 4999.00, 7999.00, '[{"size": "S", "color": "Black"}, {"size": "M", "color": "Black"}, {"size": "L", "color": "Black"}]', '{https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop&crop=center, https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop&crop=center}', 'Synthetic leather with holographic coating', 'Wipe clean with damp cloth', true),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'SH003', 'Glow Sneakers', 'glow-sneakers', 'Self-illuminating sneakers with customizable LED patterns', 'LightStep', 'Footwear', 8999.00, 12999.00, '[{"size": "7", "color": "White"}, {"size": "8", "color": "White"}, {"size": "9", "color": "White"}, {"size": "10", "color": "White"}]', '{https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop&crop=center, https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop&crop=center}', 'Synthetic mesh with LED technology', 'Clean with soft brush, charge regularly', true),

-- Urban Threads Products
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'UT001', 'Eco-Tech T-Shirt', 'eco-tech-tshirt', 'Sustainable fashion meets technology with this smart fabric tee', 'GreenTech', 'Casual', 1899.00, 2499.00, '[{"size": "S", "color": "Ocean Blue"}, {"size": "M", "color": "Ocean Blue"}, {"size": "L", "color": "Ocean Blue"}, {"size": "XL", "color": "Ocean Blue"}]', '{https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&crop=center, https://images.unsplash.com/photo-1583743814966-8936f37f299?w=800&h=800&fit=crop&crop=center}', 'Organic cotton with moisture-wicking technology', 'Machine wash cold, air dry', true),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'UT002', 'Smart Joggers', 'smart-joggers', 'Athletic joggers with built-in fitness tracking', 'FitFuture', 'Athleisure', 3499.00, 4999.00, '[{"size": "S", "color": "Charcoal"}, {"size": "M", "color": "Charcoal"}, {"size": "L", "color": "Charcoal"}, {"size": "XL", "color": "Charcoal"}]', '{https://images.unsplash.com/photo-1506629905607-bb4d8e8de7e?w=800&h=800&fit=crop&crop=center, https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop&crop=center}', 'Polyester blend with embedded sensors', 'Machine wash on gentle cycle', true),

-- Fashion Forward Products
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 'FF001', 'Luxury Holographic Dress', 'luxury-holographic-dress', 'Designer dress with color-changing holographic fabric', 'EliteGlow', 'Luxury', 15999.00, 24999.00, '[{"size": "XS", "color": "Iridescent"}, {"size": "S", "color": "Iridescent"}, {"size": "M", "color": "Iridescent"}, {"size": "L", "color": "Iridescent"}]', '{https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop&crop=center, https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&h=800&fit=crop&crop=center}', 'Silk with holographic coating', 'Dry clean only', true),
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'FF002', 'Digital Accessories Set', 'digital-accessories-set', 'Smart jewelry with AR capabilities and app integration', 'TechLux', 'Accessories', 12999.00, 18999.00, '[{"type": "Set", "color": "Rose Gold"}]', '{https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop&crop=center, https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=800&fit=crop&crop=center}', 'Titanium with smart components', 'Clean with microfiber cloth, charge weekly', true);

-- Insert inventory for all products
INSERT INTO public.inventory (product_id, variant_key, stock_count) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'S-Neon Green', 15),
('660e8400-e29b-41d4-a716-446655440001', 'M-Neon Green', 25),
('660e8400-e29b-41d4-a716-446655440001', 'L-Neon Green', 20),
('660e8400-e29b-41d4-a716-446655440001', 'XL-Neon Green', 12),
('660e8400-e29b-41d4-a716-446655440002', 'S-Black', 8),
('660e8400-e29b-41d4-a716-446655440002', 'M-Black', 12),
('660e8400-e29b-41d4-a716-446655440002', 'L-Black', 10),
('660e8400-e29b-41d4-a716-446655440003', '7-White', 5),
('660e8400-e29b-41d4-a716-446655440003', '8-White', 8),
('660e8400-e29b-41d4-a716-446655440003', '9-White', 6),
('660e8400-e29b-41d4-a716-446655440003', '10-White', 4),
('660e8400-e29b-41d4-a716-446655440004', 'S-Ocean Blue', 30),
('660e8400-e29b-41d4-a716-446655440004', 'M-Ocean Blue', 35),
('660e8400-e29b-41d4-a716-446655440004', 'L-Ocean Blue', 28),
('660e8400-e29b-41d4-a716-446655440004', 'XL-Ocean Blue', 22),
('660e8400-e29b-41d4-a716-446655440005', 'S-Charcoal', 18),
('660e8400-e29b-41d4-a716-446655440005', 'M-Charcoal', 24),
('660e8400-e29b-41d4-a716-446655440005', 'L-Charcoal', 20),
('660e8400-e29b-41d4-a716-446655440005', 'XL-Charcoal', 16),
('660e8400-e29b-41d4-a716-446655440006', 'XS-Iridescent', 3),
('660e8400-e29b-41d4-a716-446655440006', 'S-Iridescent', 5),
('660e8400-e29b-41d4-a716-446655440006', 'M-Iridescent', 4),
('660e8400-e29b-41d4-a716-446655440006', 'L-Iridescent', 2),
('660e8400-e29b-41d4-a716-446655440007', 'Set-Rose Gold', 7);