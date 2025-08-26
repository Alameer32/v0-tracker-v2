-- Create weight_logs table for tracking weight over time
create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weight_kg numeric(5,2) not null,
  date date not null default current_date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

-- Enable RLS
alter table public.weight_logs enable row level security;

-- Create policies
create policy "weight_logs_select_own"
  on public.weight_logs for select
  using (auth.uid() = user_id);

create policy "weight_logs_insert_own"
  on public.weight_logs for insert
  with check (auth.uid() = user_id);

create policy "weight_logs_update_own"
  on public.weight_logs for update
  using (auth.uid() = user_id);

create policy "weight_logs_delete_own"
  on public.weight_logs for delete
  using (auth.uid() = user_id);

-- Create index for date-based queries
create index if not exists weight_logs_user_date_idx on public.weight_logs(user_id, date desc);
