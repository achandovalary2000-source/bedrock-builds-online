
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users view own roles" on public.user_roles
  for select to authenticated
  using (auth.uid() = user_id);

create policy "Admins manage roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Materials
create table public.materials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text,
  unit text not null default 'unit',
  price_per_unit numeric(10,2),
  image_url text,
  in_stock boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.materials enable row level security;

create policy "Materials are viewable by everyone" on public.materials
  for select using (true);
create policy "Admins insert materials" on public.materials
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update materials" on public.materials
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete materials" on public.materials
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text,
  year integer,
  category text,
  description text,
  cover_image_url text,
  gallery text[] not null default '{}',
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Projects are viewable by everyone" on public.projects
  for select using (true);
create policy "Admins insert projects" on public.projects
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update projects" on public.projects
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete projects" on public.projects
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Inquiries
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  project_type text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

create policy "Anyone can submit inquiries" on public.inquiries
  for insert with check (true);
create policy "Admins view inquiries" on public.inquiries
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update inquiries" on public.inquiries
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete inquiries" on public.inquiries
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger materials_updated_at before update on public.materials
  for each row execute function public.set_updated_at();
create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();
