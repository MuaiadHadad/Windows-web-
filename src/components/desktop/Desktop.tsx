import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Taskbar from '../taskbar/Taskbar';
import Window from '../window/Window';
import { useWindowsStore } from '../../store/windowsStore';
import StartMenu from '../taskbar/StartMenu';
import { APP_REGISTRY, getAppMeta } from '../../apps/registry';
import { usePreferencesStore } from '../../store/preferencesStore';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useNotesStore } from '../../store/notesStore';
import { Icon } from '../icons/Icons';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

const Desktop: React.FC = () => {
  const windows = useWindowsStore((s) => s.windows);
  const wallpaper = usePreferencesStore((s) => s.wallpaper);
  const darkTheme = usePreferencesStore((s) => s.darkTheme);
  const liveWallpapers = usePreferencesStore((s) => s.liveWallpapers);
  const customWallpaperUrl = usePreferencesStore((s) => s.customWallpaperUrl);
  const clearDesktopIconSelection = useUIStore((s) => s.clearDesktopIconSelection);
  const authEmail = useAuthStore((s) => s.email);
  const lastLayouts = useWindowsStore((s) => s.lastLayouts);
  const setLastLayouts = useWindowsStore((s) => s.setLastLayouts);
  const notesText = useNotesStore((s) => s.text);
  const setNotesText = useNotesStore((s) => s.setText);

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  // Keep <html> class in sync with theme immediately (avoids flash)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', !!darkTheme);
    }
  }, [darkTheme]);

  // Futuristic gradient backgrounds
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!liveWallpapers) return;
    let raf = 0;
    const start = performance.now();
    const loop = () => {
      const t = performance.now() - start;
      setTick(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [liveWallpapers]);

  const ease = (x: number) => Math.sin(x);
  const dx = liveWallpapers ? ease(tick / 3500) * 8 : 0;
  const dy = liveWallpapers ? ease(tick / 4200) * 8 : 0;

  const wallpaperBackground = useMemo(() => {
    const darkBg = `radial-gradient(circle at ${20 + dx}% ${30 + dy}%, rgba(88, 28, 135, 0.4) 0%, transparent 50%), radial-gradient(circle at ${80 - dx}% ${70 - dy}%, rgba(59, 130, 246, 0.35) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 70%), linear-gradient(135deg, #0a0a1f 0%, #1a0d2e 25%, #0f0920 50%, #1a1042 75%, #0d0820 100%)`;
    const lightBg = `radial-gradient(circle at ${30 + dx}% ${40 + dy}%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at ${70 - dx}% ${60 - dy}%, rgba(59, 130, 246, 0.2) 0%, transparent 50%), linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 50%, #dbeafe 100%)`;
    const oceanBg = `radial-gradient(circle at ${25 + dx}% ${25 + dy}%, rgba(6, 182, 212, 0.4) 0%, transparent 50%), radial-gradient(circle at ${75 - dx}% ${75 - dy}%, rgba(14, 165, 233, 0.35) 0%, transparent 50%), radial-gradient(circle at 50% 100%, rgba(59, 130, 246, 0.3) 0%, transparent 60%), linear-gradient(135deg, #0c1222 0%, #0a1628 30%, #0d1b2a 60%, #0f1419 100%)`;

    return wallpaper === 'dark' ? darkBg : wallpaper === 'light' ? lightBg : wallpaper === 'ocean' ? oceanBg : (darkTheme ? darkBg : lightBg);
  }, [wallpaper, darkTheme, dx, dy]);

  const wallpaperStyle: React.CSSProperties = useMemo(() => {
    if (customWallpaperUrl && wallpaper === 'custom') {
      return {
        backgroundImage: `url(${customWallpaperUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
    return {
      backgroundImage: wallpaperBackground,
      transition: liveWallpapers ? undefined : 'background 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      willChange: liveWallpapers ? 'background' : undefined,
    };
  }, [customWallpaperUrl, wallpaper, wallpaperBackground, liveWallpapers]);

  // Hydrate from backend on login
  useEffect(() => {
    let aborted = false;
    async function load() {
      if (!authEmail) return;
      // Take a snapshot of current preferences to detect user changes during fetch
      const snap = ((s: any) => ({
        focusAssist: s.focusAssist,
        darkTheme: s.darkTheme,
        liveWallpapers: s.liveWallpapers,
        clock24h: s.clock24h,
        wallpaper: s.wallpaper,
        customWallpaperUrl: s.customWallpaperUrl,
      }))(usePreferencesStore.getState());
      try {
        const res = await fetch('/api/user/state', { headers: { 'x-user-email': authEmail } });
        if (!res.ok) return;
        const j = await res.json();
        if (aborted) return;
        const st = j.state || {};
        if (st.preferences) {
          // Only apply remote preferences if user didn't change local prefs during fetch
          const cur = ((s: any) => ({
            focusAssist: s.focusAssist,
            darkTheme: s.darkTheme,
            liveWallpapers: s.liveWallpapers,
            clock24h: s.clock24h,
            wallpaper: s.wallpaper,
            customWallpaperUrl: s.customWallpaperUrl,
          }))(usePreferencesStore.getState());
          const same = Object.keys(snap).every((k) => (snap as any)[k] === (cur as any)[k]);
          if (same) {
            usePreferencesStore.setState({ ...usePreferencesStore.getState(), ...st.preferences });
          }
        }
        if (st.lastLayouts) {
          setLastLayouts(st.lastLayouts);
        }
        if (typeof st.notes === 'string') {
          setNotesText(st.notes);
        }
      } catch {}
    }
    load();
    return () => { aborted = true; };
  }, [authEmail, setLastLayouts, setNotesText]);

  // Debounced push to backend when state changes
  const debounceRef = useRef<number | null>(null);
  const prefs = usePreferencesStore();
  useEffect(() => {
    if (!authEmail) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const state = { preferences: { focusAssist: prefs.focusAssist, darkTheme: prefs.darkTheme, liveWallpapers: prefs.liveWallpapers, clock24h: prefs.clock24h, wallpaper: prefs.wallpaper, customWallpaperUrl: prefs.customWallpaperUrl }, lastLayouts, notes: notesText };
        await fetch('/api/user/state', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-user-email': authEmail }, body: JSON.stringify({ state }) });
      } catch {}
    }, 500);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [authEmail, prefs.focusAssist, prefs.darkTheme, prefs.liveWallpapers, prefs.clock24h, prefs.wallpaper, prefs.customWallpaperUrl, lastLayouts, notesText]);


  // Show or hide overlays based on wallpaper settings
  const showOverlays = !(customWallpaperUrl && wallpaper === 'custom');
  return (
    <div
      className={`relative flex h-screen w-screen select-none flex-col overflow-hidden ${darkTheme ? 'text-white' : 'text-slate-800'} transition-colors duration-500`}
      style={wallpaperStyle}
      onDoubleClick={(e) => {
        if (e.target === e.currentTarget) clearDesktopIconSelection();
      }}
    >
      {/* Advanced holographic overlays - adjust opacity based on theme */}
      {showOverlays && (
        <div className={`pointer-events-none absolute inset-0 ${darkTheme ? 'opacity-40' : 'opacity-20'}`} aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_70%)]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 2px, rgba(255,255,255,0.03) 3px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 2px, rgba(255,255,255,0.03) 3px)',
              backgroundSize: '100px 100px',
            }}
          />
          <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-violet-500/10 via-transparent to-transparent blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent blur-3xl" />
        </div>
      )}

      {/* Animated grid overlay */}
      {showOverlays && (
        <div className="pointer-events-none absolute inset-0 opacity-[0.015]" aria-hidden>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
        </div>
      )}

      {/* Desktop icons layer */}
      <div className="relative z-0 flex flex-1 flex-col p-8">
        <div className="grid w-max grid-cols-2 gap-8 drop-shadow-[0_20px_80px_rgba(139,92,246,0.4)]">
          {Object.values(APP_REGISTRY).map((meta) => (
            <DesktopIcon key={meta.id} appId={meta.id} title={meta.title} />
          ))}
        </div>
      </div>

      {/* Windows render above icons */}
      {windows.map((w) => (
        <Window key={w.id} win={w} />
      ))}

      {/* Taskbar & StartMenu */}
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
      className={`group relative flex w-32 flex-col items-center gap-3 rounded-2xl px-3 py-4 text-center text-sm outline-none transition-all duration-300 ${
        isSelected
          ? 'bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-cyan-500/20 ring-2 ring-violet-400/60 shadow-[0_0_30px_rgba(139,92,246,0.4)]'
          : 'hover:bg-white/5 ring-1 ring-transparent hover:ring-violet-300/30'
      } backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-violet-400`}
    >
      {/* Holographic aura */}
      <div className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br ${meta.aura.replace('bg-', 'from-')} to-transparent opacity-0 blur-3xl transition-all duration-500 group-hover:opacity-80 ${isSelected ? 'opacity-70' : ''}`} />

      {/* Icon container with advanced styling */}
      <div
        className={`relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${meta.accent} text-4xl shadow-[0_20px_60px_rgba(139,92,246,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] ring-1 ring-white/30 transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-110 group-hover:shadow-[0_30px_80px_rgba(139,92,246,0.6),0_0_40px_rgba(167,139,250,0.4)] ${
          isSelected ? 'scale-105 ring-2 ring-violet-300/80 shadow-[0_25px_70px_rgba(139,92,246,0.6)]' : ''
        }`}
      >
        <span className="relative z-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"><Icon name={meta.icon as any} /></span>
        {/* Glass reflection */}
        <span
          className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-white/10 to-transparent opacity-0 mix-blend-overlay transition-all duration-500 group-hover:opacity-60 ${
            isSelected ? 'opacity-50' : ''
          }`}
          aria-hidden
        />
        {/* Animated border glow */}
        <span
          className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-40 ${
            isSelected ? 'opacity-30 animate-pulse' : ''
          }`}
          aria-hidden
        />
      </div>

      {/* Text with enhanced styling */}
      <div className="space-y-1 text-white">
        <span className={`block font-semibold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-colors ${isSelected ? 'text-violet-200' : 'group-hover:text-violet-100'}`}>
          {title}
        </span>
        <span className="block text-[10px] text-white/60 drop-shadow-sm line-clamp-2 font-light" title={meta.description}>
          {meta.description}
        </span>
      </div>
    </button>
  );
};

export default Desktop;
