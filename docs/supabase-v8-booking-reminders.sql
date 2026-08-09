-- Built Together Funding — v8: booking reminder send markers
-- Run AFTER supabase-bookings-v4-migration.sql (+ v5 Meet cols if used)
-- Tracks 24h / 12h / 1h applicant reminders so cron does not double-send.

alter table public.bookings
  add column if not exists reminder_24h_sent_at timestamptz,
  add column if not exists reminder_12h_sent_at timestamptz,
  add column if not exists reminder_1h_sent_at timestamptz;

comment on column public.bookings.reminder_24h_sent_at is
  'When the 24-hour-before reminder was sent (email/SMS).';
comment on column public.bookings.reminder_12h_sent_at is
  'When the 12-hour-before reminder was sent (email/SMS).';
comment on column public.bookings.reminder_1h_sent_at is
  'When the 1-hour-before reminder was sent (email/SMS).';
