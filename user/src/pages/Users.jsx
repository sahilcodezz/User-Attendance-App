import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE } from '../api'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [total, setTotal] = useState(0)
  const [deleting, setDeleting] = useState(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (roleFilter !== 'all') params.append('role', roleFilter)
      params.append('limit', '50')

      const res = await fetch(`${API_BASE}/users?${params}`)
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setUsers(data.users)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [search, roleFilter])

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300)
    return () => clearTimeout(timer)
  }, [fetchUsers])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return
    setDeleting(id)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setUsers((prev) => prev.filter((u) => u._id !== id))
      setTotal((prev) => prev - 1)
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleting(null)
    }
  }

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??'

  const colors = [
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-emerald-500 to-teal-600',
    'from-indigo-500 to-blue-600',
    'from-purple-500 to-violet-600',
    'from-cyan-500 to-sky-600',
  ]

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">Management</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                All Users
              </h1>
              <p className="text-white/60 mt-2 text-sm">
                {total} user{total !== 1 ? 's' : ''} registered
              </p>
            </div>
            <Link
              to="/add-user"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add User
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all"
              placeholder="Search by name or email..."
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            {['all', 'admin', 'user'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-4 py-3 rounded-2xl text-sm font-semibold capitalize transition-all duration-200 ${
                  roleFilter === r
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-500 font-medium">Loading users...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16 bg-white rounded-3xl border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Failed to load users</h3>
            <p className="text-slate-500 mb-4">{error}</p>
            <button
              onClick={fetchUsers}
              className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && users.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No users found</h3>
            <p className="text-slate-500 mb-4">
              {search ? 'Try different search terms' : 'Add your first user to get started'}
            </p>
            <Link
              to="/add-user"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-colors"
            >
              Add First User
            </Link>
          </div>
        )}

        {/* Users Grid */}
        {!loading && !error && users.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {users.map((user, index) => (
              <div
                key={user._id}
                className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${colors[index % colors.length]} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                        {user.name}
                      </h3>
                      <span
                        className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-indigo-50 text-indigo-600'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{user.email}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {user.company?.name || user.address?.city || '—'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {user.address?.city || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/users/${user._id}`}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(user._id, user.name)}
                      disabled={deleting === user._id}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors disabled:opacity-50"
                    >
                      {deleting === user._id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Users
