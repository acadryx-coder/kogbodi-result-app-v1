'use client'

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        setProfile(profileData)
      }
      setLoading(false)
    }
    getData()
  }, [])

  if (loading) return <div className="text-center py-8">Loading...</div>

  if (!user) {
    window.location.href = '/'
    return null
  }

  const role = profile?.role || 'student'  // Fallback if no profile

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-2xl font-bold text-primary mb-2">Welcome, {user.email}!</h2>
        <p className="text-gray-600">Role: <span className="font-medium capitalize">{role}</span></p>
        <p className="text-sm text-gray-500 mt-4">To test different roles, go to Supabase → Table Editor → profiles → edit the role column for your user.</p>
      </div>

      {role === 'teacher' && (
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-xl font-semibold text-primary mb-4">Teacher Dashboard</h3>
          <p>Score entry page coming next!</p>
        </div>
      )}

      {role === 'admin' && (
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-xl font-semibold text-primary mb-4">Admin Dashboard</h3>
          <p>Pending results for review and publication.</p>
        </div>
      )}

      {role === 'student' && (
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-xl font-semibold text-primary mb-4">My Results</h3>
          <p>First Term 2025/2026 results will appear here when published.</p>
        </div>
      )}

      {role === 'parent' && (
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-xl font-semibold text-primary mb-4">Child's Results</h3>
          <p>View published results instantly.</p>
        </div>
      )}
    </div>
  )
    }
