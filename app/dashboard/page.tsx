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
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('role, full_name, class')
          .eq('id', user.id)
          .single()

        if (error) console.error(error)
        setProfile(profileData)
      }
      setLoading(false)
    }
    getData()
  }, [])

  if (loading) return <div className="text-center py-8 text-primary">Loading...</div>

  if (!user) {
    window.location.href = '/'
    return null
  }

  const role = profile?.role || 'student'
  const fullName = profile?.full_name || user.email

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-accent/20">
        <h2 className="text-3xl font-bold text-primary mb-3">Welcome back, {fullName}!</h2>
        <p className="text-lg text-gray-700">
          Role: <span className="font-semibold capitalize text-primary">{role}</span>
        </p>
        <p className="text-sm text-gray-500 mt-4">
          To test roles: Go to Supabase → Table Editor → profiles → edit the 'role' column for your user.
        </p>
      </div>

      {role === 'teacher' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-primary mb-6">Your Assigned Classes</h3>
          <p className="text-gray-600">Score entry interface coming in the next update!</p>
        </div>
      )}

      {role === 'admin' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-primary mb-6">Admin Control Panel</h3>
          <p className="text-gray-600">Review, override, and publish results across all classes.</p>
        </div>
      )}

      {role === 'student' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-primary mb-6">My Academic Results</h3>
          <p className="text-gray-600">View your published results instantly when ready.</p>
        </div>
      )}

      {role === 'parent' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-primary mb-6">Child's Academic Results</h3>
          <p className="text-gray-600">Real-time access to published reports.</p>
        </div>
      )}
    </div>
  )
        }
