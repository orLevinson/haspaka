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
--
CREATE OR REPLACE FUNCTION delete_command()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
    BEGIN
        UPDATE Users 
            SET command_id=NULL 
            WHERE command_id=OLD.command_id;
        DELETE FROM Units
            WHERE command_id=OLD.command_id;
        RETURN OLD;
    END
$$;
--
DROP TRIGGER IF EXISTS delete_command_trigger
ON public.commands;
--
CREATE TRIGGER delete_command_trigger
    BEFORE DELETE
    ON Commands
    FOR EACH ROW
    EXECUTE PROCEDURE delete_users_command();
--
CREATE OR REPLACE FUNCTION delete_unit()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
    BEGIN
        DELETE FROM Ideal_Inventory
            WHERE unit_id=OLD.unit_id;
        DELETE FROM Needed_Inventory
            WHERE unit_id=OLD.unit_id;
        DELETE FROM Future_Supplied
            WHERE unit_id=OLD.unit_id;
        RETURN OLD;
    END
$$;
--
DROP TRIGGER IF EXISTS delete_unit_trigger
ON public.units;
--
CREATE TRIGGER delete_unit_trigger
    BEFORE DELETE
    ON Units
    FOR EACH ROW
    EXECUTE PROCEDURE delete_unit();
--
CREATE OR REPLACE FUNCTION create_unit()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
    BEGIN
        INSERT INTO Ideal_Inventory(item_id, unit_id, value)
            SELECT DISTINCT i.item_id, NEW.unit_id, 0
            FROM Items AS i;
        INSERT INTO Needed_Inventory(item_id, unit_id, value)
            SELECT DISTINCT i.item_id, NEW.unit_id, 0
            FROM Items AS i;
        INSERT INTO Future_Supplied(item_id, unit_id, value)
            SELECT DISTINCT i.item_id, NEW.unit_id, 0
            FROM Items AS i;
        RETURN NEW;
    END
$$;
--
DROP TRIGGER IF EXISTS create_unit_trigger
ON public.units;
--
CREATE TRIGGER create_unit_trigger
    AFTER INSERT
    ON Units
    FOR EACH ROW
    EXECUTE PROCEDURE create_unit();
    --
CREATE OR REPLACE FUNCTION delete_item()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
    BEGIN
        DELETE FROM Ideal_Inventory
            WHERE item_id=OLD.item_id;
        DELETE FROM Needed_Inventory
            WHERE item_id=OLD.item_id;
        DELETE FROM Future_Supplied
            WHERE item_id=OLD.item_id;
        RETURN OLD;
    END
$$;
--
DROP TRIGGER IF EXISTS delete_item_trigger
ON public.items;
--
CREATE TRIGGER delete_item_trigger
    BEFORE DELETE
    ON Items
    FOR EACH ROW
    EXECUTE PROCEDURE delete_item();
--
CREATE OR REPLACE FUNCTION create_item()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
    BEGIN
        INSERT INTO Ideal_Inventory(item_id, unit_id, value)
            SELECT DISTINCT NEW.item_id, i.unit_id, 0
            FROM Units AS i;
               INSERT INTO Needed_Inventory(item_id, unit_id, value)
            SELECT DISTINCT NEW.item_id, i.unit_id, 0
            FROM Units AS i;
              INSERT INTO Future_Supplied(item_id, unit_id, value)
            SELECT DISTINCT NEW.item_id, i.unit_id, 0
            FROM Units AS i;
        RETURN NEW;
    END
$$;
--
DROP TRIGGER IF EXISTS create_item_trigger
ON public.items;
--
CREATE TRIGGER create_item_trigger
    AFTER INSERT
    ON Items
    FOR EACH ROW
    EXECUTE PROCEDURE create_item();
--
INSERT INTO Commands (command_name)
SELECT 'מנהלים'
WHERE NOT EXISTS (SELECT 1 FROM Commands);
--
INSERT INTO Users (username, password, name, command_id)
VALUES ('admin', '$2a$12$3R/RspqNJrmUEbXZU238Ru04Z7xOie5jelK3D1SuFxTLPLNzcQp8.', 'יוזר דיפולטיבי',
        (SELECT command_id FROM Commands WHERE command_name = 'מנהלים'));