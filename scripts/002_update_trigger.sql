-- Update handle_new_user() trigger to carry birth data from user_metadata during signup
-- This ensures members who register with birth info have it in their profiles table

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    account_type,
    birth_name,
    birth_date,
    birth_time,
    birth_place,
    birth_country,
    gender,
    year_started,
    readings_this_year
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'account_type', 'guest'),
    new.raw_user_meta_data ->> 'birth_name',
    (new.raw_user_meta_data ->> 'birth_date')::date,
    (new.raw_user_meta_data ->> 'birth_time')::time,
    new.raw_user_meta_data ->> 'birth_place',
    new.raw_user_meta_data ->> 'birth_country',
    new.raw_user_meta_data ->> 'gender',
    extract(year from now()),
    0
  )
  on conflict (id) do update set
    birth_name = coalesce(excluded.birth_name, profiles.birth_name),
    birth_date = coalesce(excluded.birth_date, profiles.birth_date),
    birth_time = coalesce(excluded.birth_time, profiles.birth_time),
    birth_place = coalesce(excluded.birth_place, profiles.birth_place),
    birth_country = coalesce(excluded.birth_country, profiles.birth_country),
    gender = coalesce(excluded.gender, profiles.gender),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
