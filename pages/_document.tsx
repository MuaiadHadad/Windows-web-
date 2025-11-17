import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt-PT">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#0f172a" />
          <link rel="icon" href="/icons/icon-192.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="WinWeb" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
