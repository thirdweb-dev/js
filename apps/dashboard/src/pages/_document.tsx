import { ColorModeScript } from "@chakra-ui/react";
import Document, { Head, Html, Main, NextScript } from "next/document";
import chakraTheme from "../theme";

class ConsoleDocument extends Document {
  render() {
    return (
      <Html lang="en-US">
        <Head>
          {/* preconnect to domains we know we'll be using */}
          <link rel="preconnect" href="https://a.thirdweb.com" />
          <link rel="dns-prefetch" href="https://a.thirdweb.com" />
          <link rel="preconnect" href="https://pl.thirdweb.com" />
          <link rel="dns-prefetch" href="https://pl.thirdweb.com" />
        </Head>
        <body id="tw-body-root">
          <ColorModeScript
            initialColorMode={chakraTheme.config.initialColorMode}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default ConsoleDocument;
