import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const { code } = await request.json()

  // Use service_role to bypass RLS for code lookup
  const supabaseAdmin = createRouteHandlerClient({ cookies }, {
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  })

  const supabase = createRouteHandlerClient({ cookies })

  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 })
  }

  const upperCode = code.toUpperCase().trim()

  const { data: accessCode, error: codeError } = await supabaseAdmin
    .from('access_codes')
    .select('*')
    .eq('code', upperCode)
    .single()

  if (codeError || !accessCode) {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
  }

  if (accessCode.used_by) {
    return NextResponse.json({ error: 'This code has already been used' }, { status: 400 })
  }

  // Get current user or create temp one
  const { data: { user } } = await supabase.auth.getUser()

  let userId = user?.id

  if (!userId) {
    const tempEmail = `temp-${upperCode.toLowerCase()}@kogbodi.edu.ng`
    const { data: newUser, error: signUpError } = await supabase.auth.signUp({
      email: tempEmail,
      password: 'temp-password-123',
    })

    if (signUpError || !newUser.user) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    userId = newUser.user.id

    await supabase.auth.signInWithPassword({
      email: tempEmail,
      password: 'temp-password-123',
    })
  }

  // Mark code used
  await supabaseAdmin
    .from('access_codes')
    .update({ used_by: userId, used_at: new Date().toISOString() })
    .eq('id', accessCode.id)

  // Bind role/class
  await supabase
    .from('profiles')
    .upsert({
      id: userId,
      role: accessCode.role,
      class: accessCode.class,
    })

  return NextResponse.json({ success: true })
    }
