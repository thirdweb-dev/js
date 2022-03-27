import chakraTheme from "../theme";
import { ChakraProvider } from "@chakra-ui/react";
import { Global, css } from "@emotion/react";
import { AppLayout } from "components/app-layouts/app";
import { FallbackLayout } from "components/app-layouts/fallback";
import { Providers } from "components/app-layouts/providers";
import { useTrack } from "hooks/analytics/useTrack";
import { NextComponentType, NextPageContext } from "next";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import React, { useEffect } from "react";
import { fontsizeCss } from "theme/typography";

export type ConsolePageComponent<IP, P> = NextComponentType<
  NextPageContext,
  IP,
  P
> & {
  Layout?: typeof AppLayout;
};

export type ConsolePage<P = {}, IP = P> = ConsolePageComponent<IP, P>;

type ConsoleAppProps<P = {}, IP = P> = AppProps & {
  Component: ConsolePageComponent<IP, P>;
};

function ConsoleApp({ Component, pageProps }: ConsoleAppProps) {
  const router = useRouter();

  useEffect(() => {
    // Init PostHog
    posthog.init("phc_hKK4bo8cHZrKuAVXfXGpfNSLSJuucUnguAgt2j6dgSV", {
      api_host: "https://a.thirdweb.com",
      autocapture: true,
    });

    // Track page views
    const handleRouteChange = () => {
      posthog.capture("$pageview");
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { Track } = useTrack(
    { page: "root" },
    {
      dispatch: (data) => {
        const { category, action, label, ...restData } = data;
        const catActLab = label
          ? `${category}.${action}.${label}`
          : `${category}.${action}`;
        if (process.env.NODE_ENV === "development") {
          console.debug(`[PH.capture]:${catActLab}`, restData);
        }

        posthog.capture(catActLab, restData);
      },
    },
  );

  const Layout = Component.Layout || FallbackLayout;
  return (
    <Track>
      <Global
        styles={css`
          :host,
          :root {
            ${fontsizeCss};
          }
          #walletconnect-wrapper {
            color: #000;
          }
          .walletconnect-search__input::placeholder {
            color: inherit;
            opacity: 0.7;
          }
        `}
      />
      <DefaultSeo
        defaultTitle="Web3 SDKs for developers ⸱ No-code for NFT artists | thirdweb"
        titleTemplate="%s | thirdweb"
        description="Build web3 apps easily. Implement web3 features with powerful SDKs for developers. Drop NFTs with no code. — Ethereum, Polygon, Avalanche, & more."
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/favicon.ico",
          },
        ]}
        openGraph={{
          title: "thirdweb",
          type: "website",
          locale: "en_US",
          url: "https://thirdweb.com",
          site_name: "thirdweb",
          images: [
            {
              url: "https://thirdweb.com/thirdweb-og.png",
              width: 1200,
              height: 650,
              alt: "thirdweb",
            },
          ],
        }}
        twitter={{
          handle: "@thirdweb_",
          site: "@thirdweb_",
          cardType: "summary_large_image",
        }}
        canonical={`https://thirdweb.com${router.asPath}`}
      />

      <ChakraProvider theme={chakraTheme}>
        <Providers>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Providers>
      </ChakraProvider>
    </Track>
  );
}
export default ConsoleApp;
