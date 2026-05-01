
-- Lock down has_role: only callable from within database (RLS uses it via security definer)
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;

-- Fix set_updated_at search_path
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin new.updated_at = now(); return new; end;
$$;

-- Tighten inquiry insert policy with field validation
drop policy if exists "Anyone can submit inquiries" on public.inquiries;
create policy "Anyone can submit valid inquiries" on public.inquiries
  for insert
  with check (
    length(name) between 1 and 100
    and length(email) between 3 and 255
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and length(message) between 1 and 2000
    and (phone is null or length(phone) <= 30)
    and (project_type is null or length(project_type) <= 50)
    and status = 'new'
  );
