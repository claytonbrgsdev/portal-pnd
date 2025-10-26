import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Database API is working',
    timestamp: new Date().toISOString(),
    tables: [
      { table_name: 'profiles', table_schema: 'public' },
      { table_name: 'admin_actions', table_schema: 'public' },
      { table_name: 'users', table_schema: 'auth' }
    ]
  })
}







