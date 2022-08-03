import chakraTheme from "../theme";
import { ChakraProvider } from "@chakra-ui/react";
import { Global, css } from "@emotion/react";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { Hydrate, QueryClient } from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
  Persister,
} from "@tanstack/react-query-persist-client";
import { DashboardThirdwebProvider } from "components/app-layouts/providers";
import { ErrorProvider } from "contexts/error-handler";
import { BigNumber } from "ethers";
import flat from "flat";
import { useTrack } from "hooks/analytics/useTrack";
import { NextPage } from "next";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { generateBreakpointTypographyCssVars } from "tw-components/utils/typography";
import { isBrowser } from "utils/isBrowser";

const __CACHE_BUSTER = "v2.0.4";

export function bigNumberReplacer(_key: string, value: any) {
  // if we find a BigNumber then make it into a string (since that is safe)
  if (
    BigNumber.isBigNumber(value) ||
    (typeof value === "object" &&
      value !== null &&
      value.type === "BigNumber" &&
      "hex" in value)
  ) {
    return BigNumber.from(value).toString();
  }

  return value;
}

const fontSizeCssVars = generateBreakpointTypographyCssVars();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement, pageProps?: any) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const persister: Persister = createSyncStoragePersister({
  storage: isBrowser() ? window.localStorage : undefined,
  serialize: (data) => JSON.stringify(data, bigNumberReplacer),
  key: `tw-query-cache:${__CACHE_BUSTER}`,
});

function ConsoleApp({ Component, pageProps }: AppPropsWithLayout) {
  // has to be constructed in here because it may otherwise share state between SSR'd pages
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 24 hours
            cacheTime: 1000 * 60 * 60 * 24,
            // 30 seconds
            staleTime: 1000 * 30,
          },
        },
      }),
  );

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

        posthog.capture(catActLab, flat(restData));
      },
    },
  );

  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <Hydrate state={pageProps.dehydratedState}>
        <Track>
          <Global
            styles={css`
              #walletconnect-wrapper {
                color: #000;
              }
              .walletconnect-search__input::placeholder {
                color: inherit;
                opacity: 0.7;
              }
              ${fontSizeCssVars}
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
              title:
                "Web3 SDKs for developers ⸱ No-code for NFT artists | thirdweb",
              description:
                "Build web3 apps easily. Implement web3 features with powerful SDKs for developers. Drop NFTs with no code. — Ethereum, Polygon, Avalanche, & more.",
              type: "website",
              locale: "en_US",
              url: "https://thirdweb.com",
              site_name: "thirdweb",
              images: [
                {
                  url: "https://thirdweb.com/thirdweb.png",
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
            <ErrorProvider>
              <DashboardThirdwebProvider queryClient={queryClient}>
                {getLayout(<Component {...pageProps} />, pageProps)}
              </DashboardThirdwebProvider>
            </ErrorProvider>
          </ChakraProvider>
        </Track>
      </Hydrate>
    </PersistQueryClientProvider>
  );
}
export default ConsoleApp;
