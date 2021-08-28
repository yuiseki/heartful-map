import Head from 'next/head';
import { GlobalStyles, css } from 'twin.macro';
import { Global } from '@emotion/react';
import { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';
import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core';

const globalStyles = css`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  pre {
    white-space: pre-wrap;
  }
`;

const theme = createTheme({ palette: { primary: { main: '#ff7f8f' } } })

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Provider session={pageProps.session}>
        <>
          <Head>
            <title>ハートフルマップ</title>
            <link rel='icon' href='/favicon.ico' />
            <link
              href='https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400&display=swap'
              rel='stylesheet'
            />
            <link
              rel='stylesheet'
              href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
            />
            <link
              rel='stylesheet'
              href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
              integrity='sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ=='
              crossOrigin='anonymous'
              referrerPolicy='no-referrer'
            />
            <script src='https://cdn.geolonia.com/community-geocoder.js'></script>
          </Head>
          <GlobalStyles />
          <Global styles={globalStyles} />
          <Component {...pageProps} />
        </>
      </Provider>
  </ThemeProvider>
  );
};

export default App;
