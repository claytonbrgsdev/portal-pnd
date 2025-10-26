import { NextResponse } from 'next/server'

// Static export compatibility for this simple test route
export const dynamic = 'force-static'
export const revalidate = false

export async function GET() {
  return NextResponse.json({
    message: 'Test API is working',
    timestamp: new Date().toISOString()
  })
}






