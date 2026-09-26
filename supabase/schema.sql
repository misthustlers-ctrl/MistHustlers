create extension if not exists pgcrypto;

create table if not exists public.seo_audit_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  url text not null,
  score integer not null,
  passed integer not null,
  total integer not null,
  checks jsonb not null default '[]'::jsonb,
  traffic_hint text,
  fetch_mode text,
  html_length integer
);

create index if not exists seo_audit_runs_created_at_idx
  on public.seo_audit_runs (created_at desc);

alter table public.seo_audit_runs
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists seo_audit_runs_user_id_idx
  on public.seo_audit_runs (user_id);

create index if not exists seo_audit_runs_url_idx
  on public.seo_audit_runs (url);

create table if not exists public.lead_search_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  niche text not null,
  location text not null,
  filter text not null,
  requested_count integer not null,
  returned_count integer not null,
  source text not null default 'OpenStreetMap',
  leads jsonb not null default '[]'::jsonb
);

create index if not exists lead_search_runs_created_at_idx
  on public.lead_search_runs (created_at desc);

create index if not exists lead_search_runs_niche_location_idx
  on public.lead_search_runs (niche, location);

create table if not exists public.lead_cache (
  id uuid primary key default gen_random_uuid(),
  lead_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  source text not null,
  source_url text,
  niche text not null,
  niche_key text not null,
  location text not null,
  location_key text not null,
  business_name text not null,
  category text,
  address text,
  phone text,
  email text,
  website text,
  website_status text not null,
  lead_score integer not null default 0,
  priority text not null default 'C',
  reason text,
  raw jsonb not null default '{}'::jsonb
);

create index if not exists lead_cache_lookup_idx
  on public.lead_cache (niche_key, location_key, lead_score desc);

create index if not exists lead_cache_status_idx
  on public.lead_cache (website_status, priority);

create index if not exists lead_cache_updated_at_idx
  on public.lead_cache (updated_at desc);

create table if not exists public.backend_job_queue (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  finished_at timestamptz,
  expires_at timestamptz not null,
  job_type text not null,
  status text not null check (status in ('queued', 'running', 'completed', 'failed')),
  meta jsonb not null default '{}'::jsonb
);

create index if not exists backend_job_queue_active_idx
  on public.backend_job_queue (job_type, status, expires_at desc);

create index if not exists backend_job_queue_created_at_idx
  on public.backend_job_queue (created_at desc);

create table if not exists public.api_gateway_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  scope text not null,
  client_ip text not null
);

create index if not exists api_gateway_events_lookup_idx
  on public.api_gateway_events (scope, client_ip, created_at desc);

create index if not exists api_gateway_events_created_at_idx
  on public.api_gateway_events (created_at desc);

create or replace function public.purge_old_api_gateway_events()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  delete from public.api_gateway_events
  where created_at < now() - interval '2 days';
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

create table if not exists public.api_response_cache (
  cache_key text primary key,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  response jsonb not null
);

create index if not exists api_response_cache_expires_at_idx
  on public.api_response_cache (expires_at desc);

alter table public.seo_audit_runs enable row level security;
alter table public.lead_search_runs enable row level security;
alter table public.lead_cache enable row level security;
alter table public.backend_job_queue enable row level security;
alter table public.api_gateway_events enable row level security;
alter table public.api_response_cache enable row level security;

drop policy if exists "service role can manage seo audit runs" on public.seo_audit_runs;
create policy "service role can manage seo audit runs"
  on public.seo_audit_runs
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "service role can manage lead search runs" on public.lead_search_runs;
create policy "service role can manage lead search runs"
  on public.lead_search_runs
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "service role can manage lead cache" on public.lead_cache;
create policy "service role can manage lead cache"
  on public.lead_cache
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "service role can manage backend job queue" on public.backend_job_queue;
create policy "service role can manage backend job queue"
  on public.backend_job_queue
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "service role can manage api gateway events" on public.api_gateway_events;
create policy "service role can manage api gateway events"
  on public.api_gateway_events
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "service role can manage api response cache" on public.api_response_cache;
create policy "service role can manage api response cache"
  on public.api_response_cache
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
