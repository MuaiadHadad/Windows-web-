import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePreferencesStore } from '../../store/preferencesStore';
import { useSystemInfo, getUsageColor, formatTime, getNetworkTypeName } from '../../hooks/useSystemInfo';

export const SystemTray: React.FC = () => {
  const darkTheme = usePreferencesStore((s) => s.darkTheme);
  const toggleTheme = usePreferencesStore((s) => s.toggleTheme);

  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Get real system info
  const systemInfo = useSystemInfo();

  // Calculate memory percentage
  const memoryPercent = systemInfo.memoryTotal > 0
    ? Math.round((systemInfo.memoryUsage / systemInfo.memoryTotal) * 100)
    : 0;

  return (
    <div className="flex items-center gap-1.5">
      {/* CPU Usage */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setShowTooltip('cpu')}
          onMouseLeave={() => setShowTooltip(null)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label={`CPU: ${systemInfo.cpuUsage}%`}
        >
          <div className="flex flex-col items-center justify-center gap-0.5">
            <span className="text-[8px] font-bold text-white/50">CPU</span>
            <span className={`text-[10px] font-bold ${getUsageColor(systemInfo.cpuUsage)}`}>
              {Math.round(systemInfo.cpuUsage)}%
            </span>
          </div>
        </motion.button>

        <AnimatePresence>
          {showTooltip === 'cpu' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900/95 border border-white/10 px-3 py-2 text-xs text-white shadow-xl backdrop-blur-sm"
            >
              <div className="font-medium">💻 Uso de CPU</div>
              <div className={`text-sm font-bold ${getUsageColor(systemInfo.cpuUsage)}`}>
                {systemInfo.cpuUsage.toFixed(1)}%
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RAM Usage */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setShowTooltip('ram')}
          onMouseLeave={() => setShowTooltip(null)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label={`RAM: ${memoryPercent}%`}
        >
          <div className="flex flex-col items-center justify-center gap-0.5">
            <span className="text-[8px] font-bold text-white/50">RAM</span>
            <span className={`text-[10px] font-bold ${getUsageColor(memoryPercent)}`}>
              {memoryPercent}%
            </span>
          </div>
        </motion.button>

        <AnimatePresence>
          {showTooltip === 'ram' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900/95 border border-white/10 px-3 py-2 text-xs text-white shadow-xl backdrop-blur-sm"
            >
              <div className="font-medium">🧠 Memória RAM</div>
              <div className={`text-sm font-bold ${getUsageColor(memoryPercent)}`}>
                {systemInfo.memoryUsage.toFixed(0)} MB / {systemInfo.memoryTotal.toFixed(0)} MB
              </div>
              <div className="text-white/60 text-[10px]">{memoryPercent}% em uso</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Network Status */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setShowTooltip('network')}
          onMouseLeave={() => setShowTooltip(null)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-base transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label={systemInfo.isOnline ? 'Conectado' : 'Desconectado'}
        >
          <span className={systemInfo.isOnline ? 'text-emerald-400' : 'text-rose-400'}>
            {systemInfo.isOnline ? '📶' : '📵'}
          </span>
        </motion.button>

        <AnimatePresence>
          {showTooltip === 'network' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900/95 border border-white/10 px-3 py-2 text-xs text-white shadow-xl backdrop-blur-sm"
            >
              <div className="font-medium">
                {systemInfo.isOnline ? '🌐 Conectado' : '⚠️ Sem conexão'}
              </div>
              {systemInfo.isOnline && (
                <>
                  {systemInfo.networkType !== 'unknown' && (
                    <div className="text-white/80 text-[10px]">
                      {getNetworkTypeName(systemInfo.networkType)}
                    </div>
                  )}
                  {systemInfo.networkSpeed > 0 && (
                    <div className="text-emerald-400 text-sm font-bold">
                      ↓ {systemInfo.networkSpeed.toFixed(1)} Mbps
                    </div>
                  )}
                </>
              )}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Battery (if available) */}
      {systemInfo.batteryLevel < 100 && (
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setShowTooltip('battery')}
            onMouseLeave={() => setShowTooltip(null)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-base transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label={`Bateria: ${systemInfo.batteryLevel}%`}
          >
            <div className="flex flex-col items-center justify-center gap-0.5">
              <span className={systemInfo.batteryCharging ? 'text-emerald-400' : getUsageColor(100 - systemInfo.batteryLevel)}>
                {systemInfo.batteryCharging ? '⚡' : '🔋'}
              </span>
              <span className={`text-[8px] font-bold ${systemInfo.batteryCharging ? 'text-emerald-400' : getUsageColor(100 - systemInfo.batteryLevel)}`}>
                {systemInfo.batteryLevel}%
              </span>
            </div>
          </motion.button>

          <AnimatePresence>
            {showTooltip === 'battery' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900/95 border border-white/10 px-3 py-2 text-xs text-white shadow-xl backdrop-blur-sm"
              >
                <div className="font-medium">🔋 Bateria</div>
                <div className={`text-sm font-bold ${systemInfo.batteryCharging ? 'text-emerald-400' : getUsageColor(100 - systemInfo.batteryLevel)}`}>
                  {systemInfo.batteryLevel}%
                </div>
                <div className="text-white/60 text-[10px]">
                  {systemInfo.batteryCharging ? '⚡ Carregando' : '🔌 Descarregando'}
                </div>
                {systemInfo.batteryTimeRemaining > 0 && (
                  <div className="text-white/50 text-[10px] mt-1">
                    {systemInfo.batteryCharging ? '⏱️ Até completo: ' : '⏱️ Tempo restante: '}
                    {formatTime(systemInfo.batteryTimeRemaining)}
                  </div>
                )}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Language */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setShowTooltip('language')}
          onMouseLeave={() => setShowTooltip(null)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[10px] font-bold text-white/80 transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label={`Idioma: ${systemInfo.language}`}
        >
          {systemInfo.language}
        </motion.button>

        <AnimatePresence>
          {showTooltip === 'language' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900/95 border border-white/10 px-3 py-2 text-xs text-white shadow-xl backdrop-blur-sm"
            >
              <div className="font-medium">🌍 Idioma do Sistema</div>
              <div className="text-white/80 text-sm">
                {systemInfo.languageFull}
              </div>
              <div className="text-white/50 text-[10px]">
                {navigator.language}
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Theme Toggle */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          onMouseEnter={() => setShowTooltip('theme')}
          onMouseLeave={() => setShowTooltip(null)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-base transition-all focus:outline-none focus:ring-2 focus:ring-white/20 ${
            darkTheme 
              ? 'bg-slate-800/50 hover:bg-slate-700/50 text-violet-300' 
              : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400'
          }`}
          aria-label={darkTheme ? 'Modo escuro ativo' : 'Modo claro ativo'}
        >
          <motion.span
            initial={false}
            animate={{
              rotate: darkTheme ? 0 : 180,
              scale: darkTheme ? 1 : 1.1
            }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {darkTheme ? '🌙' : '☀️'}
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {showTooltip === 'theme' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900/95 border border-white/10 px-3 py-1.5 text-xs text-white shadow-xl backdrop-blur-sm"
            >
              <div className="font-medium">
                {darkTheme ? '🌙 Tema escuro' : '☀️ Tema claro'}
              </div>
              <div className="text-white/60 text-[10px]">Clique para alternar</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Separator before clock */}
      <div className="h-8 w-px bg-white/10 mx-1" />
    </div>
  );
};

