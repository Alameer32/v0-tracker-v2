-- Seed some common foods for users to get started
insert into public.foods (name, brand, serving_size, serving_unit, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving, fiber_per_serving, sugar_per_serving, sodium_per_serving, is_verified) values
-- Fruits
('Apple', null, '1', 'medium', 95, 0.5, 25, 0.3, 4, 19, 2, true),
('Banana', null, '1', 'medium', 105, 1.3, 27, 0.4, 3, 14, 1, true),
('Orange', null, '1', 'medium', 62, 1.2, 15, 0.2, 3, 12, 0, true),
('Strawberries', null, '1', 'cup', 49, 1, 12, 0.5, 3, 7, 2, true),

-- Vegetables
('Broccoli', null, '1', 'cup', 25, 3, 5, 0.3, 2, 1, 24, true),
('Spinach', null, '1', 'cup', 7, 0.9, 1, 0.1, 0.7, 0.1, 24, true),
('Carrots', null, '1', 'medium', 25, 0.5, 6, 0.1, 2, 3, 42, true),
('Sweet Potato', null, '1', 'medium', 112, 2, 26, 0.1, 4, 5, 7, true),

-- Proteins
('Chicken Breast', null, '100', 'g', 165, 31, 0, 3.6, 0, 0, 74, true),
('Salmon', null, '100', 'g', 208, 20, 0, 13, 0, 0, 59, true),
('Eggs', null, '1', 'large', 70, 6, 0.6, 5, 0, 0.6, 70, true),
('Greek Yogurt', null, '1', 'cup', 130, 23, 9, 0, 0, 9, 65, true),

-- Grains
('Brown Rice', null, '1', 'cup cooked', 216, 5, 45, 1.8, 4, 0, 10, true),
('Quinoa', null, '1', 'cup cooked', 222, 8, 39, 3.6, 5, 2, 13, true),
('Oatmeal', null, '1', 'cup cooked', 147, 6, 25, 3, 4, 1, 2, true),
('Whole Wheat Bread', null, '1', 'slice', 81, 4, 14, 1.1, 2, 1, 144, true),

-- Nuts and Seeds
('Almonds', null, '1', 'oz (28g)', 164, 6, 6, 14, 4, 1, 1, true),
('Peanut Butter', null, '2', 'tbsp', 188, 8, 8, 16, 3, 3, 147, true),
('Chia Seeds', null, '1', 'tbsp', 58, 2, 5, 4, 5, 0, 2, true);
