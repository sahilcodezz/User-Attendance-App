import { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log(formData);

    // Add signup API here
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="flex justify-center mb-7">
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
        <div className="text-center mb-7">
          <h1 className="text-[30px] font-bold tracking-[-0.7px] text-slate-950">
            Create account
          </h1>

          <p className="mt-2 text-[15px] text-slate-500">
            Get started with your UserHub account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.06)] p-7">

          <form onSubmit={handleSubmit} className="space-y-4.5">

            {/* Name */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                Full name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Sahil Pandey"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none transition-all focus:bg-white focus:border-[#5b35f5] focus:ring-4 focus:ring-[#5b35f5]/10"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none transition-all focus:bg-white focus:border-[#5b35f5] focus:ring-4 focus:ring-[#5b35f5]/10"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none transition-all focus:bg-white focus:border-[#5b35f5] focus:ring-4 focus:ring-[#5b35f5]/10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  👁
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                Confirm password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none transition-all focus:bg-white focus:border-[#5b35f5] focus:ring-4 focus:ring-[#5b35f5]/10"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  👁
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#5b35f5] focus:ring-[#5b35f5]"
                required
              />

              <span className="text-xs leading-5 text-slate-500">
                I agree to the{" "}
                <span className="text-[#5735e8] font-medium">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-[#5735e8] font-medium">
                  Privacy Policy
                </span>
              </span>
            </label>

            {/* Button */}
            <button
              type="submit"
              className="w-full h-11 mt-2 rounded-xl bg-[#5b35f5] hover:bg-[#4d2de0] text-white text-sm font-semibold shadow-[0_8px_20px_rgba(91,53,245,0.2)] transition-all"
            >
              Create Account
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

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="h-11 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-700"
            >
              G&nbsp; Google
            </button>

            <button
              type="button"
              className="h-11 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-700"
            >
              ●&nbsp; GitHub
            </button>
          </div>
        </div>

        {/* Login */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#5735e8] hover:text-[#4325c9]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;