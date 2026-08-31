create extension if not exists "pgcrypto";
create table if not exists projects (
  id            text primary key,
  name          text not null,
  responsavel   text,
  start_date    date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    text,                -- id do usuário (ver tabela USERS no próprio código)
  current_step  integer not null default 0,
  status        text not null default 'Em andamento'
                  check (status in ('Em andamento', 'Concluído', 'Recusado', 'Cancelado')),
  email_notified boolean not null default false,
  email_method   text,               -- 'sent' (EmailJS) ou 'mailto' (fallback)
  data           jsonb not null default '{}'::jsonb
);
 
create index if not exists idx_projects_status on projects (status);
create index if not exists idx_projects_created_at on projects (created_at desc);
 

create table if not exists app_state (
  key   text primary key,
  value jsonb not null
);
 

alter table projects enable row level security;
alter table app_state enable row level security;
 
drop policy if exists "Allow all access to projects" on projects;
create policy "Allow all access to projects"
  on projects for all
  using (true)
  with check (true);
 
drop policy if exists "Allow all access to app_state" on app_state;
create policy "Allow all access to app_state"
  on app_state for all
  using (true)
  with check (true);
