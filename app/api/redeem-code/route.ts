import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const { code } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 })
  }

  const upperCode = code.toUpperCase().trim()

  // Find the code
  const { data: accessCode, error: codeError } = await supabase
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

  // Get current user (if any)
  const { data: { user } } = await supabase.auth.getUser()

  let userId = user?.id

  // If no user, create a temporary one
  if (!userId) {
    const tempEmail = `temp-${upperCode.toLowerCase()}@kogbodi.edu.ng`
    const { data: newUser, error: createError } = await supabase.auth.signUp({
      email: tempEmail,
      password: 'temp-password-123',  // User can change later
      options: {
        data: { from_code: upperCode },
      },
    })

    if (createError || !newUser.user) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    userId = newUser.user.id

    // Auto sign in the new user
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: tempEmail,
      password: 'temp-password-123',
    })

    if (signInError) {
      return NextResponse.json({ error: 'Failed to sign in' }, { status: 500 })
    }
  }

  // Mark code as used
  const { error: updateError } = await supabase
    .from('access_codes')
    .update({ used_by: userId, used_at: new Date().toISOString() })
    .eq('id', accessCode.id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to redeem code' }, { status: 500 })
  }

  // Update profile with role and class
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      role: accessCode.role,
      class: accessCode.class,
      full_name: accessCode.role === 'teacher' ? 'Teacher' : 'Student',
    })

  if (profileError) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
      }
