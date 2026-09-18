import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const AddUser = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "User",
    website: "",
    company: "",
    city: "",
    street: "",
  });

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    setSaved(false);
  };

  const getInitials = (name) => {
    if (!name.trim()) return "U";

    return name
      .trim()
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Minimum 8 characters required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      /*
        Replace this section with your actual backend API.

        Example:

        const response = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          throw new Error("Failed to create user");
        }
      */

      await new Promise((resolve) => setTimeout(resolve, 800));

      alert("User created successfully!");

      setForm({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "User",
        website: "",
        company: "",
        city: "",
        street: "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("userDraft", JSON.stringify(form));
    setSaved(true);
  };

  const completion = useMemo(() => {
    const fields = [
      form.fullName,
      form.email,
      form.password,
      form.phone,
      form.role,
      form.company,
      form.city,
      form.street,
    ];

    const completed = fields.filter(Boolean).length;

    return Math.round((completed / fields.length) * 100);
  }, [form]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8fafc] text-slate-900">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-6 sm:px-7 lg:px-10">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-2 text-sm">
            <Link
              to="/users"
              className="text-slate-400 transition hover:text-indigo-600"
            >
              Users
            </Link>

            <svg
              className="h-4 w-4 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m9 5 7 7-7 7"
              />
            </svg>

            <span className="font-medium text-slate-700">
              Add New User
            </span>
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM3 20a6 6 0 0 1 12 0v1H3v-1Z"
                    />
                  </svg>
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    Add New User
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Create a user profile and configure their access.
                  </p>
                </div>
              </div>
            </div>

            {/* Autosave */}
            <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-700 md:self-auto">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {saved ? "Draft saved" : "Changes saved automatically"}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="mx-auto max-w-[1500px] px-5 py-7 sm:px-7 lg:px-10">
        <form onSubmit={handleCreateUser}>
          <div className="grid grid-cols-1 gap-7 xl:grid-cols-[minmax(0,1fr)_380px]">
            {/* =================================================
                LEFT FORM
            ================================================== */}
            <div className="space-y-6">
              {/* User Information */}
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <svg
                        className="h-4.5 w-4.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M15 19a4 4 0 0 0-8 0m4-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h4m-2-2v4"
                        />
                      </svg>
                    </div>

                    <div>
                      <h2 className="text-base font-semibold text-slate-900">
                        User information
                      </h2>

                      <p className="mt-0.5 text-sm text-slate-500">
                        Basic details, credentials and account role.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="px-6 py-6">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      1
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Basic information
                      </h3>
                      <p className="text-xs text-slate-500">
                        Name, email, password and phone number.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                    {/* Full Name */}
                    <InputField
                      label="Full Name"
                      required
                      value={form.fullName}
                      error={errors.fullName}
                      placeholder="Sahil Pandey"
                      icon={
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.7"
                            d="M15 19a4 4 0 0 0-8 0m4-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                          />
                        </svg>
                      }
                      onChange={(e) =>
                        updateField("fullName", e.target.value)
                      }
                    />

                    {/* Email */}
                    <InputField
                      label="Email"
                      required
                      type="email"
                      value={form.email}
                      error={errors.email}
                      placeholder="sahil@example.com"
                      icon={
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeWidth="1.7"
                            d="M3 7.5 12 13l9-5.5M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"
                          />
                        </svg>
                      }
                      onChange={(e) => updateField("email", e.target.value)}
                    />

                    {/* Password */}
                    <InputField
                      label="Password"
                      required
                      type="password"
                      value={form.password}
                      error={errors.password}
                      placeholder="••••••••"
                      icon={
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeWidth="1.7"
                            d="M7 10V7a5 5 0 0 1 10 0v3m-9 0h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
                          />
                        </svg>
                      }
                      helper="Use at least 8 characters with letters and numbers."
                      onChange={(e) =>
                        updateField("password", e.target.value)
                      }
                    />

                    {/* Phone */}
                    <InputField
                      label="Phone"
                      type="tel"
                      value={form.phone}
                      placeholder="+91 9876543210"
                      icon={
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeWidth="1.7"
                            d="M6.5 3.5 9 3l2 5-2 1.5a12 12 0 0 0 5 5L15.5 13l5 2 .5 2.5a2 2 0 0 1-2 2C10.7 19.5 4.5 13.3 4.5 5a2 2 0 0 1 2-1.5Z"
                          />
                        </svg>
                      }
                      onChange={(e) => updateField("phone", e.target.value)}
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="border-t border-slate-100 px-6 py-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      2
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Role & access
                      </h3>

                      <p className="text-xs text-slate-500">
                        Choose what this user can access and manage.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* User Role */}
                    <RoleCard
                      selected={form.role === "User"}
                      title="User"
                      description="Can view their profile and submit leave requests."
                      icon={
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeWidth="1.7"
                            d="M15 19a4 4 0 0 0-8 0m4-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                          />
                        </svg>
                      }
                      onClick={() => updateField("role", "User")}
                    />

                    {/* Admin Role */}
                    <RoleCard
                      selected={form.role === "Admin"}
                      title="Admin"
                      description="Full access to users, attendance and leave approvals."
                      icon={
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeWidth="1.7"
                            d="M12 3 5 6v5c0 4.7 2.9 8.1 7 10 4.1-1.9 7-5.3 7-10V6l-7-3Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeWidth="1.7"
                            d="m9.5 12 1.7 1.7 3.4-3.4"
                          />
                        </svg>
                      }
                      onClick={() => updateField("role", "Admin")}
                    />
                  </div>
                </div>

                {/* Work Location */}
                <div className="border-t border-slate-100 px-6 py-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      3
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Work & location
                      </h3>

                      <p className="text-xs text-slate-500">
                        Company details and location information.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                    <InputField
                      label="Website"
                      value={form.website}
                      placeholder="www.example.com"
                      icon={
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            strokeWidth="1.7"
                          />
                          <path
                            strokeLinecap="round"
                            strokeWidth="1.7"
                            d="M3 12h18M12 3c2.5 2.7 3.5 6 3.5 9s-1 6.3-3.5 9c-2.5-2.7-3.5-6-3.5-9s1-6.3 3.5-9Z"
                          />
                        </svg>
                      }
                      onChange={(e) =>
                        updateField("website", e.target.value)
                      }
                    />

                    <InputField
                      label="Company"
                      value={form.company}
                      placeholder="Acme Inc."
                      icon={
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeWidth="1.7"
                            d="M4 21V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v15M15 9h3a2 2 0 0 1 2 2v10M2 21h20"
                          />
                        </svg>
                      }
                      onChange={(e) =>
                        updateField("company", e.target.value)
                      }
                    />

                    <InputField
                      label="City"
                      value={form.city}
                      placeholder="Mumbai"
                      icon={
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeWidth="1.7"
                            d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"
                          />
                          <circle cx="12" cy="9" r="2.2" strokeWidth="1.7" />
                        </svg>
                      }
                      onChange={(e) => updateField("city", e.target.value)}
                    />

                    <InputField
                      label="Street"
                      value={form.street}
                      placeholder="123 Main Street"
                      icon={
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeWidth="1.7"
                            d="M4 20V9l8-5 8 5v11M8 20v-5h8v5"
                          />
                        </svg>
                      }
                      onChange={(e) => updateField("street", e.target.value)}
                    />
                  </div>
                </div>

                {/* Bottom actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    to="/users"
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </Link>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                    >
                      Save as draft
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeWidth="1.8"
                              d="M12 5v14m-7-7h14"
                            />
                          </svg>
                          Create user
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* =================================================
                RIGHT SIDEBAR
            ================================================== */}
            <aside className="space-y-5">
              {/* Profile Preview */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="9" strokeWidth="1.7" />
                      <circle cx="12" cy="10" r="2.5" strokeWidth="1.7" />
                      <path
                        strokeLinecap="round"
                        strokeWidth="1.7"
                        d="M7.5 17c.9-2 2.4-3 4.5-3s3.6 1 4.5 3"
                      />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Profile preview
                    </h2>
                    <p className="text-xs text-slate-500">
                      How the user will appear in the system.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                      {getInitials(form.fullName)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-slate-900">
                          {form.fullName || "Full Name"}
                        </h3>

                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </div>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {form.email || "email@example.com"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {form.role}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Account Readiness */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Account readiness
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Complete the important details.
                    </p>
                  </div>

                  <span className="text-sm font-bold text-indigo-600">
                    {completion}%
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>

                <div className="space-y-4">
                  <ReadinessItem
                    done={
                      Boolean(form.fullName) &&
                      Boolean(form.email) &&
                      Boolean(form.password)
                    }
                    title="Basic information"
                    description="Name, email and password are provided."
                  />

                  <ReadinessItem
                    done={Boolean(form.role)}
                    title="Role & permissions"
                    description={`Role is selected (${form.role}).`}
                  />

                  <ReadinessItem
                    done={
                      Boolean(form.company) &&
                      Boolean(form.city) &&
                      Boolean(form.street)
                    }
                    title="Work & location"
                    description="Company and location details are filled."
                  />

                  <ReadinessItem
                    done={Boolean(form.email)}
                    title="Email verification"
                    description="Check email is valid and accessible."
                  />
                </div>
              </section>

              {/* Security note */}
              <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth="1.7"
                        d="M12 3 5 6v5c0 4.7 2.9 8.1 7 10 4.1-1.9 7-5.3 7-10V6l-7-3Z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Account security
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      User credentials should be stored securely and never
                      exposed in the interface.
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </form>
      </main>
    </div>
  );
};

/* =========================================================
   INPUT COMPONENT
========================================================= */

const InputField = ({
  label,
  required,
  type = "text",
  value,
  placeholder,
  icon,
  helper,
  error,
  onChange,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-indigo-600">*</span>
        )}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={`h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
            error
              ? "border-rose-300 ring-2 ring-rose-100"
              : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          }`}
        />
      </div>

      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-600">
          {error}
        </p>
      ) : helper ? (
        <p className="mt-1.5 text-xs text-slate-400">{helper}</p>
      ) : null}
    </div>
  );
};

/* =========================================================
   ROLE CARD
========================================================= */

const RoleCard = ({
  selected,
  title,
  description,
  icon,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
        selected
          ? "border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-500"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          selected
            ? "bg-indigo-600 text-white"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-slate-900">
            {title}
          </h4>

          <div
            className={`flex h-4 w-4 items-center justify-center rounded-full border ${
              selected
                ? "border-indigo-600 bg-indigo-600"
                : "border-slate-300 bg-white"
            }`}
          >
            {selected && (
              <div className="h-1.5 w-1.5 rounded-full bg-white" />
            )}
          </div>
        </div>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </button>
  );
};

/* =========================================================
   READINESS ITEM
========================================================= */

const ReadinessItem = ({
  done,
  title,
  description,
}) => {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          done
            ? "bg-emerald-100 text-emerald-600"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {done ? (
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m5 12 4 4L19 6"
            />
          </svg>
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        )}
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 text-xs leading-5 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
};

export default AddUser;