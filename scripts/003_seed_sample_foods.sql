-- Insert sample foods for testing and initial data
INSERT INTO public.foods (name, brand, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving, fiber_per_serving, sugar_per_serving, sodium_per_serving, serving_size, serving_unit, is_verified, created_by) VALUES
-- Fruits
('Apple', 'Generic', 95, 0.5, 25, 0.3, 4, 19, 2, '1', 'medium', true, '00000000-0000-0000-0000-000000000000'),
('Banana', 'Generic', 105, 1.3, 27, 0.4, 3, 14, 1, '1', 'medium', true, '00000000-0000-0000-0000-000000000000'),
('Orange', 'Generic', 62, 1.2, 15, 0.2, 3, 12, 0, '1', 'medium', true, '00000000-0000-0000-0000-000000000000'),

-- Proteins
('Chicken Breast', 'Generic', 165, 31, 0, 3.6, 0, 0, 74, '100', 'grams', true, '00000000-0000-0000-0000-000000000000'),
('Salmon', 'Generic', 208, 22, 0, 12, 0, 0, 59, '100', 'grams', true, '00000000-0000-0000-0000-000000000000'),
('Eggs', 'Generic', 155, 13, 1, 11, 0, 1, 124, '2', 'large', true, '00000000-0000-0000-0000-000000000000'),

-- Grains
('Brown Rice', 'Generic', 216, 5, 45, 1.8, 4, 0, 10, '1', 'cup cooked', true, '00000000-0000-0000-0000-000000000000'),
('Oatmeal', 'Generic', 154, 5, 28, 3, 4, 1, 9, '1', 'cup cooked', true, '00000000-0000-0000-0000-000000000000'),
('Whole Wheat Bread', 'Generic', 81, 4, 14, 1.1, 2, 1, 144, '1', 'slice', true, '00000000-0000-0000-0000-000000000000'),

-- Vegetables
('Broccoli', 'Generic', 55, 4, 11, 0.6, 5, 3, 64, '1', 'cup chopped', true, '00000000-0000-0000-0000-000000000000'),
('Spinach', 'Generic', 7, 0.9, 1, 0.1, 0.7, 0.1, 24, '1', 'cup raw', true, '00000000-0000-0000-0000-000000000000'),
('Sweet Potato', 'Generic', 112, 2, 26, 0.1, 4, 5, 7, '1', 'medium baked', true, '00000000-0000-0000-0000-000000000000'),

-- Dairy
('Greek Yogurt', 'Generic', 100, 17, 6, 0.7, 0, 6, 56, '170', 'grams', true, '00000000-0000-0000-0000-000000000000'),
('Milk', 'Generic', 83, 8, 12, 0.2, 0, 12, 107, '1', 'cup', true, '00000000-0000-0000-0000-000000000000'),

-- Nuts and Seeds
('Almonds', 'Generic', 164, 6, 6, 14, 4, 1, 1, '28', 'grams', true, '00000000-0000-0000-0000-000000000000'),
('Peanut Butter', 'Generic', 188, 8, 8, 16, 3, 3, 147, '2', 'tablespoons', true, '00000000-0000-0000-0000-000000000000')

ON CONFLICT (name, brand) DO NOTHING;
