import React from 'react';
import { usePreferencesStore } from '../../store/preferencesStore';

const toggles = [
  { key: 'focusAssist', label: 'Focus Assist', description: 'Silence notifications during work' },
  { key: 'darkTheme', label: 'Dark Theme', description: 'Always use the luminous dark shell' },
  { key: 'liveWallpapers', label: 'Live Wallpapers', description: 'Animate the desktop background' },
] as const;

const toggles = [
  { label: 'Focus Assist', description: 'Silence notifications during work' },
  { label: 'Dark Theme', description: 'Always use the luminous dark shell' },
  { label: 'Live Wallpapers', description: 'Animate the desktop background' },
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
      <div className="space-y-3">
        {toggles.map((toggle, index) => (
          <label
            key={toggle.label}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            <div>
              <div className="font-semibold text-white">{toggle.label}</div>
              <div className="text-xs text-white/60">{toggle.description}</div>
            </div>
            <input type="checkbox" defaultChecked={index % 2 === 0} className="h-5 w-10 accent-sky-400" />
          </label>
        ))}
      </div>
      <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-xs text-white/70 backdrop-blur-sm">
        Looking for more? System preferences sync across every window.
      </div>
    </div>
  );
};
export default SettingsApp;
