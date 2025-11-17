import React from 'react';
import { useWindowsStore } from '../../store/windowsStore';
import StartMenuToggle from './StartMenu';
import { getAppMeta } from '../../apps/registry';
import dynamic from 'next/dynamic';

const TaskbarClock = dynamic(() => import('./TaskbarClock'), { ssr: false });

const Taskbar: React.FC = () => {
  const windows = useWindowsStore((s) => s.windows);
  const minimizeWindow = useWindowsStore((s) => s.minimizeWindow);
  const focusWindow = useWindowsStore((s) => s.focusWindow);

  // Active (focused) window inferred by highest zIndex among not-minimized windows
  const activeWindowId = windows.reduce<string | null>((acc, w) => {
    if (w.minimized) return acc;
    if (!acc) return w.id;
    const current = windows.find((x) => x.id === acc)!;
    return w.zIndex > current.zIndex ? w.id : acc;
  }, null);

  return (
    <div className="pointer-events-none fixed bottom-3 left-0 right-0 flex justify-center z-[1000]">{/* z-index elevado */}
      <div className="pointer-events-auto flex h-14 w-[min(900px,calc(100%-32px))] items-center gap-3 rounded-[22px] border border-white/12 bg-white/12 px-4 shadow-[0_18px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <StartMenuToggle.ToggleButton />
        <div className="flex flex-1 items-center justify-center gap-2">
          {windows.map((w) => {
            const meta = getAppMeta(w.appId);
            const isActive = activeWindowId === w.id;
            return (
              <button
                key={w.id}
                onClick={() => {
                  if (w.minimized) {
                    // Restore & focus per RF2.4
                    minimizeWindow(w.id);
                    focusWindow(w.id);
                  } else {
                    // Focus (bring to front) per RF2.4 instead of minimizing
                    focusWindow(w.id);
                  }
                }}
                aria-label={w.title}
                aria-pressed={isActive}
                className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-sky-300/50 ${
                  w.minimized ? 'opacity-60' : ''
                } ${isActive ? 'ring-2 ring-sky-300/70 bg-white/20' : ''}`}
              >
                <span className="drop-shadow-lg" title={w.title}>{meta.glyph}</span>
                <span
                  className={`absolute bottom-1 h-1 w-4 rounded-full bg-gradient-to-r from-sky-300 to-indigo-300 shadow-[0_0_8px_rgba(56,189,248,0.6)] transition ${
                    w.minimized ? 'scale-x-0 opacity-0' : 'scale-100 opacity-100'
                  } ${isActive ? 'brightness-125' : ''}`}
                />
              </button>
            );
          })}
        </div>
        <TaskbarClock />
      </div>
    </div>
  );
};

export default Taskbar;
