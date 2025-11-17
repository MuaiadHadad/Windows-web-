import React from 'react';
import { useNotesStore } from '../../store/notesStore';

const NotesApp: React.FC = () => {
  const text = useNotesStore((s) => s.text);
  const setText = useNotesStore((s) => s.setText);
  return (
    <div className="flex h-full flex-col gap-4 bg-gradient-to-br from-white/5 via-white/0 to-amber-100/5 p-6 text-sm text-white/80">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-amber-200/25 via-amber-100/15 to-orange-500/20 p-4 text-slate-950 shadow-[0_16px_40px_rgba(251,191,36,0.25)]">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-900/60">Notebook</p>
        <h2 className="text-2xl font-semibold text-slate-900 drop-shadow-sm">Capture your thoughts</h2>
        <p className="text-sm text-slate-900/80">Your notes are saved automatically.</p>
      </div>
      <textarea
        className="min-h-[220px] flex-1 rounded-2xl border border-white/10 bg-white/10 p-4 text-base text-white placeholder:text-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] focus:border-white/40 focus:outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing your next bright idea..."
      />
      <div className="flex flex-wrap gap-2 text-xs">
        {['Research', 'To-do', 'Inspiration'].map((tag) => (
          <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/70 shadow-inner">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};
export default NotesApp;
