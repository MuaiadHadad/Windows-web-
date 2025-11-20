import React from 'react';
import { useNotesStore } from '../../store/notesStore';

const NotesApp: React.FC = () => {
  const text = useNotesStore((s) => s.text);
  const setText = useNotesStore((s) => s.setText);

  const words = (text?.trim()?.split(/\s+/)?.filter(Boolean)?.length) || 0;

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-amber-50/0 via-white/0 to-amber-100/5 text-white/90">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-amber-200">Notes</span>
          <span className="text-white/60">1 documento</span>
        </div>
        <div className="text-xs text-white/60">{words} palavras</div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4">
        <textarea
          className="min-h-[260px] h-full w-full resize-none rounded-xl border border-white/10 bg-white/10 p-4 text-base text-white placeholder:text-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] focus:border-white/40 focus:outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreve a tua próxima grande ideia…"
        />
      </div>

      {/* Footer tags */}
      <div className="flex flex-wrap gap-2 border-t border-white/10 bg-white/5 p-3 text-xs">
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
