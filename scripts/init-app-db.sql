CREATE ROLE api_user WITH NOINHERIT LOGIN PASSWORD 'api_pass';

CREATE DATABASE db OWNER api_user;

\connect db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE apidata (
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
BEFORE UPDATE ON apidata
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO api_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO api_user;