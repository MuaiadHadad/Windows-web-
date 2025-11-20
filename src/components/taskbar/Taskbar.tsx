import React, { useMemo, useCallback } from 'react';
import { useWindowsStore } from '../../store/windowsStore';
import StartMenuToggle from './StartMenu';
import { getAppMeta } from '../../apps/registry';
import dynamic from 'next/dynamic';
import { Icon } from '../icons/Icons';
import { motion } from 'framer-motion';

const TaskbarClock = dynamic(() => import('./TaskbarClock'), { ssr: false });

const Taskbar: React.FC = () => {
  const windows = useWindowsStore((s) => s.windows);
  const minimizeWindow = useWindowsStore((s) => s.minimizeWindow);
  const focusWindow = useWindowsStore((s) => s.focusWindow);

  const activeWindowId = useMemo(() => {
    return windows.reduce<string | null>((acc, w) => {
      if (w.minimized) return acc;
      if (!acc) return w.id;
      const current = windows.find((x) => x.id === acc)!;
      return w.zIndex > current.zIndex ? w.id : acc;
    }, null);
  }, [windows]);

  return (
    <div className="pointer-events-none fixed bottom-4 left-0 right-0 flex justify-center z-[1000]">
      <div className="pointer-events-auto flex h-16 w-[min(920px,calc(100%-32px))] items-center gap-3 rounded-[28px] border border-white/15 bg-gradient-to-r from-white/[0.08] via-white/[0.12] to-white/[0.08] px-5 shadow-[0_20px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(139,92,246,0.15),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-3xl">
        {/* Holographic glow */}
        <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 blur-2xl" />

        <StartMenuToggle.ToggleButton />

        <div className="flex flex-1 items-center justify-center gap-2 overflow-x-auto">
          {windows.map((w) => {
            const meta = getAppMeta(w.appId);
            const isActive = activeWindowId === w.id && !w.minimized;
            return (
              <motion.button
                key={w.id}
                onClick={() => {
                  if (isActive) {
                    // Toggle minimize for active window
                    minimizeWindow(w.id);
                  } else {
                    // Restore and focus
                    if (w.minimized) minimizeWindow(w.id);
                    focusWindow(w.id);
                  }
                }}
                aria-label={w.title}
                aria-pressed={isActive}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 text-xl text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-300 hover:from-white/20 hover:to-white/15 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] focus:outline-none focus:ring-2 focus:ring-violet-400/60 ${
                  w.minimized ? 'opacity-50' : ''
                } ${isActive ? 'ring-2 ring-violet-400/80 from-white/25 to-white/20 shadow-[0_0_40px_rgba(139,92,246,0.6)]' : ''}`}
              >
                <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]" title={w.title}>
                  <Icon name={meta.icon as any} />
                </span>
                {/* Active indicator */}
                <motion.span
                  initial={false}
                  animate={{
                    scaleX: w.minimized ? 0 : 1,
                    opacity: w.minimized ? 0 : 1,
                    height: isActive ? 6 : 4,
                  }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className={`absolute bottom-1 w-6 rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 shadow-[0_0_12px_rgba(139,92,246,0.8)] ${
                    isActive ? 'brightness-150' : ''
                  }`}
                />
              </motion.button>
            );
          })}
        </div>

        <TaskbarClock />
      </div>
    </div>
  );
};

Taskbar.displayName = 'Taskbar';

export default React.memo(Taskbar);
