import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script
            // src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_KEY}&libraries=places&callback=Function.prototype`}
            src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyB9vWPTo6O2OO-hMEhEqoSfQJcQRUeRwGk&libraries=places&callback=Function.prototype`}
          />
          <meta name="apple-mobile-web-app-title" content="WellMoe" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0 user-scalable=no"
          />
          <meta name="mobile-web-app-capable" content="yes" />
          <link rel="shortcut icon" href="/wellmoe-favicon.png" />
          <link
            rel="shortcut icon"
            sizes="196x196"
            href="/wellmoe-favicon.png"
          />

          <link rel="manifest" href="/manifest.json" />
          {/* IOS SUPPORT PWA */}
          <link rel="apple-touch-icon" href="/icon-96x96.png" />
          <link rel="apple-mobile-web-app-status-bar" content="#1B153D" />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
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
