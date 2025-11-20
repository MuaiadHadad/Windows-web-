import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useWindowsStore } from '../../store/windowsStore';
import { useUIStore } from '../../store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_REGISTRY } from '../../apps/registry';
import { useAuthStore } from '../../store/authStore';
import { Icon } from '../icons/Icons';

const StartMenu: React.FC = () => {
  const openWindow = useWindowsStore((s) => s.openWindow);
  const startMenuOpen = useUIStore((s) => s.startMenuOpen);
  const closeStartMenu = useUIStore((s) => s.closeStartMenu);
  const { email, logout } = useAuthStore();

  // Search query state (local) for RF3.3
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus search input when menu opens
  useEffect(() => {
    if (startMenuOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    } else if (!startMenuOpen) {
      setQuery(''); // reset query when closing
    }
  }, [startMenuOpen]);

  // Filter apps (case-insensitive; remove leading/trailing spaces)
  const filteredApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return Object.values(APP_REGISTRY);
    return Object.values(APP_REGISTRY).filter((app) => app.title.toLowerCase().includes(q) || app.id.toLowerCase().includes(q));
  }, [query]);

  return (
    <AnimatePresence>
      {startMenuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-24 left-1/2 w-[420px] -translate-x-1/2 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950/95 p-6 text-sm shadow-[0_30px_100px_rgba(0,0,0,0.8),0_0_60px_rgba(139,92,246,0.15)] backdrop-blur-3xl z-[1100]"
          role="dialog"
          aria-modal="true"
          aria-label="Menu iniciar"
        >
          {/* Holographic glow */}
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-cyan-500/10 blur-2xl" />

          {/* Search bar with futuristic style */}
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all focus-within:border-violet-400/40 focus-within:bg-white/10">
            <span className="text-lg" aria-hidden>🔍</span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar apps"
              aria-label="Pesquisar aplicações"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="rounded-lg px-2 py-1 text-[10px] font-medium text-white/60 transition-all hover:text-white/90 hover:bg-white/10"
                aria-label="Limpar pesquisa"
              >
                ✕
              </button>
            )}
          </div>

          {/* Pinned / Filtered Apps */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                {query ? 'Resultados' : 'Apps'}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {filteredApps.length === 0 && (
                <div className="col-span-5 text-center text-sm text-white/40 py-8">Nenhuma app encontrada.</div>
              )}
              {filteredApps.map((app) => (
                <StartItem
                  key={app.id}
                  label={app.title}
                  iconName={app.icon}
                  query={query}
                  onClick={() => {
                    openWindow(app.id, app.title);
                    closeStartMenu();
                  }}
                />
              ))}
            </div>
          </div>

          {/* Footer with user info and logout */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-cyan-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center text-sm">
                  👤
                </div>
                <div>
                  <div className="text-xs font-medium text-white/90">Windows Web</div>
                  <div className="text-[10px] text-white/40">
                    {email || 'Não autenticado'}
                  </div>
                </div>
              </div>
              {email && (
                <button
                  onClick={async () => {
                    await logout();
                    closeStartMenu();
                  }}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <span>Sair</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


const StartItem: React.FC<{ label: string; iconName: string; query: string; onClick: () => void }> = React.memo(({
  label,
  iconName,
  query,
  onClick,
}) => {
  const lower = label.toLowerCase();
  const q = query.trim().toLowerCase();
  const isMatch = q && lower.includes(q);

  return (
    <button
      onClick={onClick}
      title={label}
      className="group relative flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/5 p-3 text-center transition-all hover:border-white/20 hover:bg-white/10 hover:scale-105 focus:outline-none focus:ring-1 focus:ring-violet-400/40"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-white/10 to-white/5 text-xl transition-all group-hover:scale-110 group-hover:from-white/15 group-hover:to-white/10" aria-hidden>
        <Icon name={iconName as any} />
      </div>
      <div className={`text-[10px] font-medium truncate w-full transition-colors ${isMatch ? 'text-violet-300' : 'text-white/70 group-hover:text-white/90'}`}>
        {label}
      </div>
    </button>
  );
});

const ToggleButton: React.FC = () => {
  const toggleStartMenu = useUIStore((s) => s.toggleStartMenu);
  const startMenuOpen = useUIStore((s) => s.startMenuOpen);
  return (
    <button
      onClick={toggleStartMenu}
      className={`group flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400/60 ${
        startMenuOpen
          ? 'border-violet-400/60 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20 shadow-[0_0_40px_rgba(139,92,246,0.6)]'
          : 'border-white/20 bg-gradient-to-br from-white/15 to-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:from-white/25 hover:to-white/15 hover:shadow-[0_10px_40px_rgba(139,92,246,0.3)]'
      }`}
      aria-label="Open Start"
      aria-expanded={startMenuOpen}
      aria-haspopup="dialog"
    >
      <span className="grid grid-cols-2 gap-[3px] text-[0px]">
        <span className={`h-3.5 w-3.5 rounded-[5px] transition-all ${startMenuOpen ? 'bg-white' : 'bg-slate-200 group-hover:bg-violet-300'}`} />
        <span className={`h-3.5 w-3.5 rounded-[5px] transition-all ${startMenuOpen ? 'bg-white' : 'bg-slate-200 group-hover:bg-fuchsia-300'}`} />
        <span className={`h-3.5 w-3.5 rounded-[5px] transition-all ${startMenuOpen ? 'bg-white' : 'bg-slate-200 group-hover:bg-cyan-300'}`} />
        <span className={`h-3.5 w-3.5 rounded-[5px] transition-all ${startMenuOpen ? 'bg-white' : 'bg-slate-200 group-hover:bg-pink-300'}`} />
      </span>
    </button>
  );
};

export default Object.assign(StartMenu, { ToggleButton });
