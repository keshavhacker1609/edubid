-- EduBid Supabase Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- STUDENTS
-- ============================================================
create table if not exists students (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null unique,
  phone text not null,
  date_of_birth date,
  pan_number text,
  aadhar_verified boolean default false,
  digilocker_verified boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- LENDERS
-- ============================================================
create table if not exists lenders (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text check (type in ('PSU Bank', 'Private Bank', 'NBFC', 'International')),
  rating text,
  total_disbursed_crore numeric default 0,
  active_bids integer default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- LOAN REQUESTS
-- ============================================================
create table if not exists loan_requests (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references students(id) on delete cascade,
  student_name text not null,
  degree text not null,
  institution text not null,
  institution_tier text check (institution_tier in ('IIT/IIM/AIIMS', 'NIT/Top-Private', 'State-University', 'Other')),
  course_duration_years integer not null,
  loan_amount numeric not null,
  tenure_months integer not null,
  purpose text,
  trust_score jsonb not null default '{}',
  current_lowest_rate numeric not null default 14.0,
  bid_count integer default 0,
  auction_ends_at timestamptz not null,
  status text check (status in ('open', 'accepted', 'closed', 'disbursed')) default 'open',
  co_applicant jsonb,
  created_at timestamptz default now()
);

-- ============================================================
-- BIDS
-- ============================================================
create table if not exists bids (
  id uuid primary key default uuid_generate_v4(),
  loan_request_id uuid references loan_requests(id) on delete cascade,
  lender_id uuid references lenders(id) on delete set null,
  lender_name text not null,
  interest_rate numeric not null,
  tenure_months integer,
  processing_fee_percent numeric default 0,
  special_conditions text,
  status text check (status in ('active', 'outbid', 'accepted', 'withdrawn')) default 'active',
  created_at timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_loan_requests_status on loan_requests(status);
create index if not exists idx_loan_requests_student_id on loan_requests(student_id);
create index if not exists idx_bids_loan_request_id on bids(loan_request_id);
create index if not exists idx_bids_lender_id on bids(lender_id);
create index if not exists idx_bids_interest_rate on bids(loan_request_id, interest_rate asc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table students enable row level security;
alter table loan_requests enable row level security;
alter table bids enable row level security;
alter table lenders enable row level security;

-- Public read policies (adjust for production auth)
create policy "Public read loan_requests" on loan_requests for select using (true);
create policy "Public read bids" on bids for select using (true);
create policy "Public read lenders" on lenders for select using (true);
create policy "Public insert loan_requests" on loan_requests for insert with check (true);
create policy "Public insert bids" on bids for insert with check (true);
create policy "Public insert students" on students for insert with check (true);

-- ============================================================
-- FUNCTION: Auto-update lowest rate on new bid
-- ============================================================
create or replace function update_lowest_rate()
returns trigger as $$
begin
  update loan_requests
  set
    current_lowest_rate = (
      select min(interest_rate)
      from bids
      where loan_request_id = new.loan_request_id
        and status = 'active'
    ),
    bid_count = bid_count + 1
  where id = new.loan_request_id;
  return new;
end;
$$ language plpgsql;

create trigger on_bid_inserted
after insert on bids
for each row execute function update_lowest_rate();

-- ============================================================
-- FUNCTION: Mark competing bids as outbid when one is accepted
-- ============================================================
create or replace function handle_bid_acceptance()
returns trigger as $$
begin
  if new.status = 'accepted' and old.status != 'accepted' then
    -- Close the auction
    update loan_requests
    set status = 'accepted'
    where id = new.loan_request_id;

    -- Mark all other active bids as outbid
    update bids
    set status = 'outbid'
    where loan_request_id = new.loan_request_id
      and id != new.id
      and status = 'active';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger on_bid_accepted
after update on bids
for each row execute function handle_bid_acceptance();
