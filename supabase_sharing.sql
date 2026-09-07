-- ============================================================================
--  Shared goals & investments  —  run this in Supabase → SQL Editor
--  Safe to run more than once (uses IF NOT EXISTS / CREATE OR REPLACE).
-- ============================================================================

create table if not exists public.shares (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users(id) on delete cascade,
  owner_name      text,                       -- display name shown to the recipient
  recipient_email text not null,              -- who it's shared with (lowercased)
  recipient_id    uuid references auth.users(id) on delete set null,
  item_type       text not null check (item_type in ('goal','investment')),
  item_id         text not null,              -- the goal/investment id in the owner's state
  permission      text not null check (permission in ('view','edit')),
  item_data       jsonb not null default '{}'::jsonb,   -- current snapshot of the shared item
  updated_at      timestamptz not null default now(),
  updated_by      uuid,
  created_at      timestamptz not null default now(),
  unique (owner_id, item_type, item_id, recipient_email)
);

-- Fast lookups
create index if not exists shares_owner_idx     on public.shares (owner_id);
create index if not exists shares_recipient_idx on public.shares (lower(recipient_email));

alter table public.shares enable row level security;

-- Helper: the email of the current user, lowercased
create or replace function public.current_email() returns text
language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''))
$$;

-- A row is VISIBLE to its owner, or to the recipient (matched by id or by email).
drop policy if exists shares_select on public.shares;
create policy shares_select on public.shares for select
  using (
    owner_id = auth.uid()
    or recipient_id = auth.uid()
    or lower(recipient_email) = public.current_email()
  );

-- Only the owner can create a share, and only for their own items.
drop policy if exists shares_insert on public.shares;
create policy shares_insert on public.shares for insert
  with check ( owner_id = auth.uid() );

-- The owner can always update. A recipient can update ONLY when permission = 'edit'
-- (this is how a partner deposits into a shared goal). View-only recipients cannot write.
drop policy if exists shares_update on public.shares;
create policy shares_update on public.shares for update
  using (
    owner_id = auth.uid()
    or (permission = 'edit'
        and (recipient_id = auth.uid() or lower(recipient_email) = public.current_email()))
  )
  with check (
    owner_id = auth.uid()
    or (permission = 'edit'
        and (recipient_id = auth.uid() or lower(recipient_email) = public.current_email()))
  );

-- Only the owner can remove a share (revoke).
drop policy if exists shares_delete on public.shares;
create policy shares_delete on public.shares for delete
  using ( owner_id = auth.uid() );

-- When a user signs in, claim any shares that were sent to their email address
-- before they had an account (fills recipient_id). Optional but keeps data tidy.
create or replace function public.claim_pending_shares() returns void
language sql security definer set search_path = public as $$
  update public.shares
     set recipient_id = auth.uid()
   where recipient_id is null
     and lower(recipient_email) = public.current_email();
$$;

grant execute on function public.claim_pending_shares() to authenticated;
