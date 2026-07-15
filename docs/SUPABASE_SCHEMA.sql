-- expenses table
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  type text check (type in ('income', 'expense')) not null,
  amount integer not null check (amount > 0),
  category text check (
    (type = 'expense' and category in ('식사', '카페', '교통', '쇼핑', '기타'))
    or
    (type = 'income' and category = 'income')
  ) not null,
  note text,
  transacted_at date not null default current_date,
  created_at timestamptz default now()
);

alter table expenses enable row level security;

drop policy if exists "own select" on expenses;
create policy "own select"
  on expenses for select
  using (auth.uid() = user_id);

drop policy if exists "own insert" on expenses;
create policy "own insert"
  on expenses for insert
  with check (auth.uid() = user_id);

drop policy if exists "own update" on expenses;
create policy "own update"
  on expenses for update
  using (auth.uid() = user_id);

drop policy if exists "own delete" on expenses;
create policy "own delete"
  on expenses for delete
  using (auth.uid() = user_id);

