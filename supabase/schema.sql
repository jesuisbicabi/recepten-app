-- Recepten-app databaseschema
-- Voer dit uit in Supabase: Project -> SQL Editor -> New query -> Run

create extension if not exists pgcrypto;

create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete cascade
);

create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kcal numeric,
  protein numeric,
  carbs numeric,
  sugars numeric,
  fat numeric,
  saturated_fat numeric,
  unsaturated_fat numeric,
  fiber numeric,
  salt numeric
);

create table if not exists recipe_ingredients (
  recipe_id uuid not null references recipes(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id) on delete cascade,
  grams numeric not null,
  note text,
  primary key (recipe_id, ingredient_id)
);

create table if not exists recipe_steps (
  recipe_id uuid not null references recipes(id) on delete cascade,
  step_number int not null,
  instruction text not null,
  timer_seconds int,
  why text,
  primary key (recipe_id, step_number)
);

create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  date date not null,
  stars int check (stars between 1 and 5),
  note text
);

alter table recipes enable row level security;
alter table ingredients enable row level security;
alter table recipe_ingredients enable row level security;
alter table recipe_steps enable row level security;
alter table journal_entries enable row level security;

-- Tijdelijke, permissieve policies zolang er nog geen authenticatie/login is.
-- Deze geven IEDEREEN met de publishable key volledig lees- en schrijfrecht.
-- Vervang dit zodra auth wordt toegevoegd door policies op basis van user_id,
-- bv.: using (auth.uid() = user_id) with check (auth.uid() = user_id)
create policy "dev_open_recipes" on recipes for all using (true) with check (true);
create policy "dev_open_ingredients" on ingredients for all using (true) with check (true);
create policy "dev_open_recipe_ingredients" on recipe_ingredients for all using (true) with check (true);
create policy "dev_open_recipe_steps" on recipe_steps for all using (true) with check (true);
create policy "dev_open_journal_entries" on journal_entries for all using (true) with check (true);
