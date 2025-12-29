'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setMessage('Welcome to the school family! 🎉')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1500)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/redeem-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim().toUpperCase() }),
    })

    const data = await res.json()

    if (data.success) {
      setMessage('Validating and signing you in...')
    } else {
      setMessage(data.error || 'Invalid code')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 to-accent/10">
      <div className="w-full max-w-md rounded-xl bg-white p-10 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary">Kogbodi International School</h1>
          <p className="text-lg text-gray-600 mt-2">Digital Campus</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-4">
              Enter Your Access Code
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none uppercase tracking-wider text-center"
              placeholder="TCH-MATH-JSS1-TEST1"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary text-white text-xl font-bold rounded-lg hover:bg-primary/90 disabled:opacity-60 transition"
          >
            {loading ? 'Validating...' : 'Continue'}
          </button>
        </form>

        {message && (
          <div className="mt-8 text-center p-5 rounded-lg text-lg font-medium bg-green-50 text-green-800">
            {message}
          </div>
        )}

        <p className="text-center text-sm text-gray-600 mt-10">
          Lost your code? Contact the ICT office or class teacher.
        </p>
      </div>
    </div>
  )
      }
