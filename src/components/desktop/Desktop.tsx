import React from 'react';
import Taskbar from '../taskbar/Taskbar';
import Window from '../window/Window';
import { useWindowsStore } from '../../store/windowsStore';
import StartMenu from '../taskbar/StartMenu';
import { APP_REGISTRY, getAppMeta } from '../../apps/registry';

const Desktop: React.FC = () => {
  const windows = useWindowsStore((s) => s.windows);
  const { darkTheme, liveWallpapers } = usePreferencesStore();

  const wallpaperStyle: React.CSSProperties = {
    backgroundImage: darkTheme
      ? [
          'radial-gradient(circle at 15% 25%, rgba(255,255,255,0.28), transparent 45%)',
          'radial-gradient(circle at 85% 15%, rgba(56,189,248,0.35), transparent 55%)',
          'radial-gradient(circle at 50% 120%, rgba(59,130,246,0.35), transparent 55%)',
          'linear-gradient(135deg, #050915 0%, #05081a 45%, #0f172a 100%)',
        ].join(', ')
      : 'linear-gradient(135deg, #dbeafe 0%, #f1f5f9 50%, #e0f2fe 100%)',
    transition: 'background 0.6s ease',
  };

  const wallpaperStyle: React.CSSProperties = {
    backgroundImage:
      'radial-gradient(circle at 18% 24%, rgba(255,255,255,0.24), transparent 42%), ' +
      'radial-gradient(circle at 86% 10%, rgba(56,189,248,0.45), transparent 48%), ' +
      'radial-gradient(circle at 52% 118%, rgba(94,234,212,0.35), transparent 52%), ' +
      'linear-gradient(135deg, #050915 0%, #080e1f 45%, #0f172a 100%)',
  };

  return (
    <div
      className="relative flex h-screen w-screen select-none flex-col overflow-hidden text-white"
      style={wallpaperStyle}
    >
      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(14,165,233,0.16),transparent_48%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_-6%,rgba(168,85,247,0.28),transparent_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_90%,rgba(34,197,94,0.14),transparent_40%)]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
            backgroundSize: '120px 120px',
          }}
        />
        <div className="absolute inset-x-6 top-6 h-48 rounded-full bg-gradient-to-r from-white/10 via-white/5 to-white/0 blur-3xl" />
      </div>
      <div className="relative z-10 flex flex-1 flex-col p-8">
        <div className="grid w-max grid-cols-2 gap-8 drop-shadow-[0_12px_50px_rgba(0,0,0,0.35)]">
          {Object.values(APP_REGISTRY).map((meta) => (
            <DesktopIcon key={meta.id} appId={meta.id} title={meta.title} />
          ))}
        </div>
      </div>

      {/* Windows */}
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
      className="group relative flex w-28 flex-col items-center gap-3 text-center text-sm"
    >
      <div className={`absolute inset-0 -z-10 rounded-3xl ${meta.aura} opacity-0 blur-2xl transition duration-500 group-hover:opacity-70`} />
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.accent} text-3xl shadow-[0_14px_40px_rgba(15,23,42,0.45)] ring-1 ring-white/40 transition duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-[0_18px_50px_rgba(14,165,233,0.35)]`}
      >
        <span className="drop-shadow-lg">{meta.glyph}</span>
      </div>
      <div className="space-y-1 text-white">
        <span className="block font-semibold tracking-tight drop-shadow">{title}</span>
        <span className="block text-[11px] text-white/70 drop-shadow-sm">{meta.description}</span>
      </div>
    </button>
  );
};

export default Desktop;
