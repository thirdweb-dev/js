import chakraTheme from "../theme";
import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import { Global, css } from "@emotion/react";
import type { DehydratedState } from "@tanstack/react-query";
import { ProgressBar } from "components/shared/ProgressBar";
import PlausibleProvider from "next-plausible";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import {
  IBM_Plex_Mono as ibmPlexMonoConstructor,
  Inter as interConstructor,
} from "next/font/google";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import posthogOpenSource from "posthog-js-opensource";
import posthogCloud from "posthog-js";
import { memo, useEffect, useMemo, useRef } from "react";
import { generateBreakpointTypographyCssVars } from "tw-components/utils/typography";
import type { ThirdwebNextPage } from "utils/types";
import "../css/swagger-ui.css";
import { AnnouncementBanner } from "components/notices/AnnouncementBanner";
import { useBuildId } from "hooks/useBuildId";
import "@/styles/globals.css";
import { ThemeProvider } from "../@/components/theme-provider";
import { useTheme } from "next-themes";

const inter = interConstructor({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

const ibmPlexMono = ibmPlexMonoConstructor({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Consolas", "Courier New", "monospace"],
});

const chakraThemeWithFonts = {
  ...chakraTheme,
  fonts: {
    ...chakraTheme.fonts,
    heading: inter.style.fontFamily,
    body: inter.style.fontFamily,
    mono: ibmPlexMono.style.fontFamily,
  },
};

const fontSizeCssVars = generateBreakpointTypographyCssVars();

type AppPropsWithLayout = AppProps<{ dehydratedState?: DehydratedState }> & {
  Component: ThirdwebNextPage;
};

const ConsoleAppWrapper: React.FC<AppPropsWithLayout> = ({
  Component,
  pageProps,
}) => {
  const router = useRouter();
  const { shouldReload } = useBuildId();

  // legit use-case, will go away as part of app router rewrite (once finished)
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    const handleRouteChange = async () => {
      if (shouldReload()) {
        router.reload();
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router, shouldReload]);

  // legit use-case
  // eslint-disable-next-line no-restricted-syntax
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

  // legit use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // Init PostHog Cloud (Used for surveys)
    posthogCloud.init(
      process.env.NEXT_PUBLIC_POSTHOG_CLOUD_API_KEY ||
        "phc_oXH0qpLTaotkIQP5MdaWhtoOXvh1Iba7yNSQrLgWbLN",
      {
        api_host: "https://pg.paper.xyz",
        autocapture: false,
        debug: false,
        capture_pageview: false,
        disable_session_recording: true,
      },
    );

    // Init PostHog
    posthogOpenSource.init(
      process.env.NEXT_PUBLIC_POSTHOG_API_KEY ||
        "phc_hKK4bo8cHZrKuAVXfXGpfNSLSJuucUnguAgt2j6dgSV",
      {
        api_host: "https://a.thirdweb.com",
        autocapture: true,
        debug: false,
        capture_pageview: false,
        disable_session_recording: true,
      },
    );
    // register the git commit sha on all subsequent events
    posthogOpenSource.register({
      tw_dashboard_version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    });
    // defer session recording start by 2 seconds because it synchronously loads JS
    const t = setTimeout(() => {
      posthogOpenSource.startSessionRecording();
    }, 2_000);
    return () => {
      clearTimeout(t);
    };
  }, []);

  const pageId =
    typeof Component.pageId === "function"
      ? Component.pageId(pageProps)
      : Component.pageId;

  // starts out with "none" page id
  const prevPageId = useRef<PageId>(PageId.None);
  // legit use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // this catches the case where the hook is called twice on the same page
    if (pageId === prevPageId.current) {
      return;
    }
    posthogOpenSource.register({
      page_id: pageId,
      previous_page_id: prevPageId.current,
    });
    posthogOpenSource.capture("$pageview");
    return () => {
      prevPageId.current = pageId;
    };
  }, [pageId]);

  const canonicalUrl = useMemo(() => {
    const base = `https://thirdweb.com`;
    // replace all re-written middleware paths
    const path = router.asPath
      .replace("/evm/", "/")
      .replace("/chain/", "/")
      .replace("/publish/", "/");
    return `${base}${path}`;
  }, [router.asPath]);

  return (
    <ConsoleApp
      seoCanonical={canonicalUrl}
      Component={Component}
      pageProps={pageProps}
      isFallback={router.isFallback}
    />
  );
};

interface ConsoleAppProps {
  Component: AppPropsWithLayout["Component"];
  pageProps: AppPropsWithLayout["pageProps"];
  seoCanonical: string;
  isFallback?: boolean;
}

const ConsoleApp = memo(function ConsoleApp({
  Component,
  pageProps,
  seoCanonical,
  isFallback,
}: ConsoleAppProps) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <PlausibleProvider
      domain="thirdweb.com"
      customDomain="https://pl.thirdweb.com"
      selfHosted
    >
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
            margin: 0 0.05em 0 0.1em;
            vertical-align: -0.1em;
            display: inline;
          }
          body {
            font-variant-ligatures: none !important;
          }
          .chakra-checkbox__control > div > svg {
            font-size: 10px !important;
          }
        `}
      />
      <DefaultSeo
        defaultTitle="thirdweb: The complete web3 development platform"
        titleTemplate="%s | thirdweb"
        description="Build web3 apps easily with thirdweb's powerful SDKs, audited smart contracts, and developer tools—for Ethereum & 700+ EVM chains. Try now."
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/favicon.ico",
          },
        ]}
        openGraph={{
          title: "thirdweb: The complete web3 development platform",
          description:
            "Build web3 apps easily with thirdweb's powerful SDKs, audited smart contracts, and developer tools—for Ethereum & 700+ EVM chains. Try now.",
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
        canonical={isFallback ? undefined : seoCanonical}
      />

      <ProgressBar
        color="#4a92fe"
        incrementInterval={100}
        incrementAmount={10}
        transitionDuration={500}
        transitionTimingFunction="ease"
      />

      <ChakraProvider theme={chakraThemeWithFonts}>
        <AnnouncementBanner />
        <TailwindTheme>
          {isFallback && Component.fallback
            ? Component.fallback
            : getLayout(<Component {...pageProps} />, pageProps)}
        </TailwindTheme>
      </ChakraProvider>
    </PlausibleProvider>
  );
});

function TailwindTheme(props: { children: React.ReactNode }) {
  const { colorMode } = useColorMode();

  return (
    <ThemeProvider
      attribute="class"
      // this sets the initial theme
      forcedTheme={colorMode === "light" ? "light" : "dark"}
    >
      {/* this keeps the theme in sync! */}
      <SyncTheme currentTheme={colorMode === "light" ? "light" : "dark"} />
      {props.children}
    </ThemeProvider>
  );
}
const SyncTheme: React.FC<{ currentTheme: "light" | "dark" }> = ({
  currentTheme,
}) => {
  const { setTheme } = useTheme();
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme, setTheme]);
  return null;
};

export default ConsoleAppWrapper;
