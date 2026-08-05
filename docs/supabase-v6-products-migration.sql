-- ============================================================
-- BTF v6 migration: product marketplace fields on leads
-- Run in Supabase SQL editor. Safe to run more than once.
--
-- Adds:
--   product_interest    — which financing product the applicant picked
--                         (working_capital | term_loan | line_of_credit |
--                          equipment_financing | sba_loan | mca_consolidation |
--                          acquisition | commercial_real_estate | not_sure)
--   industry            — optional trade/industry label from the funnel
--   calculator_snapshot — JSON of the calculator state carried into apply
--                         ({product, amount, termMonths, frequency, rateType,
--                           rate, estPayment, totalRepayment})
--
-- Notes:
--   * funding_amount / use_of_funds are plain text columns, so the new
--     amount tiers (300k_750k, 750k_2m, 2m_plus) and use values
--     (debt_consolidation, acquisition_expansion, property_project)
--     need no schema change. Legacy "300k_plus" rows remain valid.
--   * Partial leads created after this migration also carry
--     email_consent / sms_consent captured at the contact step.
-- ============================================================

alter table public.leads
  add column if not exists product_interest text,
  add column if not exists industry text,
  add column if not exists calculator_snapshot jsonb;

comment on column public.leads.product_interest is
  'Financing product selected in the funnel (see lib/products.ts). "not_sure" when the applicant asked us to route.';
comment on column public.leads.industry is
  'Optional trade/industry the applicant selected on the business-basics step.';
comment on column public.leads.calculator_snapshot is
  'Funding-calculator state at handoff: {product, amount, termMonths, frequency, rateType, rate, estPayment, totalRepayment}. Estimates only — never an offer.';

-- Helpful for routing/filtering in the admin CRM.
create index if not exists leads_product_interest_idx
  on public.leads (product_interest);
