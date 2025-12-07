-- Initialize PostgreSQL database for KollabSpace
-- This script runs automatically when the container is first created

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schema if needed (optional)
-- CREATE SCHEMA IF NOT EXISTS kollabspace;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE kollabspace TO kollabspace_user;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'KollabSpace database initialized successfully!';
END $$;