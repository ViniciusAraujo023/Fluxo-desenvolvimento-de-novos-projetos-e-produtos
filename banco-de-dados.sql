-- ============================================================
-- Fluxo de Engenharia Soprano — schema Supabase (PostgreSQL)
-- ============================================================
-- Como aplicar:
--   1. No painel do Supabase, vá em SQL Editor → New query.
--   2. Cole este script inteiro e rode.
--   3. Em Project Settings → API, copie a "Project URL" e a chave
--      "anon public" e cole nas constantes SUPABASE_URL /
--      SUPABASE_ANON_KEY no topo do arquivo fluxo-engenharia.jsx.
-- ============================================================
 
-- Extensão para gerar UUIDs (não é usada como PK aqui — o app já
-- gera seus próprios IDs curtos no client — mas fica disponível
-- caso queira trocar a estratégia de IDs no futuro).
create extension if not exists "pgcrypto";
 
-- ------------------------------------------------------------
-- Tabela principal: um registro por projeto/ideia, com o
-- progresso de cada uma das 35 etapas guardado em JSONB (mesma
-- estrutura que o app já usa em memória: { "0": {...}, "1": {...} }).
-- ------------------------------------------------------------
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
 
-- ------------------------------------------------------------
-- Tabela auxiliar chave/valor — hoje guarda só qual usuário
-- "logado" está selecionado no seletor do cabeçalho (o sistema
-- ainda não tem autenticação real). Se no futuro adicionar
-- Supabase Auth, essa tabela deixa de ser necessária e o usuário
-- atual passa a vir de auth.uid().
-- ------------------------------------------------------------
create table if not exists app_state (
  key   text primary key,
  value jsonb not null
);
 
-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
-- Este é um protótipo sem autenticação de usuário (login real),
-- então as policies abaixo liberam leitura/escrita para a chave
-- "anon" — ou seja, qualquer pessoa com a URL e a anon key do
-- projeto consegue ler e alterar os dados. Isso é aceitável para
-- testar o protótipo, mas ANTES de usar em produção com dados
-- reais da empresa, troque por policies que exijam autenticação
-- (Supabase Auth) e restrinjam updates conforme o usuário/equipe.
-- ------------------------------------------------------------
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
