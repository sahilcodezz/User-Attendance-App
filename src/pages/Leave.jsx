import { useState, useEffect, useCallback } from "react"
import { API_BASE } from "../api"

const statusConfig = {
  Pending:  { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-400",   icon: "⏳" },
  Approved: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500",  icon: "✅" },
  Rejected: { bg: "bg-rose-100",    text: "text-rose-700",    dot: "bg-rose-500",     icon: "❌" },
}

const leaveTypes = ["Sick Leave", "Casual Leave", "Annual Leave", "Emergency Leave", "Other"]

const DEMO_USER = { _id: "demo_user_001", name: "Demo User", email: "demo@userhub.com" }

const Leave = () => {
  const [tab, setTab] = useState("apply") // "apply" | "history"
  const [users, setUsers] = useState([])
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState("All")
  const [deletingId, setDeletingId] = useState(null)

  const [form, setForm] = useState({
    userId: "",
    leaveType: "Sick Leave",
    fromDate: "",
    toDate: "",
    reason: "",
  })

  // Fetch users for selector
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/users?limit=100`)
        const data = await res.json()
        if (data.success) setUsers(data.users)
      } catch {
        // ignore — show demo option
      }
    }
    fetchUsers()
  }, [])

  const fetchLeaves = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "All") params.append("status", statusFilter)
      params.append("limit", "30")
      const res = await fetch(`${API_BASE}/leaves?${params}`)
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setLeaves(data.leaves)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    if (tab === "history") fetchLeaves()
  }, [tab, fetchLeaves])

  const calcDays = (from, to) => {
    if (!from || !to) return 0
    const diff = new Date(to) - new Date(from)
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1)
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.userId) { setError("Please select a user"); return }
    if (!form.fromDate || !form.toDate) { setError("Please select both dates"); return }
    if (new Date(form.toDate) < new Date(form.fromDate)) {
      setError("End date cannot be before start date"); return
    }

    const selectedUser = users.find((u) => u._id === form.userId) || DEMO_USER
    const payload = {
      userId:    selectedUser._id,
      userName:  selectedUser.name,
      userEmail: selectedUser.email,
      leaveType: form.leaveType,
      fromDate:  form.fromDate,
      toDate:    form.toDate,
      totalDays: calcDays(form.fromDate, form.toDate),
      reason:    form.reason,
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/leaves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this leave request?")) return
    setDeletingId(id)
    try {
      const res = await fetch(`${API_BASE}/leaves/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setLeaves((prev) => prev.filter((l) => l._id !== id))
      setTotal((prev) => prev - 1)
    } catch (err) {
      alert(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const resetForm = () => {
    setForm({ userId: "", leaveType: "Sick Leave", fromDate: "", toDate: "", reason: "" })
    setSubmitted(false)
    setError("")
  }

  const totalDays = calcDays(form.fromDate, form.toDate)

  const leaveTypeColors = {
    "Sick Leave":      "from-rose-500 to-pink-600",
    "Casual Leave":    "from-amber-500 to-orange-600",
    "Annual Leave":    "from-emerald-500 to-teal-600",
    "Emergency Leave": "from-red-600 to-rose-700",
    "Other":           "from-slate-500 to-slate-600",
  }

  const pendingCount  = leaves.filter((l) => l.status === "Pending").length
  const approvedCount = leaves.filter((l) => l.status === "Approved").length
  const rejectedCount = leaves.filter((l) => l.status === "Rejected").length

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <p className="text-white/70 text-sm font-medium mb-1">Team Management</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Leave Management</h1>
          <p className="text-white/60 mt-2 text-sm">Apply for leave and track all requests</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm mb-8 w-fit">
          {[
            { key: "apply",   label: "Apply Leave",  icon: "📝" },
            { key: "history", label: "Leave History", icon: "📋" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSubmitted(false) }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === t.key
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── APPLY LEAVE TAB ── */}
        {tab === "apply" && (
          <>
            {submitted ? (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 text-center max-w-lg mx-auto">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
                  ✅
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Leave Applied!</h2>
                <p className="text-slate-500 mb-8">Your leave request has been submitted successfully and is pending approval.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    Apply Another
                  </button>
                  <button
                    onClick={() => { setTab("history"); setSubmitted(false) }}
                    className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-2xl hover:bg-slate-200 transition-colors"
                  >
                    View History
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-2">
                  <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-6">
                    {error && (
                      <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-sm font-medium">{error}</p>
                      </div>
                    )}

                    {/* Employee Select */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Employee *</label>
                      <div className="relative">
                        <select
                          name="userId"
                          value={form.userId}
                          onChange={handleChange}
                          required
                          className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                        >
                          <option value="">Select employee...</option>
                          {users.map((u) => (
                            <option key={u._id} value={u._id}>
                              {u.name} — {u.email}
                            </option>
                          ))}
                          {users.length === 0 && (
                            <option value={DEMO_USER._id}>{DEMO_USER.name} (Demo)</option>
                          )}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Leave Type */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Leave Type *</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {leaveTypes.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, leaveType: type }))}
                            className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 text-left ${
                              form.leaveType === type
                                ? `bg-gradient-to-r ${leaveTypeColors[type]} text-white shadow-md`
                                : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">From Date *</label>
                        <input
                          type="date"
                          name="fromDate"
                          value={form.fromDate}
                          onChange={handleChange}
                          required
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">To Date *</label>
                        <input
                          type="date"
                          name="toDate"
                          value={form.toDate}
                          onChange={handleChange}
                          required
                          min={form.fromDate || new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Reason */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Reason *</label>
                      <textarea
                        name="reason"
                        value={form.reason}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Briefly describe the reason for your leave..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Submit Leave Request
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Summary Sidebar */}
                <div className="space-y-4">
                  {/* Duration Preview */}
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Leave Summary</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Type</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${leaveTypeColors[form.leaveType]}`}>
                          {form.leaveType}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">From</span>
                        <span className="text-sm font-semibold text-slate-900">{form.fromDate || "—"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">To</span>
                        <span className="text-sm font-semibold text-slate-900">{form.toDate || "—"}</span>
                      </div>
                      <div className="pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-700">Total Days</span>
                          <span className="text-2xl font-extrabold text-indigo-600">
                            {form.fromDate && form.toDate ? totalDays : "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leave Type Guide */}
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Leave Types</h3>
                    <div className="space-y-2.5">
                      {leaveTypes.map((type) => (
                        <div key={type} className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${leaveTypeColors[type]} flex-shrink-0`} />
                          <span className="text-xs text-slate-600 font-medium">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === "history" && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Pending",  value: pendingCount,  icon: "⏳", bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
                { label: "Approved", value: approvedCount, icon: "✅", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
                { label: "Rejected", value: rejectedCount, icon: "❌", bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200" },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center`}>
                  <p className="text-2xl mb-1">{s.icon}</p>
                  <p className={`text-2xl font-extrabold ${s.text}`}>{s.value}</p>
                  <p className={`text-xs font-semibold ${s.text} mt-0.5`}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {["All", "Pending", "Approved", "Rejected"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    statusFilter === s
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {s !== "All" && <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${statusConfig[s]?.dot}`} />}
                  {s}
                </button>
              ))}
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-slate-500">Loading leaves...</p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="text-center py-12 bg-white rounded-3xl border border-red-100">
                <p className="text-3xl mb-2">⚠️</p>
                <p className="text-slate-700 font-semibold mb-3">{error}</p>
                <button onClick={fetchLeaves} className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-colors">
                  Retry
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && leaves.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
                <p className="text-4xl mb-3">🌴</p>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">No leave requests found</h3>
                <p className="text-slate-500 mb-4">Apply for a leave to get started</p>
                <button
                  onClick={() => setTab("apply")}
                  className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-colors"
                >
                  Apply Leave
                </button>
              </div>
            )}

            {/* Leave Cards */}
            {!loading && !error && leaves.length > 0 && (
              <div className="space-y-4">
                {leaves.map((leave) => {
                  const cfg = statusConfig[leave.status] || statusConfig["Pending"]
                  return (
                    <div
                      key={leave._id}
                      className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* Left */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className={`w-12 h-12 bg-gradient-to-br ${leaveTypeColors[leave.leaveType] || "from-slate-400 to-slate-600"} rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}>
                            {leave.userName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??"}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="text-base font-bold text-slate-900">{leave.userName}</h3>
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${leaveTypeColors[leave.leaveType] || ""} text-white`}>
                                {leave.leaveType}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 truncate">{leave.userEmail}</p>
                            <p className="text-sm text-slate-700 mt-1.5 line-clamp-2">{leave.reason}</p>
                          </div>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col items-end gap-3 flex-shrink-0">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {leave.status}
                          </span>
                          <div className="text-right">
                            <p className="text-xs text-slate-500 font-medium">
                              {leave.fromDate} → {leave.toDate}
                            </p>
                            <p className="text-xs font-bold text-indigo-600 mt-0.5">
                              {leave.totalDays} day{leave.totalDays !== 1 ? "s" : ""}
                            </p>
                          </div>
                          {leave.status === "Pending" && (
                            <button
                              onClick={() => handleDelete(leave._id)}
                              disabled={deletingId === leave._id}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors disabled:opacity-50"
                            >
                              {deletingId === leave._id ? "..." : "Cancel"}
                            </button>
                          )}
                        </div>
                      </div>

                      {leave.reviewNote && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <p className="text-xs text-slate-500 font-medium mb-1">Review Note</p>
                          <p className="text-sm text-slate-700">{leave.reviewNote}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Leave
