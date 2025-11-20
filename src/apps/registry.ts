import { IconName } from '../components/icons/Icons';

export type AppId = 'notes' | 'files' | 'settings';

interface AppMeta {
  id: AppId;
  title: string;
  description: string;
  accent: string;
  icon: IconName; // strict icon name
  aura: string;
}

export const APP_REGISTRY: Record<AppId, AppMeta> = {
  notes: {
    id: 'notes',
    title: 'Notes',
    description: 'Capture quick thoughts',
    accent: 'from-amber-200 via-amber-300 to-orange-400',
    icon: 'notes',
    aura: 'bg-amber-300/30',
  },
  files: {
    id: 'files',
    title: 'Files',
    description: 'Browse documents',
    accent: 'from-sky-200 via-sky-300 to-blue-500',
    icon: 'files',
    aura: 'bg-sky-300/30',
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    description: 'Fine-tune the system',
    accent: 'from-purple-200 via-fuchsia-300 to-violet-500',
    icon: 'settings',
    aura: 'bg-violet-300/30',
  },
};

export const getAppMeta = (appId: string): AppMeta => {
  const fallback: AppMeta = {
    id: 'notes',
    title: 'App',
    description: 'Open application',
    accent: 'from-white/70 to-white/20',
    icon: 'files',
    aura: 'bg-white/20',
  };

  return APP_REGISTRY[appId as AppId] ?? fallback;
};
