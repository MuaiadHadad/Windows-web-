import React from 'react';

const BootScreen: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[2000] grid place-items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="flex flex-col items-center gap-8">
        {/* Windows-like logo */}
        <div className="grid grid-cols-2 gap-2">
          <span className="h-10 w-10 rounded-[6px] bg-sky-500/80 shadow-[0_10px_40px_rgba(56,189,248,0.35)]" />
          <span className="h-10 w-10 rounded-[6px] bg-sky-400/70 shadow-[0_10px_40px_rgba(56,189,248,0.25)]" />
          <span className="h-10 w-10 rounded-[6px] bg-sky-400/70 shadow-[0_10px_40px_rgba(56,189,248,0.25)]" />
          <span className="h-10 w-10 rounded-[6px] bg-sky-300/70 shadow-[0_10px_40px_rgba(56,189,248,0.2)]" />
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold tracking-tight drop-shadow">Windows Web</div>
          <div className="mt-1 text-xs text-white/70">Starting up…</div>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 w-64 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-[bootbar_1.6s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-sky-300 to-indigo-400" />
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

