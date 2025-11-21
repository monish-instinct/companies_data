-- Seed demo data for CLOZET
-- This creates comprehensive demo data for testing

-- Insert demo users via profiles table (auth.users will be created via signup)
INSERT INTO public.profiles (user_id, name, phone, role) VALUES
-- Admin user
('00000000-0000-0000-0000-000000000001', 'CLOZET Admin', '+91-9999999999', 'admin'),
-- Store owners
('00000000-0000-0000-0000-000000000002', 'Fashion Hub Owner', '+91-9999999998', 'store_owner'),
('00000000-0000-0000-0000-000000000003', 'Trendy Styles Owner', '+91-9999999997', 'store_owner'),
-- Delivery partner
('00000000-0000-0000-0000-000000000004', 'Speed Delivery Partner', '+91-9999999996', 'delivery_partner'),
-- Customer
('00000000-0000-0000-0000-000000000005', 'Demo Customer', '+91-9999999995', 'customer');

-- Insert demo stores
INSERT INTO public.stores (id, name, slug, description, address, location_lat, location_lng, owner_id, logo_url, rating, total_reviews) VALUES
('11111111-1111-1111-1111-111111111111', 'Fashion Hub', 'fashion-hub', 'Premium fashion destination with latest trends', '123 Fashion Street, Mumbai, MH 400001', 19.0760, 72.8777, '00000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&crop=center', 4.5, 127),
('22222222-2222-2222-2222-222222222222', 'Trendy Styles', 'trendy-styles', 'Affordable fashion for everyone', '456 Style Avenue, Delhi, DL 110001', 28.6139, 77.2090, '00000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center', 4.2, 89),
('33333333-3333-3333-3333-333333333333', 'Elite Boutique', 'elite-boutique', 'Luxury fashion and accessories', '789 Elite Road, Bangalore, KA 560001', 12.9716, 77.5946, '00000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1555529902-6e68d82d4c97?w=200&h=200&fit=crop&crop=center', 4.8, 203);

-- Insert demo products with variants
INSERT INTO public.products (id, title, slug, description, price, mrp, brand, category, material, care_instructions, sku, store_id, images, variants, is_available) VALUES
-- Fashion Hub products
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Premium Cotton T-Shirt', 'premium-cotton-tshirt', 'Comfortable premium cotton t-shirt perfect for casual wear', 899, 1299, 'StyleCraft', 'clothing', 'Premium Cotton', 'Machine wash cold, tumble dry low', 'FH-TSH-001', '11111111-1111-1111-1111-111111111111', '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1503341960582-b45751874cf0?w=400&h=400&fit=crop"]', '[{"name": "Small/Blue", "key": "s-blue", "price": 899}, {"name": "Medium/Blue", "key": "m-blue", "price": 899}, {"name": "Large/Blue", "key": "l-blue", "price": 899}, {"name": "Small/White", "key": "s-white", "price": 899}, {"name": "Medium/White", "key": "m-white", "price": 899}]', true),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Designer Jeans', 'designer-jeans', 'Stylish designer jeans with perfect fit', 2499, 3999, 'DenimCo', 'clothing', 'Denim', 'Machine wash cold, hang dry', 'FH-JNS-001', '11111111-1111-1111-1111-111111111111', '["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"]', '[{"name": "30/Blue", "key": "30-blue", "price": 2499}, {"name": "32/Blue", "key": "32-blue", "price": 2499}, {"name": "34/Blue", "key": "34-blue", "price": 2499}, {"name": "36/Blue", "key": "36-blue", "price": 2499}]', true),

('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Casual Sneakers', 'casual-sneakers', 'Comfortable casual sneakers for everyday wear', 1799, 2999, 'FootFlex', 'footwear', 'Canvas & Rubber', 'Wipe clean with damp cloth', 'FH-SNK-001', '11111111-1111-1111-1111-111111111111', '["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop"]', '[{"name": "7/White", "key": "7-white", "price": 1799}, {"name": "8/White", "key": "8-white", "price": 1799}, {"name": "9/White", "key": "9-white", "price": 1799}, {"name": "10/White", "key": "10-white", "price": 1799}]', true),

-- Trendy Styles products
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Floral Summer Dress', 'floral-summer-dress', 'Beautiful floral summer dress perfect for any occasion', 1299, 1899, 'FloraFashion', 'clothing', 'Cotton Blend', 'Hand wash recommended', 'TS-DRS-001', '22222222-2222-2222-2222-222222222222', '["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop"]', '[{"name": "S/Floral", "key": "s-floral", "price": 1299}, {"name": "M/Floral", "key": "m-floral", "price": 1299}, {"name": "L/Floral", "key": "l-floral", "price": 1299}]', true),

('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Leather Handbag', 'leather-handbag', 'Stylish leather handbag with multiple compartments', 2199, 3299, 'LuxBags', 'accessories', 'Genuine Leather', 'Wipe with leather cleaner', 'TS-BAG-001', '22222222-2222-2222-2222-222222222222', '["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"]', '[{"name": "Brown", "key": "brown", "price": 2199}, {"name": "Black", "key": "black", "price": 2199}]', true),

-- Elite Boutique products
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Silk Evening Gown', 'silk-evening-gown', 'Elegant silk evening gown for special occasions', 4999, 7999, 'Eleganza', 'clothing', 'Pure Silk', 'Dry clean only', 'EB-GWN-001', '33333333-3333-3333-3333-333333333333', '["https://images.unsplash.com/photo-1566479179817-c0e7f0dcac62?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"]', '[{"name": "S/Navy", "key": "s-navy", "price": 4999}, {"name": "M/Navy", "key": "m-navy", "price": 4999}, {"name": "L/Navy", "key": "l-navy", "price": 4999}]', true),

('gggggggg-gggg-gggg-gggg-gggggggggggg', 'Diamond Necklace', 'diamond-necklace', 'Exquisite diamond necklace with premium finish', 12999, 19999, 'JewelCraft', 'jewelry', 'Gold & Diamond', 'Store in jewelry box', 'EB-NCK-001', '33333333-3333-3333-3333-333333333333', '["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop"]', '[{"name": "Standard", "key": "standard", "price": 12999}]', true);

-- Insert inventory for all products
INSERT INTO public.inventory (product_id, variant_key, stock_count, reserved_count) VALUES
-- Fashion Hub inventory
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 's-blue', 25, 2),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'm-blue', 30, 1),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'l-blue', 20, 0),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 's-white', 15, 1),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'm-white', 22, 0),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '30-blue', 12, 1),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '32-blue', 18, 2),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '34-blue', 15, 0),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '36-blue', 10, 1),

('cccccccc-cccc-cccc-cccc-cccccccccccc', '7-white', 8, 0),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '8-white', 12, 1),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '9-white', 15, 2),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '10-white', 10, 0),

-- Trendy Styles inventory
('dddddddd-dddd-dddd-dddd-dddddddddddd', 's-floral', 20, 0),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'm-floral', 25, 1),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'l-floral', 18, 0),

('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'brown', 8, 1),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'black', 12, 0),

-- Elite Boutique inventory
('ffffffff-ffff-ffff-ffff-ffffffffffff', 's-navy', 5, 0),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'm-navy', 7, 1),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'l-navy', 4, 0),

('gggggggg-gggg-gggg-gggg-gggggggggggg', 'standard', 3, 0);

-- Insert demo orders with different statuses
INSERT INTO public.orders (id, order_number, user_id, store_id, items, subtotal, tax, delivery_charge, total, delivery_address, order_status, payment_status, delivery_type, created_at) VALUES
('order001-0001-0001-0001-000000000001', 'CLZ2024001', '00000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', '[{"product_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "variant_key": "m-blue", "quantity": 2, "price": 899, "title": "Premium Cotton T-Shirt"}]', 1798, 179.80, 50, 2027.80, '{"name": "Demo Customer", "phone": "+919999999995", "address": "123 Customer Street", "city": "Mumbai", "state": "MH", "pincode": "400001"}', 'delivered', 'paid', 'express', NOW() - INTERVAL '5 days'),

('order002-0002-0002-0002-000000000002', 'CLZ2024002', '00000000-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', '[{"product_id": "dddddddd-dddd-dddd-dddd-dddddddddddd", "variant_key": "m-floral", "quantity": 1, "price": 1299, "title": "Floral Summer Dress"}]', 1299, 129.90, 30, 1458.90, '{"name": "Demo Customer", "phone": "+919999999995", "address": "123 Customer Street", "city": "Mumbai", "state": "MH", "pincode": "400001"}', 'out_for_delivery', 'paid', 'standard', NOW() - INTERVAL '1 day'),

('order003-0003-0003-0003-000000000003', 'CLZ2024003', '00000000-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', '[{"product_id": "ffffffff-ffff-ffff-ffff-ffffffffffff", "variant_key": "m-navy", "quantity": 1, "price": 4999, "title": "Silk Evening Gown"}]', 4999, 499.90, 100, 5598.90, '{"name": "Demo Customer", "phone": "+919999999995", "address": "123 Customer Street", "city": "Mumbai", "state": "MH", "pincode": "400001"}', 'packed', 'paid', 'express', NOW() - INTERVAL '2 hours'),

('order004-0004-0004-0004-000000000004', 'CLZ2024004', '00000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', '[{"product_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "variant_key": "32-blue", "quantity": 1, "price": 2499, "title": "Designer Jeans"}]', 2499, 249.90, 50, 2798.90, '{"name": "Demo Customer", "phone": "+919999999995", "address": "123 Customer Street", "city": "Mumbai", "state": "MH", "pincode": "400001"}', 'placed', 'paid', 'standard', NOW() - INTERVAL '30 minutes'),

('order005-0005-0005-0005-000000000005', 'CLZ2024005', '00000000-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', '[{"product_id": "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee", "variant_key": "black", "quantity": 1, "price": 2199, "title": "Leather Handbag"}]', 2199, 219.90, 30, 2448.90, '{"name": "Demo Customer", "phone": "+919999999995", "address": "123 Customer Street", "city": "Mumbai", "state": "MH", "pincode": "400001"}', 'processing', 'paid', 'express', NOW() - INTERVAL '3 hours');

-- Insert order events for tracking
INSERT INTO public.order_events (order_id, status, message, location_lat, location_lng, created_at) VALUES
-- Order 1 (delivered)
('order001-0001-0001-0001-000000000001', 'placed', 'Order placed successfully', 19.0760, 72.8777, NOW() - INTERVAL '5 days'),
('order001-0001-0001-0001-000000000001', 'confirmed', 'Order confirmed by store', 19.0760, 72.8777, NOW() - INTERVAL '5 days' + INTERVAL '30 minutes'),
('order001-0001-0001-0001-000000000001', 'packed', 'Order packed and ready for pickup', 19.0760, 72.8777, NOW() - INTERVAL '4 days 20 hours'),
('order001-0001-0001-0001-000000000001', 'picked_up', 'Order picked up by delivery partner', 19.0760, 72.8777, NOW() - INTERVAL '4 days 18 hours'),
('order001-0001-0001-0001-000000000001', 'out_for_delivery', 'Order out for delivery', 19.0660, 72.8677, NOW() - INTERVAL '4 days 16 hours'),
('order001-0001-0001-0001-000000000001', 'delivered', 'Order delivered successfully', 19.0560, 72.8577, NOW() - INTERVAL '4 days 14 hours'),

-- Order 2 (out for delivery)
('order002-0002-0002-0002-000000000002', 'placed', 'Order placed successfully', 28.6139, 77.2090, NOW() - INTERVAL '1 day'),
('order002-0002-0002-0002-000000000002', 'confirmed', 'Order confirmed by store', 28.6139, 77.2090, NOW() - INTERVAL '1 day' + INTERVAL '45 minutes'),
('order002-0002-0002-0002-000000000002', 'packed', 'Order packed and ready for pickup', 28.6139, 77.2090, NOW() - INTERVAL '20 hours'),
('order002-0002-0002-0002-000000000002', 'picked_up', 'Order picked up by delivery partner', 28.6139, 77.2090, NOW() - INTERVAL '18 hours'),
('order002-0002-0002-0002-000000000002', 'out_for_delivery', 'Order out for delivery', 28.6039, 77.1990, NOW() - INTERVAL '2 hours');

-- Insert sample ratings
INSERT INTO public.ratings (user_id, store_id, product_id, order_id, rating, review, tags) VALUES
('00000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'order001-0001-0001-0001-000000000001', 5, 'Excellent quality t-shirt! Very comfortable and fits perfectly. Fast delivery too!', '["quality", "comfort", "fast-delivery"]'),
('00000000-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd', null, 4, 'Beautiful dress with lovely floral pattern. Slight delay in delivery but worth the wait.', '["design", "quality"]'),
('00000000-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', null, null, 5, 'Amazing store! Premium quality products and excellent customer service. Highly recommended!', '["premium-quality", "customer-service"]');

-- Insert wishlist items
INSERT INTO public.wishlist (user_id, product_id) VALUES
('00000000-0000-0000-0000-000000000005', 'gggggggg-gggg-gggg-gggg-gggggggggggg'),
('00000000-0000-0000-0000-000000000005', 'cccccccc-cccc-cccc-cccc-cccccccccccc');

-- Insert cart items
INSERT INTO public.cart (user_id, product_id, variant_key, quantity) VALUES
('00000000-0000-0000-0000-000000000005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '34-blue', 1),
('00000000-0000-0000-0000-000000000005', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'brown', 1);

-- Insert exchange requests
INSERT INTO public.exchanges (order_id, reason, images, status) VALUES
('order001-0001-0001-0001-000000000001', 'Size too small, need to exchange for larger size', '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"]', 'requested'),
('order002-0002-0002-0002-000000000002', 'Color not as expected in photos', '["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop"]', 'approved');