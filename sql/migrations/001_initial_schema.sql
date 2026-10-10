create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text,
  role text not null default 'staff',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  age_group text,
  schedule text,
  fee_amount numeric(10,2) default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.batches (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  day text not null,
  timing text not null,
  level text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.admission_applications (
  id uuid primary key default uuid_generate_v4(),
  reference_code text unique not null,
  student_name text not null,
  dob date,
  parent_name text not null,
  parent_phone text not null,
  email text,
  requested_class text not null,
  preferred_batch text,
  notes text,
  privacy_accepted boolean not null default false,
  status text not null default 'pending' check (status in ('pending','contacted','approved','rejected','follow-up')),
  source text not null default 'public',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default uuid_generate_v4(),
  student_id text unique not null,
  full_name text not null,
  dob date,
  guardian_name text not null,
  parent_phone text not null,
  email text,
  class_name text,
  batch_name text,
  status text not null default 'active' check (status in ('active','paused','inactive')),
  joined_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attendance_sessions (
  id uuid primary key default uuid_generate_v4(),
  session_date date not null,
  batch_id uuid references public.batches(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (session_date, batch_id)
);

create table if not exists public.attendance_records (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.attendance_sessions(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  status text not null default 'present' check (status in ('present','absent','late')),
  marked_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (session_id, student_id)
);

create table if not exists public.fee_plans (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.students(id) on delete cascade,
  monthly_fee numeric(10,2) not null default 0,
  due_day integer not null default 5,
  next_due_date date,
  status text not null default 'active' check (status in ('active','paused','waived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fee_invoices (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.students(id) on delete cascade,
  invoice_no text unique not null,
  month text not null,
  total_amount numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending','partial','paid','overdue','waived')),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.students(id) on delete cascade,
  invoice_id uuid references public.fee_invoices(id),
  amount numeric(10,2) not null check (amount > 0),
  payment_method text not null default 'cash',
  payment_date date not null default current_date,
  receipt_no text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.reminder_settings (
  id uuid primary key default uuid_generate_v4(),
  enabled boolean not null default true,
  channel text not null default 'whatsapp' check (channel in ('whatsapp','sms')),
  lead_days integer not null default 3,
  reminder_template text not null default 'Hello {{student_name}}, this is a reminder from Feel The Dance Studio for fee due on {{due_date}}. Amount due: ₹{{amount_due}}.',
  consent_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reminder_logs (
  id uuid primary key default uuid_generate_v4(),
  fee_invoice_id uuid references public.fee_invoices(id),
  student_id uuid references public.students(id),
  provider text not null,
  channel text not null,
  scheduled_for timestamptz,
  attempt_count integer not null default 0,
  delivery_status text not null default 'queued' check (delivery_status in ('queued','sent','delivered','failed','skipped')),
  idempotency_key text unique,
  error_detail text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references public.profiles(id),
  entity_type text not null,
  entity_id uuid,
  event_type text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_admission_status on public.admission_applications(status);
create index if not exists idx_students_status on public.students(status);
create index if not exists idx_attendance_session_date on public.attendance_sessions(session_date);
create index if not exists idx_fee_invoices_due_date on public.fee_invoices(due_date);
create index if not exists idx_reminder_logs_status on public.reminder_logs(delivery_status);

alter table public.profiles enable row level security;
alter table public.academy_settings enable row level security;
alter table public.classes enable row level security;
alter table public.batches enable row level security;
alter table public.admission_applications enable row level security;
alter table public.students enable row level security;
alter table public.attendance_sessions enable row level security;
alter table public.attendance_records enable row level security;
alter table public.fee_plans enable row level security;
alter table public.fee_invoices enable row level security;
alter table public.payments enable row level security;
alter table public.reminder_settings enable row level security;
alter table public.reminder_logs enable row level security;
alter table public.audit_events enable row level security;
