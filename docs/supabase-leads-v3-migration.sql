-- Built Together Funding Corp — v3 migration: owner + business detail fields
-- Run in Supabase SQL editor on existing projects created before this version.

alter table public.leads add column if not exists first_name text;
alter table public.leads add column if not exists last_name text;
alter table public.leads add column if not exists dob date;
alter table public.leads add column if not exists ssn text;
alter table public.leads add column if not exists federal_id text;
alter table public.leads add column if not exists home_address text;
alter table public.leads add column if not exists home_state text;
alter table public.leads add column if not exists home_zip text;
alter table public.leads add column if not exists legal_entity text;
alter table public.leads add column if not exists business_address text;
alter table public.leads add column if not exists business_city text;
alter table public.leads add column if not exists business_state text;
alter table public.leads add column if not exists business_zip text;

comment on column public.leads.ssn is
  'Sensitive: service-role access only. Never expose to browser clients.';
