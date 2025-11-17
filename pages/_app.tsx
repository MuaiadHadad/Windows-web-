import type { AppProps } from 'next/app';
import '../styles/globals.css';
import React, { useEffect, useRef, useState } from 'react';
import BootScreen from '../src/components/BootScreen';

function MyApp({ Component, pageProps }: AppProps) {
  const [booting, setBooting] = useState(true);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    const MIN_DURATION = 800; // ms
    const finish = () => {
      const elapsed = Date.now() - startRef.current;
      const wait = Math.max(0, MIN_DURATION - elapsed);
      window.setTimeout(() => setBooting(false), wait);
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      const onLoad = () => finish();
      window.addEventListener('load', onLoad);
      const maxTimeout = window.setTimeout(finish, 2500); // fallback
      return () => {
        window.removeEventListener('load', onLoad);
        window.clearTimeout(maxTimeout);
      };
    }
  }, []);

  return (
    <>
      <BootScreen visible={booting} />
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
