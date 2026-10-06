grant select, insert, update, delete on public.users to anon;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'users' and policyname = 'Allow public update'
  ) then
    create policy "Allow public update" on users for update to anon using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'users' and policyname = 'Allow public delete'
  ) then
    create policy "Allow public delete" on users for delete to anon using (true);
  end if;
end $$;
