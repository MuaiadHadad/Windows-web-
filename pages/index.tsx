import React from 'react';
import Head from 'next/head';
import Desktop from '../src/components/desktop/Desktop';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Windows Web OS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Desktop />
    </>
  );
};

export default Home;

