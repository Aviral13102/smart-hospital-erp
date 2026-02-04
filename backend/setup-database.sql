-- Smart Hospital ERP - Database Setup Script
-- Run this in psql as postgres superuser

-- Create the user
CREATE USER admin WITH PASSWORD 'password';

-- Create the database
CREATE DATABASE hospital_erp OWNER admin;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE hospital_erp TO admin;

-- Connect to the database and grant schema privileges
\c hospital_erp
GRANT ALL ON SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;

-- Done!
\echo 'Database setup complete!'
