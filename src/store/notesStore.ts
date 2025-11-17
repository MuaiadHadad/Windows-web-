import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotesState {
  text: string;
  setText: (_text: string) => void;
  reset: () => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      text: '',
      setText: (text) => set({ text }),
      reset: () => set({ text: '' }),
    }),
    { name: 'winweb-notes' }
  )
);

