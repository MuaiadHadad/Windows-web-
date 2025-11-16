import React from 'react';
import { useWindowsStore } from '../../store/windowsStore';
import StartMenuToggle from './StartMenu';

const Taskbar: React.FC = () => {
  const windows = useWindowsStore((s) => s.windows);
  const minimizeWindow = useWindowsStore((s) => s.minimizeWindow);
  const focusWindow = useWindowsStore((s) => s.focusWindow);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-slate-950/80 backdrop-blur flex items-center px-2 gap-2">
      <StartMenuToggle.ToggleButton />
      {windows.map((w) => (
        <button
          key={w.id}
          onClick={() => {
            if (w.minimized) minimizeWindow(w.id);
            focusWindow(w.id);
          }}
          className={`px-3 py-1 text-sm rounded bg-slate-700 hover:bg-slate-600 ${w.minimized ? 'opacity-50' : ''}`}
        >
          {w.title}
        </button>
      ))}
    </div>
  );
};

export default Taskbar;

