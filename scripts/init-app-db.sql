CREATE ROLE app_user WITH NOINHERIT CREATEDB LOGIN PASSWORD 'app_pass';

CREATE DATABASE db OWNER app_user;

\connect db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE appdata (
    id uuid DEFAULT uuid_generate_v4 (),
    createtime TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updatetime TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deletetime timestamptz NULL,
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