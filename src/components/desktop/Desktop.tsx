import React, { useEffect, useRef } from 'react';
import Taskbar from '../taskbar/Taskbar';
import Window from '../window/Window';
import { useWindowsStore } from '../../store/windowsStore';
import StartMenu from '../taskbar/StartMenu';
import { APP_REGISTRY, getAppMeta } from '../../apps/registry';
import { usePreferencesStore } from '../../store/preferencesStore';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

const Desktop: React.FC = () => {
  const windows = useWindowsStore((s) => s.windows);
  const { wallpaper, darkTheme } = usePreferencesStore();
  const clearDesktopIconSelection = useUIStore((s) => s.clearDesktopIconSelection);
  const authEmail = useAuthStore((s) => s.email);
  const lastLayouts = useWindowsStore((s) => s.lastLayouts);
  const setLastLayouts = useWindowsStore((s) => s.setLastLayouts);

  const darkBg = [
    'radial-gradient(circle at 18% 24%, rgba(255,255,255,0.24), transparent 42%)',
    'radial-gradient(circle at 86% 10%, rgba(56,189,248,0.45), transparent 48%)',
    'radial-gradient(circle at 52% 118%, rgba(94,234,212,0.35), transparent 52%)',
    'linear-gradient(135deg, #050915 0%, #080e1f 45%, #0f172a 100%)',
  ].join(', ');
  const lightBg = 'linear-gradient(135deg, #dbeafe 0%, #f1f5f9 50%, #e0f2fe 100%)';
  const oceanBg = [
    'radial-gradient(circle at 20% 20%, rgba(56,189,248,0.38), transparent 45%)',
    'radial-gradient(circle at 80% 15%, rgba(14,165,233,0.30), transparent 52%)',
    'radial-gradient(circle at 50% 110%, rgba(6,182,212,0.28), transparent 50%)',
    'linear-gradient(135deg, #04121f 0%, #0a1e33 45%, #0b2741 100%)',
  ].join(', ');

  const selectedBg = wallpaper === 'dark' ? darkBg : wallpaper === 'light' ? lightBg : oceanBg;

  const wallpaperStyle: React.CSSProperties = {
    backgroundImage: selectedBg || (darkTheme ? darkBg : lightBg),
    transition: 'background 0.6s ease',
  };

  // Hydrate from backend on login
  useEffect(() => {
    let aborted = false;
    async function load() {
      if (!authEmail) return;
      try {
        const res = await fetch('/api/user/state', { headers: { 'x-user-email': authEmail } });
        if (!res.ok) return;
        const j = await res.json();
        if (aborted) return;
        const st = j.state || {};
        if (st.preferences) {
          // apply preferences
          usePreferencesStore.setState({ ...usePreferencesStore.getState(), ...st.preferences });
        }
        if (st.lastLayouts) {
          setLastLayouts(st.lastLayouts);
        }
      } catch {}
    }
    load();
    return () => { aborted = true; };
  }, [authEmail, setLastLayouts]);

  // Debounced push to backend when state changes
  const debounceRef = useRef<number | null>(null);
  const prefs = usePreferencesStore();
  useEffect(() => {
    if (!authEmail) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const state = { preferences: { focusAssist: prefs.focusAssist, darkTheme: prefs.darkTheme, liveWallpapers: prefs.liveWallpapers, clock24h: prefs.clock24h, wallpaper: prefs.wallpaper }, lastLayouts };
        await fetch('/api/user/state', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-user-email': authEmail }, body: JSON.stringify({ state }) });
      } catch {}
    }, 500);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [authEmail, prefs.focusAssist, prefs.darkTheme, prefs.liveWallpapers, prefs.clock24h, prefs.wallpaper, lastLayouts]);

  return (
    <div
      className="relative flex h-screen w-screen select-none flex-col overflow-hidden text-white"
      style={wallpaperStyle}
      onDoubleClick={(e) => {
        if (e.target === e.currentTarget) clearDesktopIconSelection();
      }}
    >
      {/* Decorative overlays */}
      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(14,165,233,0.16),transparent_48%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_-6%,rgba(168,85,247,0.28),transparent_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_90%,rgba(34,197,94,0.14),transparent_40%)]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
            backgroundSize: '120px 120px',
          }}
        />
        <div className="absolute inset-x-6 top-6 h-48 rounded-full bg-gradient-to-r from-white/10 via-white/5 to-white/0 blur-3xl" />
      </div>
      {/* Desktop icons layer (z-0 to stay below windows) */}
      <div className="relative z-0 flex flex-1 flex-col p-8">
        <div className="grid w-max grid-cols-2 gap-8 drop-shadow-[0_12px_50px_rgba(0,0,0,0.35)]">
          {Object.values(APP_REGISTRY).map((meta) => (
            <DesktopIcon key={meta.id} appId={meta.id} title={meta.title} />
          ))}
        </div>
      </div>

      {/* Windows render above icons via inline zIndex */}
      {windows.map((w) => (
        <Window key={w.id} win={w} />
      ))}

      {/* Taskbar & StartMenu have their own z-index */}
      <Taskbar />
      <StartMenu />
    </div>
  );
};

const DesktopIcon: React.FC<{ appId: string; title: string }> = ({ appId, title }) => {
  const openWindow = useWindowsStore((s) => s.openWindow);
  const meta = getAppMeta(appId);
  const selectedId = useUIStore((s) => s.selectedDesktopIconId);
  const selectIcon = useUIStore((s) => s.selectDesktopIcon);
  const isSelected = selectedId === appId;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        selectIcon(appId);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        openWindow(appId, title);
      }}
      aria-label={title}
      aria-pressed={isSelected}
      className={`group relative flex w-28 flex-col items-center gap-3 rounded-xl px-2 py-3 text-center text-sm outline-none transition ${
        isSelected
          ? 'ring-2 ring-sky-300/70 bg-white/5 shadow-[0_0_0_3px_rgba(255,255,255,0.15)]'
          : 'ring-1 ring-transparent hover:ring-sky-200/50 hover:bg-white/5'
      } focus-visible:ring-2 focus-visible:ring-sky-400/70`}
    >
      <div className={`absolute inset-0 -z-10 rounded-3xl ${meta.aura} opacity-0 blur-2xl transition duration-500 group-hover:opacity-70 ${isSelected ? 'opacity-60' : ''}`} />
      <div
        className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.accent} text-3xl shadow-[0_14px_40px_rgba(15,23,42,0.45)] ring-1 ring-white/40 transition duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-[0_18px_50px_rgba(14,165,233,0.35)] ${
          isSelected ? 'scale-105 ring-2 ring-sky-300/60' : ''
        }`}
      >
        <span className="drop-shadow-lg">{meta.glyph}</span>
        <span
          className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/40 via-transparent to-transparent opacity-0 mix-blend-overlay transition duration-500 group-hover:opacity-40 ${
            isSelected ? 'opacity-50' : ''
          }`}
          aria-hidden
        />
      </div>
      <div className="space-y-1 text-white">
        <span className={`block font-semibold tracking-tight drop-shadow ${isSelected ? 'text-sky-200' : ''}`}>{title}</span>
        <span className="block text-[11px] text-white/60 drop-shadow-sm line-clamp-2" title={meta.description}>
          {meta.description}
        </span>
      </div>
    </button>
  );
};

export default Desktop;
