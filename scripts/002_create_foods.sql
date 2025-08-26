-- Create foods table for storing food items and their nutritional information
create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  barcode text,
  serving_size text not null,
  serving_unit text not null,
  calories_per_serving numeric(8,2) not null,
  protein_per_serving numeric(8,2) default 0,
  carbs_per_serving numeric(8,2) default 0,
  fat_per_serving numeric(8,2) default 0,
  fiber_per_serving numeric(8,2) default 0,
  sugar_per_serving numeric(8,2) default 0,
  sodium_per_serving numeric(8,2) default 0,
  is_verified boolean default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.foods enable row level security;

-- Create policies - foods can be viewed by all users, but only created/updated by their creators
create policy "foods_select_all"
  on public.foods for select
  using (true);

create policy "foods_insert_own"
  on public.foods for insert
  with check (auth.uid() = created_by);

create policy "foods_update_own"
  on public.foods for update
  using (auth.uid() = created_by);

create policy "foods_delete_own"
  on public.foods for delete
  using (auth.uid() = created_by);

-- Create index for faster searches
create index if not exists foods_name_idx on public.foods using gin(to_tsvector('english', name));
create index if not exists foods_barcode_idx on public.foods(barcode) where barcode is not null;
