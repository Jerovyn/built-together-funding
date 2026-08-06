-- Built Together Funding Corp — v7: monthly revenue on Stage A prequal
-- Run in Supabase SQL editor after v6.

alter table public.leads
  add column if not exists monthly_revenue text;

comment on column public.leads.monthly_revenue is
  'Approximate monthly revenue band from Stage A prequal (e.g. 25k_50k).';
