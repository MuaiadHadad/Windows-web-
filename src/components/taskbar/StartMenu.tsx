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
  const { email, login, register, logout, loading, error } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');

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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed bottom-20 left-1/2 w-[440px] -translate-x-1/2 rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900/85 via-slate-900/80 to-slate-950/90 p-6 text-sm shadow-[0_35px_80px_rgba(0,0,0,0.6)] backdrop-blur-[24px] z-[1100]"
          role="dialog"
          aria-modal="true"
          aria-label="Menu iniciar"
        >
          {/* Search bar */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
            <span className="text-lg drop-shadow" aria-hidden>🔍</span>
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
                className="rounded-md px-2 py-1 text-[11px] font-medium text-white/70 hover:text-white hover:bg-white/10"
                aria-label="Limpar pesquisa"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Pinned / Filtered Apps */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/60">
              <span>{query ? 'Resultados' : 'Pinned'}</span>
              <button className="rounded-full border border-white/10 px-3 py-1 text-white/80 transition hover:border-white/40 hover:text-white" onClick={() => setQuery('')}>
                Todas
              </button>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 min-h-[180px]">
              {filteredApps.length === 0 && (
                <div className="col-span-3 text-center text-xs text-white/50 py-6">Nenhuma app encontrada.</div>
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

          {/* Recommended (unchanged) */}
          <div className="mt-6">
            <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">Recommended</div>
            <div className="mt-3 space-y-3 text-sm">
              {recommendedItems.map((item) => (
                <button
                  key={item.title}
                  onClick={closeStartMenu}
                  className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-left transition hover:-translate-y-0.5 hover:bg-white/20"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-lg shadow-inner" aria-hidden>{item.emoji}</div>
                  <div>
                    <div className="font-semibold text-white">{item.title}</div>
                    <div className="text-xs text-white/60">{item.detail}</div>
                  </div>
                  <span className="ml-auto text-[11px] text-white/50">{item.time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer with account */}
          <div className="mt-6 flex items-center justify-between text-xs text-white/80">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-white/15 via-white/5 to-transparent shadow-inner" />
              <div>
                <div className="font-semibold text-white">Windows Web</div>
                <div className="text-white/60">{email ? `Signed in as ${email}` : 'Not signed in'}</div>
              </div>
            </div>
            {email ? (
              <button
                onClick={async () => { await logout(); setShowAuth(false); }}
                className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-white transition hover:border-white/40 hover:bg-white/15"
              >
                <span>Logout</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setMode('login'); setShowAuth((v) => !v); }}
                  className="rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-white transition hover:border-white/40 hover:bg-white/15"
                >
                  Sign in
                </button>
                <button
                  onClick={() => { setMode('register'); setShowAuth((v) => !v); }}
                  className="rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-white transition hover:border-white/40 hover:bg-white/15"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {!email && showAuth && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const ok = mode === 'login' ? await login(authEmail, authPass) : await register(authEmail, authPass);
                if (ok) { setShowAuth(false); setAuthEmail(''); setAuthPass(''); closeStartMenu(); }
              }}
              className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/60">{mode === 'login' ? 'Login' : 'Register'}</div>
              <div className="grid gap-2">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={authPass}
                  onChange={(e) => setAuthPass(e.target.value)}
                  className="rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
                {error && <div className="text-[11px] text-rose-300">{error}</div>}
                <div className="flex items-center gap-2">
                  <button disabled={loading} className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20">
                    {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
                  </button>
                  <button type="button" onClick={() => setShowAuth(false)} className="rounded-md px-3 py-2 text-sm text-white/70 hover:text-white">Cancel</button>
                </div>
              </div>
            </form>
          )}
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
  // Highlight matched portion
  const lower = label.toLowerCase();
  const q = query.trim().toLowerCase();
  let highlightedLabel: React.ReactNode = label;
  if (q && lower.includes(q)) {
    const start = lower.indexOf(q);
    const end = start + q.length;
    highlightedLabel = (
      <>
        {label.slice(0, start)}
        <span className="text-sky-300">{label.slice(start, end)}</span>
        {label.slice(end)}
      </>
    );
  }
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-center transition hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-[0_10px_30px_rgba(56,189,248,0.2)] focus:outline-none focus:ring-2 focus:ring-sky-300/50"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 text-2xl drop-shadow shadow-inner" aria-hidden>
        {glyph}
      </div>
      <div>
        <div className="font-semibold text-white truncate" title={label}>{highlightedLabel}</div>
        <div className="text-[11px] text-white/60 line-clamp-2" title={description}>{description}</div>
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
      className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/80 text-slate-900 shadow-[0_8px_24px_rgba(2,6,23,0.55)] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/50"
      aria-label="Open Start"
      aria-expanded={startMenuOpen}
      aria-haspopup="dialog"
    >
      <span className="grid grid-cols-2 gap-[2px] text-[0px]">
        <span className="h-3 w-3 rounded-[4px] bg-slate-900 group-hover:bg-sky-600" />
        <span className="h-3 w-3 rounded-[4px] bg-slate-900 group-hover:bg-sky-600" />
        <span className="h-3 w-3 rounded-[4px] bg-slate-900 group-hover:bg-sky-600" />
        <span className="h-3 w-3 rounded-[4px] bg-slate-900 group-hover:bg-sky-600" />
      </span>
    </button>
  );
};

export default Object.assign(StartMenu, { ToggleButton });
