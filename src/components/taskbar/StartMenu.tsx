import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useWindowsStore } from '../../store/windowsStore';
import { useUIStore } from '../../store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_REGISTRY } from '../../apps/registry';
import { useAuthStore } from '../../store/authStore';

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
          className="fixed bottom-24 left-1/2 w-[480px] -translate-x-1/2 rounded-[36px] border border-white/15 bg-gradient-to-br from-slate-900/90 via-slate-900/85 to-slate-950/95 p-8 text-sm shadow-[0_40px_120px_rgba(0,0,0,0.7),0_0_80px_rgba(139,92,246,0.2),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-3xl z-[1100]"
          role="dialog"
          aria-modal="true"
          aria-label="Menu iniciar"
        >
          {/* Holographic glow */}
          <div className="absolute inset-0 -z-10 rounded-[36px] bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-cyan-500/15 blur-3xl" />

          {/* Search bar with futuristic style */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-gradient-to-r from-white/5 to-white/10 px-4 py-3 text-xs text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all focus-within:border-violet-400/60 focus-within:shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            <span className="text-xl drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]" aria-hidden>🔍</span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar apps"
              aria-label="Pesquisar aplicações"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="rounded-lg px-2 py-1 text-[10px] font-medium text-white/70 transition-all hover:text-white hover:bg-white/15"
                aria-label="Limpar pesquisa"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Pinned / Filtered Apps */}
          <div className="mt-8">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-violet-300/70 font-semibold">
              <span>{query ? 'Resultados' : 'Aplicações'}</span>
              <button className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-white/80 transition-all hover:border-violet-400/60 hover:bg-violet-500/20 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]" onClick={() => setQuery('')}>
                Todas
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 min-h-[200px]">
              {filteredApps.length === 0 && (
                <div className="col-span-3 text-center text-sm text-white/50 py-10">Nenhuma app encontrada.</div>
              )}
              {filteredApps.map((app) => (
                <StartItem
                  key={app.id}
                  label={app.title}
                  glyph={app.glyph}
                  description={app.description}
                  query={query}
                  onClick={() => {
                    openWindow(app.id, app.title);
                    closeStartMenu();
                  }}
                />
              ))}
            </div>
          </div>

          {/* Recommended section with futuristic design */}
          <div className="mt-8">
            <div className="text-[10px] uppercase tracking-[0.25em] text-violet-300/60 font-semibold">Recentes</div>
            <div className="mt-4 space-y-3 text-sm">
              {recommendedItems.map((item) => (
                <button
                  key={item.title}
                  onClick={closeStartMenu}
                  className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-white/10 px-4 py-3 text-left transition-all hover:-translate-y-1 hover:border-violet-400/40 hover:from-white/10 hover:to-white/15 hover:shadow-[0_10px_40px_rgba(139,92,246,0.3)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" aria-hidden>{item.emoji}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white/95">{item.title}</div>
                    <div className="text-xs text-white/60">{item.detail}</div>
                  </div>
                  <span className="text-[10px] text-violet-300/50">{item.time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer with user info and logout */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-cyan-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(139,92,246,0.3)] flex items-center justify-center text-lg">
                  👤
                </div>
                <div>
                  <div className="text-sm font-semibold text-white/95">Windows Web</div>
                  <div className="text-[11px] text-violet-300/70">
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
                  className="flex items-center gap-2 rounded-2xl border border-rose-400/30 bg-gradient-to-r from-rose-500/10 to-red-500/10 px-4 py-2 text-xs font-medium text-rose-200 transition-all hover:border-rose-400/60 hover:from-rose-500/20 hover:to-red-500/20 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                >
                  <span>Sair</span>
                  <span className="text-sm">🚪</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const recommendedItems = [
  { title: 'Welcome tour', detail: 'Discover gestures', time: 'Just now', emoji: '✨' },
  { title: 'Docs folder', detail: 'Files · Updated', time: '5m ago', emoji: '📁' },
];

const StartItem: React.FC<{ label: string; description: string; glyph: string; query: string; onClick: () => void }> = ({
  label,
  description,
  glyph,
  query,
  onClick,
}) => {
  const lower = label.toLowerCase();
  const q = query.trim().toLowerCase();
  let highlightedLabel: React.ReactNode = label;
  if (q && lower.includes(q)) {
    const start = lower.indexOf(q);
    const end = start + q.length;
    highlightedLabel = (
      <>
        {label.slice(0, start)}
        <span className="text-violet-300">{label.slice(start, end)}</span>
        {label.slice(end)}
      </>
    );
  }
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 px-3 py-4 text-center transition-all hover:-translate-y-1 hover:border-violet-400/40 hover:from-white/10 hover:to-white/15 hover:shadow-[0_15px_50px_rgba(139,92,246,0.4)] focus:outline-none focus:ring-2 focus:ring-violet-400/60"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-violet-500/0 to-fuchsia-500/0 blur-xl opacity-0 transition-opacity group-hover:from-violet-500/20 group-hover:to-fuchsia-500/20 group-hover:opacity-100" />

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 via-fuchsia-500/15 to-cyan-500/20 text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]" aria-hidden>
        {glyph}
      </div>
      <div className="space-y-0.5">
        <div className="font-semibold text-white/95 text-xs truncate w-full" title={label}>{highlightedLabel}</div>
        <div className="text-[10px] text-white/50 line-clamp-2 font-light" title={description}>{description}</div>
      </div>
    </button>
  );
};

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
