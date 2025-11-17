import React from 'react';
import { usePreferencesStore, type PreferencesState, type WallpaperId } from '../../store/preferencesStore';

type ToggleKey = keyof Omit<PreferencesState, 'toggle' | 'wallpaper' | 'setWallpaper'>;

const toggles: { key: ToggleKey; label: string; description: string }[] = [
  { key: 'focusAssist', label: 'Focus Assist', description: 'Silence notifications during work' },
  { key: 'darkTheme', label: 'Dark Theme', description: 'Always use the luminous dark shell' },
  { key: 'liveWallpapers', label: 'Live Wallpapers', description: 'Animate the desktop background' },
  { key: 'clock24h', label: '24h Clock', description: 'Show time in 24-hour format' },
];

const wallpapers: { id: WallpaperId; label: string; preview: string }[] = [
  { id: 'dark', label: 'Dark Gradient', preview: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950' },
  { id: 'light', label: 'Light Gradient', preview: 'bg-gradient-to-br from-sky-100 via-slate-100 to-cyan-100' },
  { id: 'ocean', label: 'Ocean Glow', preview: 'bg-gradient-to-br from-sky-400/40 via-indigo-500/30 to-cyan-500/50' },
];

const SettingsApp: React.FC = () => {
  const prefs = usePreferencesStore();

  return (
    <div className="flex h-full flex-col gap-4 bg-gradient-to-br from-white/5 via-white/0 to-sky-200/5 p-6 text-sm text-white/80">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-sky-400/25 via-indigo-500/15 to-purple-500/20 p-4 shadow-[0_16px_44px_rgba(99,102,241,0.3)]">
        <p className="text-xs uppercase tracking-[0.3em] text-white/80">Settings</p>
        <h2 className="text-2xl font-semibold text-white drop-shadow-sm">Tune your experience</h2>
        <p className="text-white/70">Pick the vibe that matches your mood.</p>
      </div>

      {/* Wallpaper selection */}
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-[0.25em] text-white/60">Wallpaper</div>
        <div className="grid grid-cols-3 gap-3">
          {wallpapers.map((w) => (
            <button
              key={w.id}
              onClick={() => prefs.setWallpaper(w.id)}
              className={`group flex flex-col items-center gap-2 rounded-2xl border px-3 py-3 transition hover:-translate-y-0.5 ${
                prefs.wallpaper === w.id ? 'border-white/40 bg-white/15' : 'border-white/10 bg-white/10'
              }`}
            >
              <div className={`h-16 w-full rounded-xl ${w.preview}`} />
              <div className="text-xs text-white/80">{w.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {toggles.map((t) => (
          <label
            key={t.key}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            <div>
              <div className="font-semibold text-white">{t.label}</div>
              <div className="text-xs text-white/60">{t.description}</div>
            </div>
            <input
              type="checkbox"
              checked={prefs[t.key]}
              onChange={() => prefs.toggle(t.key)}
              className="h-5 w-10 accent-sky-400"
            />
          </label>
        ))}
      </div>
      <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-xs text-white/70 backdrop-blur-sm">
        Preferences are stored locally and will apply instantly across all windows.
      </div>
    </div>
  );
};
export default SettingsApp;
