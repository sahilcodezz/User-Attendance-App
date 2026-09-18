import React, { useState, useEffect, useCallback } from "react"
import { API_BASE } from "../api"

const statusConfig = {
  Present: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  Absent:  { bg: "bg-rose-100",    text: "text-rose-700",    dot: "bg-rose-500"    },
  Late:    { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500"   },
  "Half Day": { bg: "bg-blue-100", text: "text-blue-700",    dot: "bg-blue-500"    },
}

const AttendanceHistory = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [search, setSearch] = useState("")

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams({ page, limit: 15 })
      if (fromDate) params.append("fromDate", fromDate)
      if (toDate) params.append("toDate", toDate)

      const res = await fetch(`${API_BASE}/attendance/history?${params}`)
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setRecords(data.records)
      setTotal(data.total)
      setPages(data.pages || 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [fromDate, toDate, page])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const clearFilters = () => {
    setFromDate("")
    setToDate("")
    setStatusFilter("All")
    setSearch("")
    setPage(1)
  }

  // Client-side filter for status + search
  const filteredRecords = records.filter((r) => {
    const matchStatus = statusFilter === "All" || r.status === statusFilter
    const matchSearch =
      !search ||
      r.userName?.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const statuses = ["All", "Present", "Absent", "Late", "Half Day"]

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <p className="text-white/70 text-sm font-medium mb-1">Records</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Attendance History
          </h1>
          <p className="text-white/60 mt-2 text-sm">
            {total} record{total !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
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
                placeholder="Search by name or email..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => { setFromDate(e.target.value); setPage(1) }}
                  className="pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <span className="text-slate-400 text-sm font-medium">to</span>
              <div className="relative">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => { setToDate(e.target.value); setPage(1) }}
                  className="pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Clear */}
            {(fromDate || toDate || statusFilter !== "All" || search) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-4 py-3 bg-slate-100 text-slate-600 font-semibold rounded-2xl hover:bg-slate-200 transition-colors text-sm whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  statusFilter === s
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s !== "All" && (
                  <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${statusConfig[s]?.dot}`} />
                )}
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-500 font-medium">Loading records...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16 bg-white rounded-3xl border border-red-100">
            <p className="text-3xl mb-3">⚠️</p>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Failed to load records</h3>
            <p className="text-slate-500 mb-4">{error}</p>
            <button onClick={fetchHistory} className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredRecords.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
            <p className="text-4xl mb-3">📋</p>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No records found</h3>
            <p className="text-slate-500">
              {fromDate || toDate || statusFilter !== "All" || search
                ? "Try adjusting your filters"
                : "Save attendance first to see history here"}
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && filteredRecords.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Check In</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Check Out</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredRecords.map((record, index) => {
                    const cfg = statusConfig[record.status] || statusConfig["Absent"]
                    const initials = record.userName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??"
                    const colorIdx = index % 6
                    const avatarColors = [
                      "from-rose-500 to-pink-600", "from-amber-500 to-orange-600",
                      "from-emerald-500 to-teal-600", "from-indigo-500 to-blue-600",
                      "from-purple-500 to-violet-600", "from-cyan-500 to-sky-600",
                    ]
                    return (
                      <tr key={record._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 bg-gradient-to-br ${avatarColors[colorIdx]} rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0`}>
                              {initials}
                            </div>
                            <span className="text-sm font-semibold text-slate-900">{record.userName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{record.userEmail}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-700">
                            {new Date(record.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">{record.checkIn || "—"}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">{record.checkOut || "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredRecords.map((record) => {
                const cfg = statusConfig[record.status] || statusConfig["Absent"]
                return (
                  <div key={record._id} className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{record.userName}</h4>
                        <p className="text-xs text-slate-500">{record.userEmail}</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                        {record.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                      <span>📅 {record.date}</span>
                      <span>🕐 {record.checkIn || "—"}</span>
                      <span>🕕 {record.checkOut || "—"}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Page {page} of {pages} — {total} total records
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AttendanceHistory
