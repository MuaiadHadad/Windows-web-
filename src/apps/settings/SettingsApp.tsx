import React, { useState } from 'react';
import { usePreferencesStore, type PreferencesState, type WallpaperId } from '../../store/preferencesStore';

type ToggleKey = keyof Omit<PreferencesState, 'toggle' | 'wallpaper' | 'setWallpaper' | 'toggleTheme'>;

const wallpapers: { id: WallpaperId; label: string; preview: string }[] = [
  { id: 'dark', label: 'Gradiente Escuro', preview: 'bg-gradient-to-br from-purple-900 via-slate-900 to-slate-950' },
  { id: 'light', label: 'Gradiente Claro', preview: 'bg-gradient-to-br from-blue-100 via-slate-100 to-blue-50' },
  { id: 'ocean', label: 'Brilho Oceano', preview: 'bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900' },
];

interface SidebarItemProps { active?: boolean; icon: string; label: string; onClick: () => void; }
const SidebarItem: React.FC<SidebarItemProps> = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition text-left ${
      active
        ? 'bg-white/10 text-white ring-1 ring-white/20'
        : 'text-white/70 hover:bg-white/5 hover:text-white'
    }`}
  >
    <span className="text-base">{icon}</span>
    <span className="truncate">{label}</span>
  </button>
);

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-5">
    <div className="text-[10px] uppercase tracking-[0.28em] text-violet-200/70 font-semibold">{title}</div>
    {subtitle && <p className="mt-1 text-xs text-white/60">{subtitle}</p>}
  </div>
);

const SettingsApp: React.FC = () => {
  const darkTheme = usePreferencesStore((s) => s.darkTheme);
  const wallpaper = usePreferencesStore((s) => s.wallpaper);
  const toggleTheme = usePreferencesStore((s) => s.toggleTheme);
  const setWallpaper = usePreferencesStore((s) => s.setWallpaper);
  const setCustomWallpaper = usePreferencesStore((s) => s.setCustomWallpaper);
  const clearCustomWallpaper = usePreferencesStore((s) => s.clearCustomWallpaper);
  const toggle = usePreferencesStore((s) => s.toggle);
  const focusAssist = usePreferencesStore((s) => s.focusAssist);
  const liveWallpapers = usePreferencesStore((s) => s.liveWallpapers);
  const clock24h = usePreferencesStore((s) => s.clock24h);

  const [tab, setTab] = useState<'tema' | 'wallpaper' | 'notificacoes' | 'hora'>('tema');

  // Derived summary
  const summary = [
    darkTheme ? 'Tema Escuro' : 'Tema Claro',
    `Wallpaper: ${wallpaper}`,
    liveWallpapers ? 'Wallpaper Animado' : 'Wallpaper Estático',
    clock24h ? 'Relógio 24h' : 'Relógio 12h',
    focusAssist ? 'Assistente de Foco ON' : 'Assistente de Foco OFF',
  ];

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-900/70 via-slate-950/60 to-slate-950/80 text-white">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-white/10 p-4 flex flex-col gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-xs uppercase tracking-widest text-white/60">Definições</div>
          <div className="text-sm font-semibold">Personalização</div>
        </div>
        <div className="space-y-1">
          <SidebarItem active={tab === 'tema'} icon="🎨" label="Tema" onClick={() => setTab('tema')} />
          <SidebarItem active={tab === 'wallpaper'} icon="🖼️" label="Papéis de Parede" onClick={() => setTab('wallpaper')} />
          <SidebarItem active={tab === 'notificacoes'} icon="🔔" label="Notificações" onClick={() => setTab('notificacoes')} />
          <SidebarItem active={tab === 'hora'} icon="⏱️" label="Hora e Idioma" onClick={() => setTab('hora')} />
        </div>
        <div className="mt-auto space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-white/50">Resumo</div>
          <ul className="space-y-1 text-xs text-white/70">
            {summary.map((s) => (
              <li key={s} className="truncate">• {s}</li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6">
        {tab === 'tema' && (
          <div>
            <SectionHeader title="Tema" subtitle="Alternar modo claro/escuro e comportamento" />
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/20 flex items-center justify-center text-2xl">
                  {darkTheme ? '🌙' : '☀️'}
                </div>
                <div>
                  <div className="text-base font-semibold">Modo {darkTheme ? 'Escuro' : 'Claro'}</div>
                  <div className="text-xs text-white/60">Alterna entre tema escuro e claro</div>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative h-8 w-16 rounded-full border-2 transition-all ${
                  darkTheme
                    ? 'border-violet-400/60 bg-gradient-to-r from-violet-500/40 to-fuchsia-500/30'
                    : 'border-amber-400/60 bg-gradient-to-r from-amber-500/40 to-orange-500/30'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-lg transition-all duration-300 ${
                    darkTheme ? 'left-[34px]' : 'left-1'
                  }`}
                />
              </button>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white/90">Papéis de Parede Animados</div>
                <div className="text-xs text-white/60">Ativa animação suave nos gradientes do desktop</div>
              </div>
              <input
                type="checkbox"
                checked={liveWallpapers}
                onChange={() => toggle('liveWallpapers')}
                className="h-5 w-5 accent-violet-500"
              />
            </div>
          </div>
        )}

        {tab === 'wallpaper' && (
          <div>
            <SectionHeader title="Papéis de Parede" subtitle="Escolha o visual de fundo" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {wallpapers.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setWallpaper(w.id)}
                  className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-3 transition-all ${
                    wallpaper === w.id
                      ? 'border-violet-400/80 bg-white/10 shadow-[0_0_30px_rgba(139,92,246,0.4)]'
                      : 'border-white/15 bg-white/5 hover:border-violet-400/40'
                  }`}
                >
                  <div className={`h-20 w-full rounded-xl ${w.preview}`} />
                  <div className="text-xs font-medium text-white/90">{w.label}</div>
                  {wallpaper === w.id && (
                    <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-violet-500 text-white text-xs font-bold grid place-items-center">✓</div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom wallpaper URL */}
            <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-widest text-white/60">Imagem personalizada</div>
              <CustomWallpaperForm
                currentUrl={usePreferencesStore.getState().customWallpaperUrl || ''}
                onApply={(url) => setCustomWallpaper(url)}
                onClear={clearCustomWallpaper}
                isActive={wallpaper === 'custom'}
              />
            </div>
          </div>
        )}

        {tab === 'notificacoes' && (
          <div>
            <SectionHeader title="Notificações" subtitle="Controle interrupções" />
            <div className="space-y-3">
              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <div className="font-semibold">Assistente de Foco</div>
                  <div className="text-xs text-white/60">Silenciar notificações durante o trabalho</div>
                </div>
                <input
                  type="checkbox"
                  checked={focusAssist}
                  onChange={() => toggle('focusAssist')}
                  className="h-5 w-5 accent-violet-500"
                />
              </label>
            </div>
          </div>
        )}

        {tab === 'hora' && (
          <div>
            <SectionHeader title="Hora e Idioma" subtitle="Formato de relógio" />
            <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <div className="font-semibold">Relógio 24h</div>
                <div className="text-xs text-white/60">Alterna entre formato 12h e 24h</div>
              </div>
              <input
                type="checkbox"
                checked={clock24h}
                onChange={() => toggle('clock24h')}
                className="h-5 w-5 accent-violet-500"
              />
            </label>
          </div>
        )}
      </main>
    </div>
  );
};
export default SettingsApp;

// Inline small component for URL input
const CustomWallpaperForm: React.FC<{ currentUrl: string; onApply: (url: string) => void; onClear: () => void; isActive: boolean }> = ({ currentUrl, onApply, onClear, isActive }) => {
  const [url, setUrl] = useState(currentUrl);
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://exemplo.com/imagem.jpg"
        className="flex-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:border-violet-400/60"
      />
      <div className="flex gap-2">
        <button
          onClick={() => onApply(url)}
          className="rounded-xl border border-violet-400/40 bg-violet-500/20 px-3 py-2 text-sm hover:bg-violet-500/30"
        >
          Aplicar
        </button>
        <button
          onClick={onClear}
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
        >
          Limpar
        </button>
      </div>
      {isActive && (
        <span className="text-xs text-white/60">Wallpaper atual: imagem personalizada</span>
      )}
    </div>
  );
};
