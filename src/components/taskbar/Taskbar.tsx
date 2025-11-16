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
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-slate-950/80 backdrop-blur flex items-center px-2 gap-2 border-t border-white/10">
      <StartMenuToggle.ToggleButton />
      <div className="flex flex-1 items-center gap-2 overflow-x-auto">
        {windows.map((w) => {
          const meta = getAppMeta(w.appId);
          return (
            <button
              key={w.id}
              onClick={() => {
                if (w.minimized) minimizeWindow(w.id);
                focusWindow(w.id);
              }}
              aria-label={w.title}
              className={`group relative flex items-center gap-2 rounded px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 transition ${
                w.minimized ? 'opacity-50' : ''
              }`}
            >
              <span className="text-lg drop-shadow-lg">{meta.glyph}</span>
              <span>{w.title}</span>
              <span
                className={`absolute -bottom-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-sky-300/60 transition-opacity ${
                  w.minimized ? 'opacity-0' : 'opacity-100'
                }`}
              />
            </button>
          );
        })}
      </div>
      <TaskbarClock />
    </div>
  );
};

export default Taskbar;
