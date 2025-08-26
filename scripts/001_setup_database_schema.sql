-- Create profiles table for user data and nutrition goals
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  height_cm INTEGER,
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
  goal TEXT CHECK (goal IN ('lose_weight', 'maintain_weight', 'gain_weight', 'build_muscle')),
  daily_calorie_goal INTEGER DEFAULT 2000,
  daily_protein_goal INTEGER DEFAULT 150,
  daily_carb_goal INTEGER DEFAULT 250,
  daily_fat_goal INTEGER DEFAULT 65,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Enable RLS on existing tables and create policies
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.step_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for foods (allow all users to read, only creators to modify)
CREATE POLICY "foods_select_all" ON public.foods FOR SELECT TO authenticated USING (true);
CREATE POLICY "foods_insert_own" ON public.foods FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "foods_update_own" ON public.foods FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "foods_delete_own" ON public.foods FOR DELETE USING (auth.uid() = created_by);

-- RLS policies for food_entries
CREATE POLICY "food_entries_select_own" ON public.food_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "food_entries_insert_own" ON public.food_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "food_entries_update_own" ON public.food_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "food_entries_delete_own" ON public.food_entries FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for weight_logs
CREATE POLICY "weight_logs_select_own" ON public.weight_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "weight_logs_insert_own" ON public.weight_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "weight_logs_update_own" ON public.weight_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "weight_logs_delete_own" ON public.weight_logs FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for step_logs
CREATE POLICY "step_logs_select_own" ON public.step_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "step_logs_insert_own" ON public.step_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "step_logs_update_own" ON public.step_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "step_logs_delete_own" ON public.step_logs FOR DELETE USING (auth.uid() = user_id);
