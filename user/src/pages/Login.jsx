import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add your login API here
    console.log(formData);

    // navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#5b35f5] flex items-center justify-center shadow-[0_10px_25px_rgba(91,53,245,0.22)]">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-[30px] font-bold tracking-[-0.7px] text-slate-950">
            Welcome back
          </h1>

          <p className="mt-2 text-[15px] text-slate-500">
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.06)] p-7">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                Email
              </label>

              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1a3 3 0 006 0v-1a10 10 0 10-4 8"
                  />
                </svg>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-[#5b35f5] focus:ring-4 focus:ring-[#5b35f5]/10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-semibold text-slate-700">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-[13px] font-medium text-[#5735e8] hover:text-[#4325c9]"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-[#5b35f5] focus:ring-4 focus:ring-[#5b35f5]/10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg
                      className="w-[18px] h-[18px]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 012.278-3.592M6.228 6.228A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.958 9.958 0 01-1.507 2.74M6.228 6.228L3 3m3.228 3.228l12.544 12.544"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-[18px] h-[18px]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#5b35f5] focus:ring-[#5b35f5]"
                />

                <span className="text-[13px] text-slate-600">
                  Remember me
                </span>
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#5b35f5] hover:bg-[#4d2de0] text-white text-sm font-semibold shadow-[0_8px_20px_rgba(91,53,245,0.2)] hover:shadow-[0_10px_24px_rgba(91,53,245,0.28)] transition-all duration-200"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">
              or continue with
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <span className="text-base font-bold">G</span>
              Google
            </button>

            <button
              type="button"
              className="h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <span className="text-base font-bold">●</span>
              GitHub
            </button>
          </div>
        </div>

        {/* Signup */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[#5735e8] hover:text-[#4325c9]"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;