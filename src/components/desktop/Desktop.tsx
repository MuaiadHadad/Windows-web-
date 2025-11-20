import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Taskbar from '../taskbar/Taskbar';
import Window from '../window/Window';
import { useWindowsStore } from '../../store/windowsStore';
import StartMenu from '../taskbar/StartMenu';
import { APP_REGISTRY } from '../../apps/registry';
import { usePreferencesStore } from '../../store/preferencesStore';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useNotesStore } from '../../store/notesStore';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { DesktopContextMenu } from './DesktopContextMenu';
import { DesktopIcon } from './DesktopIcon';

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

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // Only show on desktop background, not on icons or windows
    if (e.target === e.currentTarget) {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  }, []);

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
      onContextMenu={handleContextMenu}
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
      <div className="relative z-0 flex-1 pointer-events-none">
        {Object.values(APP_REGISTRY).map((meta, index) => (
          <DesktopIcon key={meta.id} appId={meta.id} title={meta.title} index={index} />
        ))}
      </div>

      {/* Windows render above icons */}
      {windows.map((w) => (
        <Window key={w.id} win={w} />
      ))}

      {/* Taskbar & StartMenu */}
      <Taskbar />
      <StartMenu />

      {/* Desktop Context Menu */}
      <DesktopContextMenu
        x={contextMenu?.x ?? 0}
        y={contextMenu?.y ?? 0}
        isOpen={!!contextMenu}
        onClose={() => setContextMenu(null)}
      />
    </div>
  );
};

export default Desktop;


