import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')

  const supabase = await createClient()

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  if (token_hash) {
    await supabase.auth.verifyOtp({ token_hash, type: type as any })
  }

  // Recovery emails land here — send to the reset form
  if (type === 'recovery') {
    return NextResponse.redirect(new URL('/auth/reset-password', requestUrl.origin))
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin))
}