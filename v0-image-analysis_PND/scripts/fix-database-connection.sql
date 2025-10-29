-- Test basic connection and get database info
SELECT 
    current_user as "Current User",
    current_database() as "Current Database", 
    version() as "PostgreSQL Version",
    now() as "Current Timestamp";

-- Check if we can create a simple table
CREATE TABLE IF NOT EXISTS connection_test (
    id SERIAL PRIMARY KEY,
    test_message TEXT DEFAULT 'Connection successful',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a test record
INSERT INTO connection_test (test_message) VALUES ('Database connection working properly');

-- Verify the test
SELECT * FROM connection_test ORDER BY created_at DESC LIMIT 1;

-- Clean up test table
DROP TABLE IF EXISTS connection_test;
