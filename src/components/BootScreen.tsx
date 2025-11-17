import React from 'react';

const BootScreen: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[2000] grid place-items-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 opacity-30" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(139,92,246,0.4),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.3),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] animate-pulse" />
      </div>

      <div className="flex flex-col items-center gap-12 relative z-10">
        {/* Futuristic logo with holographic effect */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-3 relative z-10">
            <span className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 shadow-[0_0_60px_rgba(139,92,246,0.8),0_20px_40px_rgba(139,92,246,0.4)] animate-pulse" />
            <span className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-sky-400 shadow-[0_0_60px_rgba(59,130,246,0.8),0_20px_40px_rgba(59,130,246,0.4)] animate-pulse" style={{ animationDelay: '0.2s' }} />
            <span className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-500 shadow-[0_0_60px_rgba(20,184,166,0.8),0_20px_40px_rgba(20,184,166,0.4)] animate-pulse" style={{ animationDelay: '0.4s' }} />
            <span className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-red-400 shadow-[0_0_60px_rgba(236,72,153,0.8),0_20px_40px_rgba(236,72,153,0.4)] animate-pulse" style={{ animationDelay: '0.6s' }} />
          </div>
          {/* Holographic ring */}
          <div className="absolute inset-0 -m-8 rounded-full border-2 border-violet-400/30 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-0 -m-6 rounded-full border border-cyan-400/20 animate-ping" style={{ animationDuration: '2.5s' }} />
        </div>

        <div className="text-center space-y-3">
          <div className="text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.8)]">
            Windows Web
          </div>
          <div className="text-sm text-violet-200/80 font-light tracking-widest uppercase">Initializing System...</div>
        </div>

        {/* Advanced progress bar */}
        <div className="relative w-80">
          <div className="h-2 overflow-hidden rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-inner">
            <div className="h-full animate-[bootbar_1.8s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 shadow-[0_0_20px_rgba(139,92,246,0.8)]" style={{ width: '50%' }} />
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 -m-1 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 blur-xl rounded-full" />
        </div>

        {/* Loading dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 animate-bounce shadow-[0_0_10px_rgba(139,92,246,0.6)]"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes bootbar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(50%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default BootScreen;
