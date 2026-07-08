-- Built Together Funding Corp — v4: bookings CRM + partial leads + booking tokens
-- Run on existing Supabase projects AFTER supabase-leads-v3-migration.sql

-- Allow partial funnel saves (contact captured, file not finished)
alter table public.leads drop constraint if exists leads_lead_status_check;
alter table public.leads add constraint leads_lead_status_check check (
  lead_status in (
    'partial',
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
);

-- Secure token for post-submit funding review scheduling (/book/{token}/)
alter table public.leads
  add column if not exists booking_token uuid not null unique default gen_random_uuid();

comment on column public.leads.booking_token is
  'Unguessable token for applicant self-scheduling a funding review call.';

-- Funding review appointments (Wash Kings–style date + time slots)
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  lead_id uuid not null references public.leads(id) on delete cascade,
  appointment_date date not null,
  start_time time not null,
  duration_minutes integer not null default 30,

  status text not null default 'scheduled',

  constraint bookings_status_check check (
    status in ('scheduled', 'completed', 'cancelled', 'no_show')
  ),
  constraint bookings_duration_check check (duration_minutes > 0),
  constraint bookings_unique_slot unique (appointment_date, start_time)
);

comment on table public.bookings is
  'Funding review calls booked via /book/{token}/ or inline on apply result.';

create index if not exists bookings_lead_id_idx on public.bookings (lead_id);
create index if not exists bookings_date_idx on public.bookings (appointment_date);

create or replace function public.bookings_set_updated_at()
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

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row
  execute function public.bookings_set_updated_at();

alter table public.bookings enable row level security;
