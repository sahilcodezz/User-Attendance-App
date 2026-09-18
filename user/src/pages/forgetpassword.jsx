import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Reset email:", email);

    // Add forgot password API here
    setSubmitted(true);
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-[30px] font-bold tracking-[-0.7px] text-slate-950">
            Forgot password?
          </h1>

          <p className="mt-2 text-[15px] leading-6 text-slate-500">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.06)] p-7">

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Email address
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none transition-all focus:bg-white focus:border-[#5b35f5] focus:ring-4 focus:ring-[#5b35f5]/10"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#5b35f5] hover:bg-[#4d2de0] text-white text-sm font-semibold shadow-[0_8px_20px_rgba(91,53,245,0.2)] transition-all"
              >
                Send Reset Link
              </button>
            </form>
          ) : (
            <div className="text-center py-3">

              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                Check your inbox
              </h2>

              <p className="text-sm text-slate-500 mt-2 leading-6">
                If an account exists for{" "}
                <span className="font-medium text-slate-700">
                  {email}
                </span>
                , you'll receive a password reset link shortly.
              </p>
            </div>
          )}

          {/* Back */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#5735e8] hover:text-[#4325c9]"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>

              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;