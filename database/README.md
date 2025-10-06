# Database Setup Guide

This directory contains scripts and instructions for setting up test tables in your Supabase database.

## Initial Setup

1. **Access your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Open the SQL Editor**
   - In the left sidebar, click on "SQL Editor"
   - Create a new query

3. **Run the initialization script**
   - Copy the contents of `init-test-tables.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

## What the script creates:

### Tables Created:
- **`test_users`** - Sample users table
- **`test_posts`** - Sample posts table with foreign key to users
- **`test_categories`** - Sample categories table

### Sample Data:
- 4 test users with realistic names and emails
- 4 test categories (Matemática, Português, História, Geografia)
- 4 test posts linking to users and categories

## Testing the Connection

After running the script:

1. **Visit the test page**: Go to `/test-db` in your application
2. **Check the results**: You should see:
   - ✅ Connected status
   - 3 tables in the database
   - Record counts for each table
   - Database version and user information

## Troubleshooting

### If you see 0 tables:
1. Make sure you've run the `init-test-tables.sql` script
2. Check that your Supabase connection string is correct in `.env.local`
3. Verify your database password is correct

### If you see connection errors:
1. Check your `DATABASE_URL` in `.env.local`
2. Ensure your Supabase project is active
3. Verify network connectivity to Supabase

## Next Steps

Once the test tables are working, you can:
- Implement user authentication
- Create real application tables
- Set up Row Level Security (RLS) policies
- Build your application features

The transaction pooler is optimized for serverless applications and provides excellent performance for your Next.js app!





