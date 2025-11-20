import { useState, useEffect } from 'react';

interface SystemInfo {
  cpuUsage: number;
  memoryUsage: number;
  memoryTotal: number;
  storageUsed: number;
  storageTotal: number;
  networkSpeed: number;
  networkType: string;
  isOnline: boolean;
  batteryLevel: number;
  batteryCharging: boolean;
  batteryTimeRemaining: number;
  language: string;
  languageFull: string;
}

/**
 * Hook to monitor real system performance metrics
 */
// Helper to get language name safely
const getLanguageName = () => {
  try {
    const lang = navigator.language;
    if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
      const displayNames = new Intl.DisplayNames([lang], { type: 'language' });
      return displayNames.of(lang) || lang;
    }
    return lang;
  } catch (e) {
    return navigator.language;
  }
};

export const useSystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    cpuUsage: 0,
    memoryUsage: 0,
    memoryTotal: 0,
    storageUsed: 0,
    storageTotal: 0,
    networkSpeed: 0,
    networkType: 'unknown',
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    batteryLevel: 100,
    batteryCharging: false,
    batteryTimeRemaining: 0,
    language: typeof navigator !== 'undefined' ? navigator.language.split('-')[0].toUpperCase() : 'EN',
    languageFull: typeof navigator !== 'undefined' ? getLanguageName() : 'English',
  });

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let lastBytes = 0;

    // Get memory info (if available)
    const updateMemory = () => {
      if ('memory' in performance && (performance as any).memory) {
        const memory = (performance as any).memory;
        setSystemInfo((prev) => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / (1024 * 1024), // MB
          memoryTotal: memory.jsHeapSizeLimit / (1024 * 1024), // MB
        }));
      }
    };

    // Estimate CPU usage based on performance
    const updateCPU = () => {
      const now = performance.now();
      const delta = now - lastTime;

      // Use performance.now() to estimate CPU usage
      // This is a rough estimate based on frame timing
      const fps = 1000 / delta;
      const cpuEstimate = Math.max(0, Math.min(100, (60 - fps) * 2));

      lastTime = now;

      setSystemInfo((prev) => ({
        ...prev,
        cpuUsage: Math.round(cpuEstimate * 10) / 10,
      }));
    };

    // Get storage info (if available)
    const updateStorage = async () => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate();
          const used = (estimate.usage || 0) / (1024 * 1024 * 1024); // GB
          const total = (estimate.quota || 0) / (1024 * 1024 * 1024); // GB

          setSystemInfo((prev) => ({
            ...prev,
            storageUsed: Math.round(used * 100) / 100,
            storageTotal: Math.round(total * 100) / 100,
          }));
        } catch (e) {
          // Storage API not available
        }
      }
    };

    // Get battery info
    const updateBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();

          const updateBatteryInfo = () => {
            const level = Math.round(battery.level * 100);
            const charging = battery.charging;
            const timeRemaining = charging
              ? battery.chargingTime
              : battery.dischargingTime;

            setSystemInfo((prev) => ({
              ...prev,
              batteryLevel: level,
              batteryCharging: charging,
              batteryTimeRemaining: timeRemaining === Infinity ? 0 : timeRemaining,
            }));
          };

          updateBatteryInfo();
          battery.addEventListener('levelchange', updateBatteryInfo);
          battery.addEventListener('chargingchange', updateBatteryInfo);
          battery.addEventListener('chargingtimechange', updateBatteryInfo);
          battery.addEventListener('dischargingtimechange', updateBatteryInfo);

          return () => {
            battery.removeEventListener('levelchange', updateBatteryInfo);
            battery.removeEventListener('chargingchange', updateBatteryInfo);
            battery.removeEventListener('chargingtimechange', updateBatteryInfo);
            battery.removeEventListener('dischargingtimechange', updateBatteryInfo);
          };
        } catch (e) {
          // Battery API not available
        }
      }
    };

    // Estimate network speed (rough approximation)
    const updateNetwork = () => {
      // Update online status
      setSystemInfo((prev) => ({ ...prev, isOnline: navigator.onLine }));

      if ('connection' in navigator) {
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        if (connection) {
          const speed = connection.downlink || 0; // Mbps
          const type = connection.effectiveType || connection.type || 'unknown'; // 4g, wifi, etc

          setSystemInfo((prev) => ({
            ...prev,
            networkSpeed: speed,
            networkType: type,
          }));
        }
      }
    };

    // Listen for online/offline events
    const handleOnline = () => {
      setSystemInfo((prev) => ({ ...prev, isOnline: true }));
      updateNetwork();
    };

    const handleOffline = () => {
      setSystemInfo((prev) => ({ ...prev, isOnline: false, networkSpeed: 0 }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update loop
    const update = () => {
      updateCPU();
      updateMemory();
      updateNetwork();
      animationFrameId = requestAnimationFrame(update);
    };

    // Initial updates
    update();
    updateStorage();
    updateBattery();

    // Periodic updates for storage
    const storageInterval = setInterval(updateStorage, 30000); // Every 30s

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(storageInterval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return systemInfo;
};

/**
 * Format bytes to human readable
 */
export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Get color based on usage percentage
 */
export const getUsageColor = (percentage: number) => {
  if (percentage < 50) return 'text-emerald-400';
  if (percentage < 75) return 'text-yellow-400';
  return 'text-rose-400';
};

/**
 * Format seconds to human readable time
 */
export const formatTime = (seconds: number) => {
  if (seconds <= 0 || !isFinite(seconds)) return 'Calculando...';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Get network type display name
 */
export const getNetworkTypeName = (type: string) => {
  const types: Record<string, string> = {
    'slow-2g': '2G Lento',
    '2g': '2G',
    '3g': '3G',
    '4g': '4G/LTE',
    'wifi': 'WiFi',
    'ethernet': 'Ethernet',
    'bluetooth': 'Bluetooth',
    'cellular': 'Celular',
    'unknown': 'Desconhecido',
  };
  return types[type.toLowerCase()] || type;
};

