'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [mode, setMode] = useState<'code' | 'login'>('code')
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Call server action to validate and redeem code (we'll add this next)
    const res = await fetch('/api/redeem-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.toUpperCase().trim() }),
    })

    const data = await res.json()
    if (data.error) {
      setMessage(data.error)
    } else {
      // Auto-login after redeem
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    else router.push('/dashboard')
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 to-accent/10">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-primary">Kogbodi International School</h2>
          <p className="text-gray-600">Access your results portal</p>
        </div>

        <div className="mb-6 flex justify-center gap-4">
          <button
            onClick={() => setMode('code')}
            className={`px-4 py-2 rounded ${mode === 'code' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Enter Access Code
          </button>
          <button
            onClick={() => setMode('login')}
            className={`px-4 py-2 rounded ${mode === 'login' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Login with Email
          </button>
        </div>

        {mode === 'code' && (
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Code (provided by school)
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-lg uppercase"
                placeholder="STD-KIS-JSS2-ARM1-X92A"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-3 text-white font-medium hover:bg-primary/90"
            >
              {loading ? 'Validating...' : 'Activate Account'}
            </button>
          </form>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-3 text-white font-medium hover:bg-primary/90"
            >
              Sign In
            </button>
          </form>
        )}

        {message && (
          <p className={`text-center mt-4 ${message.includes('Invalid') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          No access code? Contact your school administrator.
        </p>
      </div>
    </div>
  )
    }
