import { useState, useEffect } from "react"
import { API_BASE } from "../api"

const Attendance = () => {
  const [users, setUsers] = useState([])
  const [attendance, setAttendance] = useState({}) // { userId: status }
  const [filter, setFilter] = useState("All")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const today = new Date().toISOString().split("T")[0]
  const todayDisplay = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  })

  // Fetch users from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [usersRes, attRes] = await Promise.all([
          fetch(`${API_BASE}/users?limit=100`),
          fetch(`${API_BASE}/attendance?date=${today}`),
        ])
        const usersData = await usersRes.json()
        const attData = await attRes.json()

        if (!usersData.success) throw new Error(usersData.message)

        setUsers(usersData.users)

        // Build attendance map from existing records
        const attMap = {}
        if (attData.success && attData.records) {
          attData.records.forEach((r) => {
            attMap[r.userId] = r.status
          })
        }
        setAttendance(attMap)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [today])

  const markAttendance = (userId, status) => {
    setAttendance((prev) => ({ ...prev, [userId]: status }))
    setSaved(false)
  }

  const markAll = (status) => {
    const newAtt = {}
    users.forEach((u) => { newAtt[u._id] = status })
    setAttendance(newAtt)
    setSaved(false)
  }

  const resetAll = () => {
    setAttendance({})
    setSaved(false)
  }

  const saveAttendance = async () => {
    const records = users.map((u) => ({
      userId: u._id,
      userName: u.name,
      userEmail: u.email,
      status: attendance[u._id] || "Absent",
    }))

    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/attendance/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, records }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setSaved(true)
    } catch (err) {
      alert("Failed to save: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  const getStatus = (userId) => attendance[userId] || "Not Marked"

  const presentCount = users.filter((u) => getStatus(u._id) === "Present").length
  const absentCount = users.filter((u) => getStatus(u._id) === "Absent").length
  const notMarkedCount = users.filter((u) => getStatus(u._id) === "Not Marked").length
  const attendanceRate = users.length > 0 ? Math.round((presentCount / users.length) * 100) : 0

  const filteredUsers = users.filter((u) =>
    filter === "All" ? true : getStatus(u._id) === filter
  )

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??"

  const colors = [
    "from-rose-500 to-pink-600", "from-amber-500 to-orange-600",
    "from-emerald-500 to-teal-600", "from-indigo-500 to-blue-600",
    "from-purple-500 to-violet-600", "from-cyan-500 to-sky-600",
  ]

  const stats = [
    { label: "Total", value: users.length, color: "from-indigo-500 to-purple-600", icon: "👥" },
    { label: "Present", value: presentCount, color: "from-emerald-500 to-teal-600", icon: "✅" },
    { label: "Absent", value: absentCount, color: "from-rose-500 to-pink-600", icon: "❌" },
    { label: "Rate", value: `${attendanceRate}%`, color: "from-amber-500 to-orange-600", icon: "📊" },
  ]

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading attendance...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">{todayDisplay}</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Attendance</h1>
              <p className="text-white/60 mt-2 text-sm">Mark and save daily attendance for your team</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => markAll("Present")}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 text-white font-semibold rounded-2xl hover:bg-emerald-500/30 transition-all text-sm"
              >
                ✅ Mark All Present
              </button>
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm font-medium">
            ⚠️ {error} — Showing empty state.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-xl mb-3 shadow-md`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Today's Progress</h3>
            <span className="text-sm font-bold text-indigo-600">{attendanceRate}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              <span className="text-xs text-slate-500">Present ({presentCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
              <span className="text-xs text-slate-500">Absent ({absentCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-slate-300 rounded-full" />
              <span className="text-xs text-slate-500">Not Marked ({notMarkedCount})</span>
            </div>
          </div>
        </div>

        {/* Filter + Save */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["All", "Present", "Absent", "Not Marked"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  filter === f
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {f}
                {f === "Present" && ` (${presentCount})`}
                {f === "Absent" && ` (${absentCount})`}
                {f === "Not Marked" && ` (${notMarkedCount})`}
              </button>
            ))}
          </div>

          {/* Save Button */}
          <button
            onClick={saveAttendance}
            disabled={saving || users.length === 0}
            className={`inline-flex items-center gap-2 px-6 py-2.5 font-bold text-sm rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              saved
                ? "bg-emerald-500 text-white shadow-emerald-500/30"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5"
            }`}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>✅ Saved!</>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Attendance
              </>
            )}
          </button>
        </div>

        {/* User Cards */}
        {users.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
            <p className="text-2xl mb-3">👥</p>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No users found</h3>
            <p className="text-slate-500">Add users first to mark attendance</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
            <p className="text-2xl mb-3">🔍</p>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No users in this filter</h3>
            <p className="text-slate-500">Switch to "All" to see everyone</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredUsers.map((user, index) => {
              const status = getStatus(user._id)
              return (
                <div
                  key={user._id}
                  className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${colors[index % colors.length]} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-slate-900 truncate">{user.name}</h3>
                      <p className="text-sm text-slate-500 truncate">{user.email}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                        status === "Present"
                          ? "bg-emerald-100 text-emerald-700"
                          : status === "Absent"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {["Present", "Absent"].map((s) => (
                      <button
                        key={s}
                        onClick={() => markAttendance(user._id, s)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                          status === s
                            ? s === "Present"
                              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                              : "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                            : s === "Present"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
                        }`}
                      >
                        {s === "Present" ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Attendance
