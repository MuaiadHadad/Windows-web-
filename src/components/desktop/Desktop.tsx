import React from 'react';
import Taskbar from '../taskbar/Taskbar';
import Window from '../window/Window';
import { useWindowsStore } from '../../store/windowsStore';
import StartMenu from '../taskbar/StartMenu';
import { APP_REGISTRY, getAppMeta } from '../../apps/registry';

const Desktop: React.FC = () => {
  const windows = useWindowsStore((s) => s.windows);

  const wallpaperStyle: React.CSSProperties = {
    backgroundImage:
      'radial-gradient(circle at 15% 25%, rgba(255,255,255,0.28), transparent 45%), ' +
      'radial-gradient(circle at 85% 15%, rgba(56,189,248,0.45), transparent 50%), ' +
      'radial-gradient(circle at 50% 120%, rgba(59,130,246,0.45), transparent 55%), ' +
      'linear-gradient(135deg, #050915 0%, #05081a 45%, #0f172a 100%)',
  };

  return (
    <div
      className="relative flex h-screen w-screen select-none flex-col overflow-hidden text-white"
      style={wallpaperStyle}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.18),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_-10%,rgba(168,85,247,0.35),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
            backgroundSize: '120px 120px',
          }}
        />
      </div>
      <div className="relative z-10 flex flex-1 flex-col p-8">
        <div className="grid w-max grid-cols-2 gap-8">
          {Object.values(APP_REGISTRY).map((meta) => (
            <DesktopIcon key={meta.id} appId={meta.id} title={meta.title} />
          ))}
        </div>
      </div>
      {windows.map((w) => (
        <Window key={w.id} win={w} />
      ))}
      <Taskbar />
      <StartMenu />
    </div>
  );
};

const DesktopIcon: React.FC<{ appId: string; title: string }> = ({ appId, title }) => {
  const openWindow = useWindowsStore((s) => s.openWindow);
  const meta = getAppMeta(appId);
  return (
    <button
      onDoubleClick={() => openWindow(appId, title)}
      className="group flex w-28 flex-col items-center gap-3 text-center text-sm"
    >
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.accent} text-3xl shadow-[0_10px_40px_rgba(15,23,42,0.5)] transition duration-300 group-hover:-translate-y-1 group-hover:scale-105`}
      >
        <span className="drop-shadow-lg">{meta.glyph}</span>
      </div>
      <div className="space-y-1">
        <span className="block font-semibold tracking-tight drop-shadow">{title}</span>
        <span className="block text-[11px] text-white/70 drop-shadow-sm">{meta.description}</span>
      </div>
    </button>
  );
};

export default Desktop;

