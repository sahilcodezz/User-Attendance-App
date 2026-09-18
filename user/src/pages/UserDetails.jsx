import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { API_BASE } from '../api'

const InfoRow = ({ label, value }) => (
  <div className="flex items-start gap-3">
    <span className="text-sm text-slate-500 w-20 flex-shrink-0 pt-0.5">{label}</span>
    <span className="text-sm font-medium text-slate-900 break-all">{value || '—'}</span>
  </div>
)

const UserDetails = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/${id}`)
        const data = await res.json()
        if (!data.success) throw new Error(data.message || 'User not found')
        setUser(data.user)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [id])

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??'

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">User not found</h3>
          <p className="text-slate-500 mb-6">{error}</p>
          <Link to="/users" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Users
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
          <Link
            to="/users"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium mb-6 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Users
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 pb-12">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Avatar + Name */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 px-8 pt-8 pb-6 border-b border-slate-100">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-indigo-500/30 flex-shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-slate-500 mt-1">{user.email}</p>
              {user.createdAt && (
                <p className="text-xs text-slate-400 mt-1">
                  Joined {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-8">
            {/* Contact Info */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900">Contact Info</h3>
              </div>
              <div className="space-y-3">
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Phone" value={user.phone} />
                <InfoRow label="Website" value={user.website} />
              </div>
            </div>

            {/* Address */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900">Address</h3>
              </div>
              <div className="space-y-3">
                <InfoRow label="Street" value={user.address?.street} />
                <InfoRow label="City" value={user.address?.city} />
                <InfoRow label="Zipcode" value={user.address?.zipcode} />
              </div>
            </div>

            {/* Company */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900">Company</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">Name</span>
                  <span className="text-sm font-semibold text-slate-900">{user.company?.name || '—'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">Catch Phrase</span>
                  <span className="text-sm font-semibold text-slate-900">{user.company?.catchPhrase || '—'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">Business</span>
                  <span className="text-sm font-semibold text-slate-900">{user.company?.bs || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetails
