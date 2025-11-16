import React, { useMemo } from 'react';
import { useWindowsStore } from '../../store/windowsStore';
import StartMenuToggle from './StartMenu';
import { getAppMeta } from '../../apps/registry';

const Taskbar: React.FC = () => {
  const windows = useWindowsStore((s) => s.windows);
  const minimizeWindow = useWindowsStore((s) => s.minimizeWindow);
  const focusWindow = useWindowsStore((s) => s.focusWindow);

  return (
    <div className="fixed bottom-0 left-0 right-0 flex h-14 items-center gap-3 border-t border-white/10 bg-slate-950/60 px-4 backdrop-blur-2xl">
      <StartMenuToggle.ToggleButton />
      <div className="flex flex-1 items-center justify-center gap-2">
        {windows.map((w) => (
          <button
            key={w.id}
            onClick={() => {
              if (w.minimized) minimizeWindow(w.id);
              focusWindow(w.id);
            }}
            className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-lg text-white/80 shadow-inner transition hover:bg-white/10 ${
              w.minimized ? 'opacity-50' : ''
            }`}
            aria-label={w.title}
          >
            <span className="drop-shadow-lg">{getAppMeta(w.appId).glyph}</span>
            <span
              className={`absolute bottom-1 h-1 w-4 rounded-full bg-sky-300 transition ${
                w.minimized ? 'scale-x-0 opacity-0' : 'scale-100 opacity-100'
              }`}
            />
          </button>
        ))}
      </div>
      <TaskbarClock />
    </div>
  );
};

const TaskbarClock: React.FC = () => {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(timer);
  }, []);

  const { time, date } = useMemo(() => {
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return { time: timeString, date: dateString };
  }, [now]);

  return (
    <div className="text-right text-xs leading-tight text-white/70">
      <div>{time}</div>
      <div>{date}</div>
    </div>
  );
};

export default Taskbar;

