import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()
    
    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Code is required' },
        { status: 400 }
      )
    }

    // For now, just accept ANY code to get things working
    // We'll add Supabase later
    
    return NextResponse.json({
      success: true,
      redirect: '/dashboard',
      message: 'Welcome! Code accepted'
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
