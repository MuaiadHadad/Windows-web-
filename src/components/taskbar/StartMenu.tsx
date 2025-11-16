import React from 'react';
import { useWindowsStore } from '../../store/windowsStore';
import { useUIStore } from '../../store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_REGISTRY } from '../../apps/registry';

const StartMenu: React.FC = () => {
  const openWindow = useWindowsStore((s) => s.openWindow);
  const startMenuOpen = useUIStore((s) => s.startMenuOpen);
  const closeStartMenu = useUIStore((s) => s.closeStartMenu);

  return (
    <AnimatePresence>
      {startMenuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed bottom-16 left-1/2 w-[420px] -translate-x-1/2 rounded-[32px] border border-white/10 bg-slate-900/80 p-6 text-sm shadow-2xl backdrop-blur-2xl"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-3 py-2 text-xs text-white/60">
            <span className="text-lg">🔍</span>
            <input
              readOnly
              placeholder="Search apps, files and settings"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/50">
              <span>Pinned</span>
              <button className="text-white/70 transition hover:text-white">All apps</button>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {Object.values(APP_REGISTRY).map((app) => (
                <StartItem
                  key={app.id}
                  label={app.title}
                  glyph={app.glyph}
                  description={app.description}
                  onClick={() => {
                    openWindow(app.id, app.title);
                    closeStartMenu();
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">Recommended</div>
            <div className="mt-3 space-y-3 text-sm">
              {recommendedItems.map((item) => (
                <button
                  key={item.title}
                  onClick={closeStartMenu}
                  className="flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-3 py-2 text-left transition hover:bg-white/10"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg">{item.emoji}</div>
                  <div>
                    <div className="font-semibold text-white">{item.title}</div>
                    <div className="text-xs text-white/60">{item.detail}</div>
                  </div>
                  <span className="ml-auto text-[11px] text-white/50">{item.time}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-white/70">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-white/10" />
              <div>
                <div className="font-semibold text-white">Windows Web</div>
                <div className="text-white/60">Signed in</div>
              </div>
            </div>
            <button
              onClick={closeStartMenu}
              className="flex items-center gap-2 rounded-2xl border border-white/10 px-3 py-2 text-white transition hover:bg-white/10"
            >
              <span>Power</span>
              <span className="text-lg">⏻</span>
            </button>
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

const StartItem: React.FC<{ label: string; description: string; glyph: string; onClick: () => void }> = ({
  label,
  description,
  glyph,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="group flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-3 py-3 text-center transition hover:-translate-y-0.5 hover:bg-white/10"
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl drop-shadow">
      {glyph}
    </div>
    <div>
      <div className="font-semibold text-white">{label}</div>
      <div className="text-[11px] text-white/60">{description}</div>
    </div>
  </button>
);

const ToggleButton: React.FC = () => {
  const toggleStartMenu = useUIStore((s) => s.toggleStartMenu);
  return (
    <button
      onClick={toggleStartMenu}
      className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/5 bg-white/70 text-slate-900 shadow-[0_4px_16px_rgba(2,6,23,0.5)] transition hover:bg-white"
      aria-label="Open Start"
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

