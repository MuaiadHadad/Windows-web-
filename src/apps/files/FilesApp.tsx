import React, { useState } from 'react';

const seed = [
	{ name: 'Design assets', detail: 'Folder • Updated 2m ago', icon: '🗂️', type: 'Folder', size: '—' },
	{ name: 'Screenshots', detail: 'Folder • 128 items', icon: '🖼️', type: 'Folder', size: '—' },
	{ name: 'Downloads', detail: 'Folder • 2.4 GB', icon: '⬇️', type: 'Folder', size: '—' },
	{ name: 'Music', detail: 'Folder • 86 tracks', icon: '🎧', type: 'Folder', size: '—' },
];

const FilesApp: React.FC = () => {
	const [selected, setSelected] = useState<typeof seed[number] | null>(null);
	const [grid, setGrid] = useState(true);

	return (
		<div className="flex h-full flex-col bg-gradient-to-br from-white/5 via-white/0 to-white/5 text-sm text-white/80">
			{/* Toolbar */}
			<div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-3 py-2">
				<div className="flex items-center gap-2">
					<button className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-white/70">◀</button>
					<button className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-white/70">▶</button>
					<div className="mx-2 h-6 w-px bg-white/10" />
					<div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
						<span className="text-lg drop-shadow">🔎</span>
						<input
							readOnly
							placeholder="Search quick access"
							className="w-56 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
						/>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => setGrid(true)}
						className={`rounded-md px-2 py-1 ${
							grid ? 'bg-white/20 border border-white/10' : 'bg-white/5 border border-transparent'
						}`}
					>
						▦
					</button>
					<button
						onClick={() => setGrid(false)}
						className={`rounded-md px-2 py-1 ${
							!grid ? 'bg-white/20 border border-white/10' : 'bg-white/5 border border-transparent'
						}`}
					>
						≣
					</button>
				</div>
			</div>

			{/* Body */}
			<div className="flex min-h-0 flex-1">
				{/* Content list/grid */}
				<div className="flex-1 overflow-auto p-4">
					{grid ? (
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{seed.map((file) => (
								<button
									key={file.name}
									onClick={() => setSelected(file)}
									className={`flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-[0_12px_30px_rgba(56,189,248,0.2)] ${
										selected?.name === file.name ? 'ring-2 ring-sky-300/60 bg-white/20' : ''
									}`}
								>
									<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300/20 via-white/10 to-white/5 text-xl shadow-inner">
										{file.icon}
									</div>
									<div>
										<div className="font-semibold text-white">{file.name}</div>
										<div className="text-xs text-white/60">{file.detail}</div>
									</div>
								</button>
							))}
						</div>
					) : (
						<div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5">
							{seed.map((file) => (
								<button
									key={file.name}
									onClick={() => setSelected(file)}
									className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/10 ${
										selected?.name === file.name ? 'bg-white/10' : ''
									}`}
								>
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg">
										{file.icon}
									</div>
									<div className="flex-1">
										<div className="font-medium text-white">{file.name}</div>
										<div className="text-xs text-white/60">{file.detail}</div>
									</div>
									<div className="hidden w-32 text-right text-xs text-white/60 sm:block">
										{file.type}
									</div>
									<div className="hidden w-24 text-right text-xs text-white/60 sm:block">
										{file.size}
									</div>
								</button>
							))}
						</div>
					)}
				</div>

				{/* Details pane */}
				<aside className="hidden w-80 shrink-0 border-l border-white/10 bg-white/5 p-4 lg:block">
					<div className="mb-2 text-xs uppercase tracking-widest text-white/60">Detalhes</div>
					{selected ? (
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-xl shadow-inner">
									{selected.icon}
								</div>
								<div>
									<div className="font-semibold text-white">{selected.name}</div>
									<div className="text-xs text-white/60">{selected.type}</div>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
								<div className="text-white/60">Size</div>
								<div className="text-white">{selected.size}</div>
								<div className="text-white/60">Modified</div>
								<div className="text-white">2 minutes ago</div>
							</div>
						</div>
					) : (
						<div className="text-sm text-white/60">Selecione um item para ver detalhes</div>
					)}
				</aside>
			</div>

			{/* Quick links */}
			<div className="grid grid-cols-3 gap-3 border-t border-white/10 bg-white/5 p-3 text-xs">
				{['Desktop', 'Documents', 'Pictures'].map((quick) => (
					<div
						key={quick}
						className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-3 py-4 text-center text-white/70 backdrop-blur-sm"
					>
						{quick}
					</div>
				))}
			</div>
		</div>
	);
};
export default FilesApp;

