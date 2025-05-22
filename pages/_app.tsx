import { SessionProvider } from 'next-auth/react';
import { SSRProvider } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SSRProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </SSRProvider>
  );
}

export default MyApp;
