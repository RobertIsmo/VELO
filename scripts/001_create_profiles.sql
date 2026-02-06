-- Create profiles table to store username and link to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  email text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Anyone can read profiles (needed for username lookup during login)
create policy "profiles_select_all" on public.profiles for select using (true);

-- Users can only insert their own profile
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- Users can only update their own profile
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Users can only delete their own profile
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Auto-create profile on signup via trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', ''),
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
