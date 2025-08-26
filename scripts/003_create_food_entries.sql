-- Create food_entries table for logging individual food consumption
create table if not exists public.food_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  food_id uuid not null references public.foods(id) on delete cascade,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  quantity numeric(8,2) not null default 1,
  date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.food_entries enable row level security;

-- Create policies
create policy "food_entries_select_own"
  on public.food_entries for select
  using (auth.uid() = user_id);

create policy "food_entries_insert_own"
  on public.food_entries for insert
  with check (auth.uid() = user_id);

create policy "food_entries_update_own"
  on public.food_entries for update
  using (auth.uid() = user_id);

create policy "food_entries_delete_own"
  on public.food_entries for delete
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists food_entries_user_date_idx on public.food_entries(user_id, date);
create index if not exists food_entries_user_meal_date_idx on public.food_entries(user_id, meal_type, date);
