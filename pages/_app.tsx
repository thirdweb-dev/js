import chakraTheme from "../theme";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { Global, css } from "@emotion/react";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { DehydratedState, Hydrate, QueryClient } from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
  Persister,
} from "@tanstack/react-query-persist-client";
import { shouldNeverPersistQuery } from "@thirdweb-dev/react";
import { AnnouncementBanner } from "components/notices/AnnouncementBanner";
import { BigNumber } from "ethers";
import { NextPage } from "next";
import PlausibleProvider from "next-plausible";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { PageId } from "page-id";
import posthog from "posthog-js";
import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { generateBreakpointTypographyCssVars } from "tw-components/utils/typography";
import { isBrowser } from "utils/isBrowser";

const __CACHE_BUSTER = "v3.5.1";

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

export type ThirdwebNextPage = NextPage<any> & {
  getLayout?: (page: ReactElement, pageProps?: any) => ReactNode;
  pageId: PageId | ((pageProps: any) => PageId);
};

type AppPropsWithLayout = AppProps<{ dehydratedState?: DehydratedState }> & {
  Component: ThirdwebNextPage;
};

const persister: Persister = createSyncStoragePersister({
  storage: isBrowser() ? window.localStorage : undefined,
  serialize: (data) => {
    return JSON.stringify(
      {
        ...data,
        clientState: {
          ...data.clientState,
          queries: data.clientState.queries.filter(
            // covers solana as well as evm
            (q) => !shouldNeverPersistQuery(q.queryKey),
          ),
        },
      },
      bigNumberReplacer,
    );
  },
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
    // Taken from StackOverflow. Trying to detect both Safari desktop and mobile.
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      // This is kind of a lie.
      // We still rely on the manual Next.js scrollRestoration logic.
      // However, we *also* don't want Safari grey screen during the back swipe gesture.
      // Seems like it doesn't hurt to enable auto restore *and* Next.js logic at the same time.
      history.scrollRestoration = "auto";
    } else {
      // For other browsers, let Next.js set scrollRestoration to 'manual'.
      // It seems to work better for Chrome and Firefox which don't animate the back swipe.
    }
  }, []);

  useEffect(() => {
    // setup route cancellation
    const handleStart = (url: string) => {
      if (url !== window.location.pathname) {
        // in production *only* time out the current route transition after 350ms
        if (process.env.NODE_ENV === "production") {
          (window as any).routeTransitionTimeout = setTimeout(() => {
            (window as any).location = url;
          }, 1000);
        }
        NProgress.start();
      }
    };
    const handleStop = () => {
      clearTimeout((window as any).routeTransitionTimeout);
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  useEffect(() => {
    // Init PostHog
    posthog.init("phc_hKK4bo8cHZrKuAVXfXGpfNSLSJuucUnguAgt2j6dgSV", {
      api_host: "https://a.thirdweb.com",
      autocapture: true,
      debug: false,
      capture_pageview: false,
    });
    // register the git commit sha on all subsequent events
    posthog.register({
      tw_dashboard_version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    });
  }, []);
  const pageId =
    typeof Component.pageId === "function"
      ? Component.pageId(pageProps)
      : Component.pageId;
  const prevPageId = useRef<string>();
  useEffect(() => {
    // this catches the case where the the hook is called twice on the same page
    if (pageId === prevPageId.current) {
      return;
    }
    posthog.register({ page_id: pageId });
    posthog.capture("$pageview");
    return () => {
      prevPageId.current = pageId;
    };
  }, [pageId]);

  const getLayout = Component.getLayout ?? ((page) => page);

  // shortcut everything and only set up the necessities for the OG renderer
  if (router.pathname.startsWith("/_og/")) {
    return (
      <>
        <Global
          styles={css`
            ${fontSizeCssVars}

            .emoji {
              height: 1em;
              width: 1em;
              margin: 0 0.05em 0 0.1em;
              vertical-align: -0.1em;
              display: inline;
            }
          `}
        />
        <ChakraProvider theme={chakraTheme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </>
    );
  }

  return (
    <PlausibleProvider
      domain="thirdweb.com"
      customDomain="https://pl.thirdweb.com"
      selfHosted
      scriptProps={{
        src: "https://pl.thirdweb.com/js/plausible.js",
      }}
    >
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <Hydrate state={pageProps.dehydratedState}>
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

            .emoji {
              height: 1em;
              width: 1em;
              margin: 0 .05em 0 .1em;
              vertical-align: -0.1em;
              display: inline;
          }
            
            #nprogress {
              pointer-events: none;
            }
            
            #nprogress .bar {
              background: ${theme.colors.purple[500]};
            
              position: fixed;
              z-index: 1031;
              top: 0;
              left: 0;
            
              width: 100%;
              height: 2px;
            }
            
            /* Fancy blur effect */
            #nprogress .peg {
              display: block;
              position: absolute;
              right: 0px;
              width: 100px;
              height: 100%;
              box-shadow: 0 0 10px ${theme.colors.purple[500]}, 0 0 5px ${theme.colors.purple[500]};
              opacity: 1.0;
            
              -webkit-transform: rotate(3deg) translate(0px, -4px);
                  -ms-transform: rotate(3deg) translate(0px, -4px);
                      transform: rotate(3deg) translate(0px, -4px);
          `}
          />
          <DefaultSeo
            defaultTitle="thirdweb: The complete web3 development framework"
            titleTemplate="%s | thirdweb"
            description="Build web3 apps easily with thirdweb's powerful SDKs, audited smart contracts, and developer tools—for Ethereum, Polygon, Solana, & more. Try now."
            additionalLinkTags={[
              {
                rel: "icon",
                href: "/favicon.ico",
              },
            ]}
            openGraph={{
              title: "thirdweb: The complete web3 development framework",
              description:
                "Build web3 apps easily with thirdweb's powerful SDKs, audited smart contracts, and developer tools—for Ethereum, Polygon, Solana, & more. Try now.",
              type: "website",
              locale: "en_US",
              url: "https://thirdweb.com",
              site_name: "thirdweb",
              images: [
                {
                  url: "https://thirdweb.com/thirdweb.png",
                  width: 1200,
                  height: 630,
                  alt: "thirdweb",
                },
              ],
            }}
            twitter={{
              handle: "@thirdweb",
              site: "@thirdweb",
              cardType: "summary_large_image",
            }}
            canonical={`https://thirdweb.com${router.asPath}`}
          />

          <ChakraProvider theme={chakraTheme}>
            <AnnouncementBanner />
            {getLayout(<Component {...pageProps} />, pageProps)}
          </ChakraProvider>
        </Hydrate>
      </PersistQueryClientProvider>
    </PlausibleProvider>
  );
}
export default ConsoleApp;
