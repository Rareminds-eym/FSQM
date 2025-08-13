create table public.attempt_details (
  id serial not null,
  email text not null,
  session_id text not null,
  module_number integer not null,
  question_index integer not null,
  question jsonb not null,
  answer jsonb not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  time_remaining integer not null default 5400,
  constraint attempt_details_pkey primary key (id),
  constraint attempt_details_email_session_id_module_number_question_ind_key unique (email, session_id, module_number, question_index),
  constraint check_time_remaining_range check (
    (
      (time_remaining >= 0)
      and (time_remaining <= 5400)
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_attempt_details_timer on public.attempt_details using btree (email, session_id, module_number, time_remaining) TABLESPACE pg_default;

create table public.individual_attempts (
  id uuid not null default gen_random_uuid (),
  session_id uuid not null,
  module_number integer null,
  score integer null,
  completion_time_sec integer null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  email text null,
  team_name text null,
  constraint individual_attempts_pkey primary key (id),
  constraint individual_attempts_module_number_check check ((module_number = any (array[5, 6]))),
  constraint individual_attempts_score_check check (
    (
      (score >= 0)
      and (score <= 60)
    )
  )
) TABLESPACE pg_default;
 
create table public.team_attempts (
  id uuid not null default gen_random_uuid (),
  session_id uuid not null,
  module_number integer null,
  weighted_avg_score numeric(5, 2) null,
  avg_time_sec integer null,
  unlocked_next_module boolean null default false,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint team_attempts_pkey primary key (id),
  constraint team_attempts_module_number_check check ((module_number = any (array[5, 6])))
) TABLESPACE pg_default;

