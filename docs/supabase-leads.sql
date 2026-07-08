-- Built Together Funding Corp — leads table (v2: short funnel + statements)
-- Run in Supabase SQL editor (or via migration tooling).
-- See docs/SUPABASE_SETUP.md for project setup and env vars.
--
-- RLS: This app uses the Supabase *service role* from Next.js API routes only.
-- The service role bypasses RLS. If you later expose this table to PostgREST for
-- anon/authenticated clients, add explicit policies — do not rely on defaults.
--
-- Anon key / browser clients must never receive SUPABASE_SERVICE_ROLE_KEY.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  name text not null,
  business_name text not null,
  phone text not null,
  email text not null,

  first_name text,
  last_name text,
  dob date,
  ssn text,
  federal_id text,
  home_address text,
  home_state text,
  home_zip text,
  legal_entity text,
  business_address text,
  business_city text,
  business_state text,
  business_zip text,

  time_in_business text not null,
  funding_amount text not null,
  use_of_funds text[] not null default '{}',

  -- Bank statements (private storage bucket `statements`)
  statement_paths text[] not null default '{}',
  statements_status text not null default 'skipped',
  upload_token uuid not null unique default gen_random_uuid(),

  sms_consent boolean not null default false,
  email_consent boolean not null default false,

  lead_score integer not null default 0,
  lead_status text not null default 'new',

  source text,
  landing_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  gclid text,
  fbclid text,

  raw_answers jsonb not null default '{}'::jsonb,
  notes text,

  constraint leads_lead_status_check check (
    lead_status in (
      'new',
      'prequalified',
      'needs_review',
      'not_fit',
      'contacted',
      'call_booked',
      'submitted_to_partner',
      'funded',
      'lost'
    )
  ),

  constraint leads_statements_status_check check (
    statements_status in ('pending', 'received', 'skipped')
  )
);

comment on table public.leads is
  'Apply funnel leads; written only via service role from POST /api/apply.';

-- Keep updated_at in sync on row updates
create or replace function public.leads_set_updated_at()
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

drop trigger if exists leads_set_updated_at on public.leads;

create trigger leads_set_updated_at
  before update on public.leads
  for each row
  execute function public.leads_set_updated_at();

alter table public.leads enable row level security;

-- No policies: only service role (server) should access this table via supabase-js.
-- Add policies if you intentionally expose leads to other roles.

-- ---------------------------------------------------------------------------
-- Storage: private bucket for bank statements.
-- Files land under presubmit/{session}/ (before submit) and leads/{lead_id}/
-- (secure upload link). Bucket stays private; only the service role reads it.
-- Set a retention/cleanup policy for presubmit/ orphans (e.g. scheduled job
-- deleting objects older than 30 days that are not referenced by any lead).
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('statements', 'statements', false)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- MIGRATION from v1 (12-question funnel). Only run if you created the old
-- table before this version; skip entirely on fresh installs.
-- ---------------------------------------------------------------------------
-- alter table public.leads add column if not exists statement_paths text[] not null default '{}';
-- alter table public.leads add column if not exists statements_status text not null default 'skipped';
-- alter table public.leads add column if not exists upload_token uuid not null unique default gen_random_uuid();
-- alter table public.leads add constraint leads_statements_status_check
--   check (statements_status in ('pending', 'received', 'skipped'));
-- -- Old v1 columns are no longer written. Keep them for history or drop:
-- alter table public.leads alter column industry drop not null;
-- alter table public.leads alter column monthly_revenue drop not null;
-- alter table public.leads alter column capacity_constraint drop not null;
-- -- Optional cleanup:
-- -- alter table public.leads drop column if exists website;
-- -- alter table public.leads drop column if exists annual_revenue;
-- -- alter table public.leads drop column if exists booked_out;
-- -- alter table public.leads drop column if exists turning_down_work;
-- -- alter table public.leads drop column if exists adding_equipment;
-- -- alter table public.leads drop column if exists hiring_crew;
-- -- alter table public.leads drop column if exists increasing_ads;
-- -- alter table public.leads drop column if exists active_funding;
-- -- alter table public.leads drop column if exists can_provide_statements;
-- -- alter table public.leads drop column if exists best_time_to_contact;
