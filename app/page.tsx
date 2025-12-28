'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // This will call our future /api/redeem-code endpoint
    const res = await fetch('/api/redeem-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim().toUpperCase() }),
    })

    const data = await res.json()

    if (data.success) {
      setMessage('Welcome! Redirecting to your dashboard...')
      setTimeout(() => router.push('/dashboard'), 1500)
    } else {
      setMessage(data.error || 'Invalid or expired code')
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 to-accent/10">
      <div className="w-full max-w-md rounded-xl bg-white p-10 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary">Kogbodi International School</h1>
          <p className="text-lg text-gray-600 mt-2">Digital Results Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Enter Your Access Code
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none uppercase tracking-wider"
              placeholder="e.g. TCH-MATH-JSS1-X92A"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-3">
              Your code was provided by the school administration
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-60 transition"
          >
            {loading ? 'Validating Code...' : 'Activate & Continue'}
          </button>
        </form>

        {message && (
          <div className={`mt-6 text-center p-4 rounded-lg ${message.includes('Welcome') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}

        <p className="text-center text-sm text-gray-600 mt-8">
          Lost your code? Contact the school ICT office.
        </p>
      </div>
    </div>
  )
                            }
