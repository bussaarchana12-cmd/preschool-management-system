import React, { useState } from "react";
import { Role, User } from "../types";
import { Lock, Mail, Sparkles, Key, AlertCircle, Smile } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (user: User, token: string) => void;
}

const PRESET_ACCOUNTS = [
  { role: Role.SUPER_ADMIN, email: "superadmin@school.com", name: "Dr. Sunita Sharma" },
  { role: Role.ADMIN, email: "admin@school.com", name: "Anil Verma" },
  { role: Role.PRINCIPAL, email: "principal@school.com", name: "Mrs. Evelyn Carter" },
  { role: Role.TEACHER, email: "teacher1@school.com", name: "Ms. Sarah Jenkins (PG)" },
  { role: Role.TEACHER, email: "teacher2@school.com", name: "Mrs. Meera Patel (Nursery)" },
  { role: Role.PARENT, email: "parent@school.com", name: "Rajesh Malhotra" },
  { role: Role.RECEPTIONIST, email: "receptionist@school.com", name: "Tina Sen" },
  { role: Role.ACCOUNTANT, email: "accountant@school.com", name: "Sanjay Gupta" },
];

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password flow
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login credentials failed");
      }

      const data = await response.json();
      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setError(err.message || "Connection refused by the ERP server.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Email not registered");
      }
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to trigger OTP.");
    }
  };

  const handleResetPasswordWithOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== "123456") {
      setError("Incorrect OTP. Simulated code is 123456.");
      return;
    }
    if (!newPassword) {
      setError("Please set a new password");
      return;
    }
    setForgotSuccessMsg("Your password has been reset successfully! Try logging in.");
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotEmail("");
      setOtpSent(false);
      setOtpCode("");
      setNewPassword("");
      setForgotSuccessMsg("");
    }, 2500);
  };

  const autoFillAccount = (preset: typeof PRESET_ACCOUNTS[0]) => {
    setEmail(preset.email);
    setPassword("password123");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Brand Visual Card */}
        <div className="lg:col-span-5 bg-indigo-950 p-8 sm:p-12 text-white flex flex-col justify-between relative min-h-[300px] lg:min-h-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-800/10 rounded-full blur-2xl"></div>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center shadow-sm font-display text-lg">
              FI
            </div>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-widest font-display text-white">
                Intellitots
              </h1>
              <p className="text-[10px] font-semibold text-indigo-300 uppercase">ERP Enterprise Suite</p>
            </div>
          </div>

          <div className="my-8 lg:my-0">
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight font-display tracking-tight text-white">
              A smarter way to manage your preschool.
            </h2>
            <p className="text-xs text-indigo-200/90 mt-2 font-medium leading-relaxed">
              Experience the international standard student tracking dashboard. Integrated with progress reports, fees ledger, automated queues, and AI-powered diagnostic summaries.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            <span>Academic Year: 2026-27 (V3.1.2)</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center gap-8 bg-white">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-display">Welcome Back</h3>
            <p className="text-xs text-slate-400">Sign in to access your role-based student ERP dashboard.</p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-2 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Registered Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. principal@school.com"
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 px-10 py-3 rounded-xl text-xs outline-none transition-all text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-500">Security Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secret password"
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 px-10 py-3 rounded-xl text-xs outline-none transition-all text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
                Remember my login session
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-all font-display uppercase tracking-wider"
            >
              {loading ? "Authenticating security credentials..." : "Secure Login"}
            </button>
          </form>

          {/* Quick selectors for reviewer testing */}
          <div className="border-t border-slate-100 pt-6">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1">
              <Smile className="w-3.5 h-3.5 text-indigo-500" />
              Developer Role Quick Selectors
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_ACCOUNTS.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => autoFillAccount(preset)}
                  className={`px-3 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-[10px] text-slate-600 font-semibold cursor-pointer transition-all truncate text-left flex flex-col`}
                >
                  <span className="text-[9px] text-indigo-600 font-extrabold uppercase truncate">{preset.role}</span>
                  <span className="truncate text-slate-500 font-normal">{preset.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 w-full max-w-md shadow-lg flex flex-col gap-5">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-bold text-slate-900 font-display">Simulated OTP Reset</h4>
                <p className="text-xs text-slate-500">Secure verification utilizing email tokens.</p>
              </div>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setOtpSent(false);
                }}
                className="text-slate-400 hover:bg-slate-100 p-1 rounded-full cursor-pointer"
              >
                <XIcon />
              </button>
            </div>

            {forgotSuccessMsg ? (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-xs font-semibold text-center">
                {forgotSuccessMsg}
              </div>
            ) : !otpSent ? (
              <form onSubmit={handleForgotPasswordSubmit} className="flex flex-col gap-4">
                <p className="text-xs text-slate-600">
                  Enter your registered preschool email. A simulated 6-digit verification pin will be routed instantly.
                </p>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Your Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="parent@school.com"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 px-10 py-2.5 rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  Send Verification Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordWithOTP} className="flex flex-col gap-4">
                <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-xs text-indigo-800 font-medium">
                  OTP sent successfully. For testing purposes, enter code: <strong className="font-extrabold text-indigo-950">123456</strong>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">6-Digit OTP Pin</label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 px-10 py-2.5 rounded-xl text-xs outline-none font-mono text-center tracking-widest text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Create New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Choose a strong password"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 px-10 py-2.5 rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Verify & Reset Password
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
