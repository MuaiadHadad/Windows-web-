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

  return (
    <div className="pointer-events-none fixed bottom-3 left-0 right-0 flex justify-center z-[1000]">{/* z-index elevado */}
      <div className="pointer-events-auto flex h-14 w-[min(900px,calc(100%-32px))] items-center gap-3 rounded-[22px] border border-white/12 bg-white/12 px-4 shadow-[0_18px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <StartMenuToggle.ToggleButton />
        <div className="flex flex-1 items-center justify-center gap-2">
          {windows.map((w) => (
            <button
              key={w.id}
              onClick={() => {
                if (w.minimized) {
                  minimizeWindow(w.id);
                  focusWindow(w.id);
                } else {
                  minimizeWindow(w.id);
                }
              }}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition hover:bg-white/20 ${
                w.minimized ? 'opacity-60' : ''
              }`}
              aria-label={w.title}
            >
              <span className="drop-shadow-lg">{getAppMeta(w.appId).glyph}</span>
              <span
                className={`absolute bottom-1 h-1 w-4 rounded-full bg-gradient-to-r from-sky-300 to-indigo-300 shadow-[0_0_8px_rgba(56,189,248,0.6)] transition ${
                  w.minimized ? 'scale-x-0 opacity-0' : 'scale-100 opacity-100'
                }`}
              />
            </button>
          ))}
        </div>
        <TaskbarClock />
      </div>
    </div>
  );
};

export default Taskbar;
