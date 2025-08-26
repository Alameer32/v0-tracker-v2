-- Create step_logs table for tracking daily steps
create table if not exists public.step_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  steps integer not null check (steps >= 0),
  date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

-- Enable RLS
alter table public.step_logs enable row level security;

-- Create policies
create policy "step_logs_select_own"
  on public.step_logs for select
  using (auth.uid() = user_id);

create policy "step_logs_insert_own"
  on public.step_logs for insert
  with check (auth.uid() = user_id);

create policy "step_logs_update_own"
  on public.step_logs for update
  using (auth.uid() = user_id);

create policy "step_logs_delete_own"
  on public.step_logs for delete
  using (auth.uid() = user_id);

-- Create index for date-based queries
create index if not exists step_logs_user_date_idx on public.step_logs(user_id, date desc);
