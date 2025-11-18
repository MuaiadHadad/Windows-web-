import React from 'react';
import { usePreferencesStore, type PreferencesState, type WallpaperId } from '../../store/preferencesStore';

type ToggleKey = keyof Omit<PreferencesState, 'toggle' | 'wallpaper' | 'setWallpaper' | 'toggleTheme'>;

const toggles: { key: ToggleKey; label: string; description: string }[] = [
  { key: 'focusAssist', label: 'Focus Assist', description: 'Silence notifications during work' },
  { key: 'liveWallpapers', label: 'Live Wallpapers', description: 'Animate the desktop background' },
  { key: 'clock24h', label: '24h Clock', description: 'Show time in 24-hour format' },
];

const wallpapers: { id: WallpaperId; label: string; preview: string }[] = [
  { id: 'dark', label: 'Dark Gradient', preview: 'bg-gradient-to-br from-purple-900 via-slate-900 to-slate-950' },
  { id: 'light', label: 'Light Gradient', preview: 'bg-gradient-to-br from-blue-100 via-slate-100 to-blue-50' },
  { id: 'ocean', label: 'Ocean Glow', preview: 'bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900' },
];

const SettingsApp: React.FC = () => {
  const darkTheme = usePreferencesStore((s) => s.darkTheme);
  const wallpaper = usePreferencesStore((s) => s.wallpaper);
  const toggleTheme = usePreferencesStore((s) => s.toggleTheme);
  const setWallpaper = usePreferencesStore((s) => s.setWallpaper);
  const toggle = usePreferencesStore((s) => s.toggle);
  const focusAssist = usePreferencesStore((s) => s.focusAssist);
  const liveWallpapers = usePreferencesStore((s) => s.liveWallpapers);
  const clock24h = usePreferencesStore((s) => s.clock24h);

  return (
    <div className="flex h-full flex-col gap-6 bg-gradient-to-br from-slate-900/50 via-slate-950/30 to-slate-900/50 p-6 text-sm text-white overflow-y-auto">
      {/* Header */}
      <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/15 to-cyan-500/20 p-6 shadow-[0_20px_60px_rgba(139,92,246,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-sm">
        <p className="text-[10px] uppercase tracking-[0.3em] text-violet-300/80 font-semibold">Configurações</p>
        <h2 className="text-3xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] mt-1">Personalização</h2>
        <p className="text-white/70 mt-2">Ajuste o sistema ao seu estilo.</p>
      </div>

      {/* Theme Toggle Section */}
      <div className="space-y-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-violet-300/70 font-semibold">
          Tema (Current: {darkTheme ? 'DARK' : 'LIGHT'})
        </div>
        <div className="flex items-center justify-between p-5 rounded-2xl border border-white/15 bg-gradient-to-r from-white/5 to-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/20 flex items-center justify-center text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(251,191,36,0.3)]">
              {darkTheme ? '🌙' : '☀️'}
            </div>
            <div>
              <div className="text-base font-semibold text-white/95">Modo {darkTheme ? 'Escuro' : 'Claro'}</div>
              <div className="text-xs text-white/60">Alterna entre tema escuro e claro</div>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative h-8 w-14 rounded-full border-2 transition-all ${
              darkTheme
                ? 'border-violet-400/60 bg-gradient-to-r from-violet-500/40 to-fuchsia-500/30 shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                : 'border-amber-400/60 bg-gradient-to-r from-amber-500/40 to-orange-500/30 shadow-[0_0_20px_rgba(251,191,36,0.4)]'
            }`}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-lg transition-all duration-300 ${
                darkTheme ? 'left-[26px]' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Wallpaper selection */}
      <div className="space-y-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-violet-300/70 font-semibold">Papel de Parede</div>
        <div className="grid grid-cols-3 gap-4">
          {wallpapers.map((w) => (
            <button
              key={w.id}
              onClick={() => {
                console.log('🖼️ Changing wallpaper from', wallpaper, 'to', w.id);
                setWallpaper(w.id);
                setTimeout(() => {
                  console.log('🖼️ Wallpaper should now be:', w.id);
                }, 100);
              }}
              className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-3 transition-all hover:-translate-y-1 ${
                wallpaper === w.id
                  ? 'border-violet-400/80 bg-gradient-to-br from-white/10 to-white/5 shadow-[0_0_30px_rgba(139,92,246,0.5)]'
                  : 'border-white/15 bg-white/5 hover:border-violet-400/40 hover:shadow-[0_10px_30px_rgba(139,92,246,0.2)]'
              }`}
            >
              {/* Preview */}
              <div
                className={`h-20 w-full rounded-xl ${w.preview} shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] relative overflow-hidden`}
              >
                {wallpaper === w.id && (
                  <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_15px_rgba(139,92,246,0.8)]">
                    ✓
                  </div>
                )}
              </div>
              <div className="text-xs font-medium text-white/90">{w.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Other toggles */}
      <div className="space-y-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-violet-300/70 font-semibold">Outras Opções</div>
        <div className="space-y-3">
          {toggles.map((t) => {
            const value = t.key === 'focusAssist' ? focusAssist : t.key === 'liveWallpapers' ? liveWallpapers : clock24h;
            return (
              <label
                key={t.key}
                className="flex items-center justify-between rounded-2xl border border-white/15 bg-gradient-to-r from-white/5 to-white/10 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] cursor-pointer transition-all hover:border-violet-400/40 hover:shadow-[0_10px_30px_rgba(139,92,246,0.2)]"
              >
                <div>
                  <div className="font-semibold text-white/95">{t.label}</div>
                  <div className="text-xs text-white/60">{t.description}</div>
                </div>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggle(t.key)}
                  className="h-5 w-5 accent-violet-500 rounded"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Info footer */}
      <div className="rounded-2xl border border-dashed border-violet-400/30 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 p-4 text-xs text-violet-200/80 backdrop-blur-sm">
        💡 As preferências são guardadas localmente e sincronizadas com o servidor quando autenticado.
      </div>
    </div>
  );
};
export default SettingsApp;
