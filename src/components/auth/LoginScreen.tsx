import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

const LoginScreen: React.FC = () => {
  const { email, login, register, loading, error } = useAuthStore();
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [formEmail, setFormEmail] = useState('');
  const [formPass, setFormPass] = useState('');

  return (
    <div className="fixed inset-0 z-[1900] grid place-items-center bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 text-white overflow-hidden">
      {/* Animated holographic background */}
      <div className="absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.25),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Main login panel */}
      <div className="relative flex w-[min(480px,calc(100%-40px))] flex-col items-center gap-8 rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent p-10 shadow-[0_50px_140px_rgba(0,0,0,0.8),0_0_80px_rgba(139,92,246,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl">
        {/* Holographic glow */}
        <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-cyan-500/20 blur-3xl" />

        {/* Futuristic logo */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-2" aria-hidden>
            <span className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-[0_0_30px_rgba(139,92,246,0.6)]" />
            <span className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-[0_0_30px_rgba(59,130,246,0.6)]" />
            <span className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.6)]" />
            <span className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-[0_0_30px_rgba(236,72,153,0.6)]" />
          </div>
          <div className="absolute inset-0 -m-4 rounded-full border border-violet-400/20 animate-ping" style={{ animationDuration: '3s' }} />
        </div>

        <div className="text-center space-y-2">
          <div className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            Windows Web
          </div>
          <div className="text-sm text-violet-200/70 font-light">{mode === 'login' ? 'Autenticação de Acesso' : 'Criar Nova Conta'}</div>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (mode === 'login') {
              await login(formEmail, formPass);
            } else {
              await register(formEmail, formPass);
            }
          }}
          className="w-full space-y-4"
        >
          <input
            type="email"
            required
            autoFocus
            placeholder="Email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-sm transition-all focus:border-violet-400/60 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:border-white/30"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={formPass}
            onChange={(e) => setFormPass(e.target.value)}
            className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-sm transition-all focus:border-violet-400/60 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:border-white/30"
          />
          {error && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs text-rose-300 backdrop-blur-sm">
              {error}
            </div>
          )}
          <button
            disabled={loading}
            className="w-full rounded-2xl border border-violet-400/30 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] backdrop-blur-sm transition-all hover:from-violet-500/30 hover:via-fuchsia-500/30 hover:to-cyan-500/30 hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                A processar...
              </span>
            ) : mode === 'login' ? 'Entrar no Sistema' : 'Criar Conta'}
          </button>
        </form>

        <div className="text-xs text-white/60">
          {mode === 'login' ? (
            <button onClick={() => setMode('register')} className="underline underline-offset-2 transition-colors hover:text-violet-300">
              Criar nova conta
            </button>
          ) : (
            <button onClick={() => setMode('login')} className="underline underline-offset-2 transition-colors hover:text-violet-300">
              Já tenho conta
            </button>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 bg-violet-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 h-24 w-24 bg-fuchsia-500/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default LoginScreen;
