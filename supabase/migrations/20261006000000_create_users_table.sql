create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  nama text not null,
  email text not null,
  password text not null,
  created_at timestamp with time zone default now()
);

alter table users enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'users' and policyname = 'Allow public read'
  ) then
    create policy "Allow public read" on users for select to anon using (true);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'users' and policyname = 'Allow public insert'
  ) then
    create policy "Allow public insert" on users for insert to anon with check (true);
  end if;
end $$;
