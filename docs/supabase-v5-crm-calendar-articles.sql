-- Built Together Funding Corp — v5: Meet links, Google tokens, articles CMS
-- Run AFTER docs/supabase-bookings-v4-migration.sql

-- Google Meet / Calendar fields on bookings
alter table public.bookings
  add column if not exists meet_link text,
  add column if not exists google_event_id text,
  add column if not exists calendar_html_link text;

comment on column public.bookings.meet_link is
  'Google Meet join URL created when the call is booked.';
comment on column public.bookings.google_event_id is
  'Google Calendar event id for cancel/update.';

-- Single-row style key/value store for integrations (service-role only)
create table if not exists public.app_integrations (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

comment on table public.app_integrations is
  'Server-only integration secrets (e.g. Google OAuth refresh token). RLS on; service role bypasses.';

alter table public.app_integrations enable row level security;

-- Articles CMS (draft → publish → live /resources)
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,

  slug text not null unique,
  title text not null,
  description text not null default '',
  read_minutes integer not null default 4,
  intro text not null default '',
  sections jsonb not null default '[]'::jsonb,
  takeaway text not null default '',
  featured_image_path text,

  status text not null default 'draft',

  constraint articles_status_check check (status in ('draft', 'published')),
  constraint articles_read_minutes_check check (read_minutes > 0)
);

comment on table public.articles is
  'Resources / blog posts managed from /admin/content/.';

create index if not exists articles_status_published_idx
  on public.articles (status, published_at desc);

create or replace function public.articles_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row
  execute function public.articles_set_updated_at();

alter table public.articles enable row level security;
