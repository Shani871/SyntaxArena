import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Lock, Mail, ShieldCheck, Sparkles, User } from 'lucide-react';
import { BrandMark } from '../components/BrandMark';
import { useAuth } from '../components/AuthContext';
import { GameMode } from '../types';

interface AuthProps {
  setMode: (mode: GameMode) => void;
}

export const Auth: React.FC<AuthProps> = ({ setMode }) => {
  const { authEnabled, loginWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState<'FORM' | 'GOOGLE' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const checklist = useMemo(
    () => [
      'Focused battle and practice workflows',
      'Interactive visualizer, docs, and playground tools',
      'Persistent local progress and scheduled battles',
    ],
    [],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading('FORM');

    window.setTimeout(() => {
      setLoading(null);
      setMode(GameMode.DASHBOARD);
    }, 800);
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading('GOOGLE');

    try {
      await loginWithGoogle();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in with Google.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex h-full w-full overflow-y-auto bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] px-4 py-10 text-slate-100 md:px-8 md:py-14">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl md:p-8 lg:p-10">
          <div className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-300">
            Production-ready workspace
          </div>

          <div className="mt-6">
            <BrandMark />
            <h1 className="mt-8 max-w-xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              A cleaner command center for practice, battle, and backend learning.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              SyntaxArena now opens with a sharper shell, safer persistence, and a calmer UI that scales better across the core workflows.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {checklist.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <Sparkles size={18} className="text-sky-300" />
                <p className="mt-3 text-sm leading-6 text-slate-300">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-sky-400/18 bg-sky-500/8 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Authentication status</p>
                <p className="text-sm text-slate-300">
                  {authEnabled
                    ? 'Firebase is configured. Google sign-in is enabled for this environment.'
                    : 'Firebase is not configured. You can still open a local preview session to review the product UI.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-slate-950/75 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">{isLogin ? 'Sign In' : 'Create Account'}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {isLogin ? 'Enter the arena' : 'Create your workspace'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {authEnabled
                ? 'Use Google for a real authenticated session, or launch a local preview session from the form.'
                : 'This environment is running without Firebase credentials, so the form opens a local preview session only.'}
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Username</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 focus-within:border-sky-400/40">
                  <User size={16} className="text-slate-500" />
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(event) => setFormData((current) => ({ ...current, username: event.target.value }))}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                    placeholder="neo-coder"
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Email</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 focus-within:border-sky-400/40">
                <Mail size={16} className="text-slate-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  placeholder="dev@syntaxarena.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 focus-within:border-sky-400/40">
                <Lock size={16} className="text-slate-500" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  placeholder="••••••••"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading !== null}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading === 'FORM' ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              {authEnabled ? 'Continue to dashboard' : 'Open local preview'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={!authEnabled || loading !== null}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] text-sm font-semibold text-white transition hover:border-sky-400/30 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading === 'GOOGLE' ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} className="text-sky-300" />}
            Continue with Google
          </button>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">What changed</p>
            <div className="mt-3 space-y-3 text-sm text-slate-300">
              <div className="flex gap-3">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-300" />
                <span>Cleaner auth shell with explicit environment status.</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-300" />
                <span>Misleading silent failures replaced with clear fallback behavior.</span>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            {isLogin ? 'Need a new account?' : 'Already have access?'}{' '}
            <button type="button" onClick={() => setIsLogin((value) => !value)} className="font-semibold text-sky-300 hover:text-sky-200">
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </section>
      </div>
    </div>
  );
};
