import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Password recovery links should land on the reset form, not the dashboard
  if (type === 'recovery') {
    return NextResponse.redirect(new URL('/auth/reset-password', requestUrl.origin))
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin))
}