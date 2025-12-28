import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { code } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 })
  }

  // Look up the access code in the table
  const { data: accessCode, error } = await supabase
    .from('access_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .single()

  if (error || !accessCode) {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
  }

  if (accessCode.used_by) {
    return NextResponse.json({ error: 'This code has already been used' }, { status: 400 })
  }

  // Sign in anonymously or create user – for now, we auto-login the current session (if any)
  // In production, we'd create a user or link to existing
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to redeem a code' }, { status: 401 })
  }

  // Mark code as used
  const { error: updateError } = await supabase
    .from('access_codes')
    .update({ used_by: user.id, used_at: new Date().toISOString() })
    .eq('id', accessCode.id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to redeem code' }, { status: 500 })
  }

  // Update profile with role and class from code
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      role: accessCode.role,
      class: accessCode.class || null,
    })
    .eq('id', user.id)

  if (profileError) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
