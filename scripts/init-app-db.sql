CREATE ROLE app_user WITH NOINHERIT LOGIN PASSWORD 'app_pass';

CREATE DATABASE db OWNER app_user;

\connect db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE appdata (
    id uuid DEFAULT uuid_generate_v4 (),
    createtime TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updatetime TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deletetime TIMESTAMPTZ NULL,
    content VARCHAR,
    PRIMARY KEY (id)
);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatetime = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON appdata
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_user;