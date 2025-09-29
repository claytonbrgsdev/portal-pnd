import { NextResponse } from 'next/server'

// Get all tables from the database
export async function GET() {
  try {
    // Return a comprehensive list of tables in your database
    // Add your custom tables here as you create them
    const tables = [
      { table_name: 'profiles', table_schema: 'public' },
      { table_name: 'admin_actions', table_schema: 'public' },
      { table_name: 'users', table_schema: 'auth' },
      { table_name: 'buckets', table_schema: 'storage' },
      { table_name: 'objects', table_schema: 'storage' },
      // Add your custom tables here:
      // { table_name: 'your_table_name', table_schema: 'public' },
      // { table_name: 'another_table', table_schema: 'public' },
    ]

    return NextResponse.json({
      success: true,
      tables: tables,
      count: tables.length
    })

  } catch (error) {
    console.error('Error in database tables API:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
