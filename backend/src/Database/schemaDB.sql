CREATE TABLE IF NOT EXISTS Commands (
    command_id SERIAL PRIMARY KEY,
    command_name VARCHAR UNIQUE NOT NULL
) --
CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR,
    password VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    command_id INTEGER REFERENCES Commands(command_id)
) --
CREATE TABLE IF NOT EXISTS Units (
    unit_id SERIAL PRIMARY KEY,
    unit_name VARCHAR UNIQUE NOT NULL,
    command_id INTEGER REFERENCES Commands(command_id)
) --
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'item_types') THEN
        EXECUTE 'CREATE TYPE Item_Types AS ENUM (''חורף'', ''שהייה'')';
    END IF;
END $$;
--
CREATE TABLE IF NOT EXISTS Items (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR UNIQUE NOT NULL,
    item_type Item_Types NOT NULL
) --
CREATE TABLE IF NOT EXISTS Ideal_Inventory (
    item_id INTEGER REFERENCES Items(item_id),
    unit_id INTEGER REFERENCES Units(unit_id),
    value INTEGER NOT NULL CHECK(value >= 0)
) --
CREATE TABLE IF NOT EXISTS Needed_Inventory (
    item_id INTEGER REFERENCES Items(item_id),
    unit_id INTEGER REFERENCES Units(unit_id),
    value INTEGER NOT NULL CHECK(value >= 0)
) -- 
CREATE TABLE IF NOT EXISTS Future_Supplied (
    item_id INTEGER REFERENCES Items(item_id),
    unit_id INTEGER REFERENCES Units(unit_id),
    value INTEGER NOT NULL CHECK(value >= 0)
) -- 
CREATE TABLE IF NOT EXISTS Inventory_Tracking (
    date TIMESTAMP NOT NULL,
    item_id INTEGER REFERENCES Items(item_id),
    value INTEGER NOT NULL CHECK(value >= 0)
) -- 
CREATE TABLE IF NOT EXISTS Marhas_Inventory (
    date TIMESTAMP NOT NULL,
    item_id INTEGER REFERENCES Items(item_id),
    value INTEGER NOT NULL CHECK(value >= 0)
) -- 
CREATE TABLE IF NOT EXISTS Given_So_Far (
    date TIMESTAMP NOT NULL,
    item_id INTEGER REFERENCES Items(item_id),
    value INTEGER NOT NULL CHECK(value >= 0)
)