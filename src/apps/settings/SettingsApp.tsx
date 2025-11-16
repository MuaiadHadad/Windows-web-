import React from 'react';
import { usePreferencesStore } from '../../store/preferencesStore';

const toggles = [
  { key: 'focusAssist', label: 'Focus Assist', description: 'Silence notifications during work' },
  { key: 'darkTheme', label: 'Dark Theme', description: 'Always use the luminous dark shell' },
  { key: 'liveWallpapers', label: 'Live Wallpapers', description: 'Animate the desktop background' },
] as const;

const SettingsApp: React.FC = () => {
  const prefs = usePreferencesStore();
  return (
    <div className="flex h-full flex-col gap-4 p-6 text-sm text-white/80">
      <div className="rounded-3xl border border-white/5 bg-gradient-to-r from-sky-400/20 via-indigo-500/10 to-purple-500/20 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/70">Settings</p>
        <h2 className="text-2xl font-semibold text-white">Tune your experience</h2>
        <p className="text-white/70">Pick the vibe that matches your mood.</p>
      </div>
      <div className="space-y-3">
        {toggles.map((t) => (
          <label
            key={t.key}
            className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3"
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
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-xs text-white/70">
        Preferences persist locally. Future: sync across devices.
      </div>
    </div>
  );
};
export default SettingsApp;
