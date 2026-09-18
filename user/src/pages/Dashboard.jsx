import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Users fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalUsers = users.length;
  const presentToday = Math.floor(totalUsers * 0.8);
  const absentToday = totalUsers - presentToday;

  const attendanceRate =
    totalUsers > 0
      ? Math.round((presentToday / totalUsers) * 100)
      : 0;

  const getGreeting = () => {
    const hour = currentTime.getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarColors = [
    "bg-indigo-100 text-indigo-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-slate-100 text-slate-700",
    "bg-violet-100 text-violet-700",
  ];

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      description: "Registered users",
      accent: "bg-slate-950",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      label: "Present Today",
      value: presentToday,
      description: "Checked in today",
      accent: "bg-emerald-500",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Absent Today",
      value: absentToday,
      description: "Not checked in",
      accent: "bg-rose-500",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Attendance Rate",
      value: `${attendanceRate}%`,
      description: "Overall attendance",
      accent: "bg-indigo-600",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M9 19V9a2 2 0 012-2h2a2 2 0 012 2v10M5 19v-6a2 2 0 012-2h2m8 8V5a2 2 0 012-2h1a2 2 0 012 2v14"
          />
        </svg>
      ),
    },
  ];

  const quickActions = [
    {
      title: "View Users",
      description: "Manage all users",
      path: "/users",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      iconBg: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Add User",
      description: "Create a new user",
      path: "/add-user",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M12 5v14m-7-7h14"
          />
        </svg>
      ),
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Go Home",
      description: "Return to homepage",
      path: "/",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M3 11.5L12 4l9 7.5M5 10v9a1 1 0 001 1h12a1 1 0 001-1v-9"
          />
        </svg>
      ),
      iconBg: "bg-amber-50 text-amber-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-76px)] w-full overflow-x-hidden bg-[#f8fafc]">

      {/* ================= HEADER ================= */}
      <section className="border-b border-slate-200 bg-white">
        <div className="px-5 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {getGreeting()}
                </p>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Monitor your users and attendance from one place.
              </p>
            </div>

            <div className="flex items-center gap-3">

              {/* Time */}
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm">
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <span className="text-sm font-semibold text-slate-700">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>

              {/* User */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-sm">
                U
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <main className="w-full px-5 py-6 sm:px-6 lg:px-8">

        {/* ================= STATS ================= */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {stat.description}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
                  {stat.icon}
                </div>
              </div>

              {/* Bottom accent */}
              <div
                className={`absolute bottom-0 left-0 h-[3px] w-full ${stat.accent}`}
              />
            </div>
          ))}

        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">

          {/* ================= RECENT USERS ================= */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)]">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Recent Users
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Latest registered users
                </p>
              </div>

              <Link
                to="/users"
                className="flex items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
              >
                View all

                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>

            </div>

            {/* Table heading */}
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(180px,0.8fr)_24px] border-b border-slate-100 bg-slate-50/70 px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">

              <span>User</span>
              <span>Company</span>
              <span />

            </div>

            {/* Users */}
            <div>
              {users.slice(0, 6).map((user, index) => (
                <Link
                  key={user.id}
                  to={`/users/${user.id}`}
                  className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(180px,0.8fr)_24px] items-center border-b border-slate-100 px-5 py-3 transition-colors last:border-b-0 hover:bg-slate-50"
                >

                  {/* User */}
                  <div className="flex min-w-0 items-center gap-3">

                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                        avatarColors[index % avatarColors.length]
                      }`}
                    >
                      {getInitials(user.name)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-slate-400">
                        {user.email}
                      </p>
                    </div>

                  </div>

                  {/* Company */}
                  <div className="hidden min-w-0 sm:block">

                    <p className="truncate text-sm font-medium text-slate-700">
                      {user.company?.name || "—"}
                    </p>

                    <p className="truncate text-xs text-slate-400">
                      {user.address?.city || "—"}
                    </p>

                  </div>

                  {/* Arrow */}
                  <svg
                    className="h-4 w-4 text-slate-300 transition-all group-hover:text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>

                </Link>
              ))}
            </div>

          </section>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="min-w-0 space-y-5">

            {/* QUICK ACTIONS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">

              <div className="mb-4">
                <h2 className="text-base font-bold text-slate-900">
                  Quick Actions
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Frequently used shortcuts
                </p>
              </div>

              <div className="space-y-2">

                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.path}
                    className="group flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
                  >

                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${action.iconBg}`}
                    >
                      {action.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {action.title}
                      </p>

                      <p className="truncate text-xs text-slate-400">
                        {action.description}
                      </p>
                    </div>

                    <svg
                      className="h-4 w-4 flex-shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>

                  </Link>
                ))}

              </div>
            </section>

            {/* ATTENDANCE */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">

              <div className="mb-4 flex items-start justify-between">

                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Attendance
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Today's attendance summary
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-950">
                    {attendanceRate}%
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Overall rate
                  </p>
                </div>

              </div>

              {/* Progress */}
              <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-700"
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>

              {/* Attendance stats */}
              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-slate-600">
                      Present
                    </span>
                  </div>

                  <p className="text-xl font-bold text-slate-950">
                    {presentToday}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    of {totalUsers} users
                  </p>
                </div>

                <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    <span className="text-xs font-medium text-slate-600">
                      Absent
                    </span>
                  </div>

                  <p className="text-xl font-bold text-slate-950">
                    {absentToday}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    of {totalUsers} users
                  </p>
                </div>

              </div>
            </section>

          </div>
        </div>

        {/* ================= BOTTOM SECTION ================= */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

          {/* Recent Activity */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">

            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-900">
                Recent Activity
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Latest system activity
              </p>
            </div>

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />

                <p className="min-w-0 flex-1 truncate text-sm text-slate-600">
                  User attendance updated
                </p>

                <span className="text-xs text-slate-400">
                  2m ago
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />

                <p className="min-w-0 flex-1 truncate text-sm text-slate-600">
                  New user registered
                </p>

                <span className="text-xs text-slate-400">
                  15m ago
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-amber-500" />

                <p className="min-w-0 flex-1 truncate text-sm text-slate-600">
                  Attendance report generated
                </p>

                <span className="text-xs text-slate-400">
                  1h ago
                </span>
              </div>

            </div>
          </section>

          {/* Dashboard Summary */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">

            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Dashboard Overview
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Current workspace summary
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                Updated now
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">
                  Users
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {totalUsers}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">
                  Present
                </p>

                <p className="mt-1 text-lg font-bold text-emerald-600">
                  {presentToday}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">
                  Absent
                </p>

                <p className="mt-1 text-lg font-bold text-rose-600">
                  {absentToday}
                </p>
              </div>

            </div>
          </section>

        </div>

        {/* Footer spacing */}
        <div className="h-6" />

      </main>
    </div>
  );
};

export default Dashboard;