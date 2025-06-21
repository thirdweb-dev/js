import * as Sentry from "@sentry/nextjs";
// eslint-disable-next-line no-restricted-imports
import posthog from "posthog-js";

// ------------------------------------------------------------
//  POSTHOG
// ------------------------------------------------------------

const NEXT_PUBLIC_POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/_ph",
    // specifically disable autocapture (does not affect pageview capture)
    autocapture: false,
    // disable exception capture (for now)
    capture_exceptions: false,
    capture_pageleave: "if_capture_pageview",
    capture_pageview: "history_change",
    debug: process.env.NODE_ENV === "development",
    ui_host: "https://us.posthog.com",
  });
}

// ------------------------------------------------------------
//  SENTRY
// ------------------------------------------------------------

Sentry.init({
  allowUrls: [/thirdweb-dev\.com/i, /thirdweb\.com/, /thirdweb-preview\.com/],

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  denyUrls: [
    // Google Adsense
    /pagead\/js/i,
    // Facebook flakiness
    /graph\.facebook\.com/i,
    // Facebook blocked
    /connect\.facebook\.net\/en_US\/all\.js/i,
    // Woopra flakiness
    /eatdifferent\.com\.woopra-ns\.com/i,
    /static\.woopra\.com\/js\/woopra\.js/i,
    // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
    // Other plugins
    // Cacaoweb
    /127\.0\.0\.1:4001\/isrunning/i,
    /webappstoolbarba\.texthelp\.com\//i,
    /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
    // injected (extensions)
    /inject/i,
  ],
  dsn: "https://8813f5d93c8c4aa89eda86816f0b1bbf@o1378374.ingest.sentry.io/6690186",
  ignoreErrors: [
    // Random plugins/extensions
    "top.GLOBALS",
    // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
    "originalCreateNotification",
    "canvas.contentDocument",
    "MyApp_RemoveAllHighlights",
    "http://tt.epicplay.com",
    "Can't find variable: ZiteReader",
    "jigsaw is not defined",
    "ComboSearch is not defined",
    "http://loading.retry.widdit.com/",
    "atomicFindClose",
    // Facebook borked
    "fb_xd_fragment",
    // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to reduce this. (thanks @acdha)
    // See http://stackoverflow.com/questions/4113268/how-to-stop-javascript-injection-from-vodafone-proxy
    "bmi_SafeAddOnload",
    "EBCallBackMessageReceived",
    // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
    "conduitPage",
    // Avast extension error
    "_avast_submit",
    // Common non-actionable errors
    "rejected transaction",
    "User closed modal",
    "Loading chunk",
    "Failed to execute '",
    "NetworkError when attempting to fetch resource.",
    "googlefc is not defined",
    "__cmp is not defined",
    "Cannot read properties of undefined (reading 'cmp')",
    "Cannot read properties of undefined (reading 'outputCurrentConfiguration')",
    "apstagLOADED is not defined",
    "moat_px is not defined",
    "window.ReactNativeWebView.postMessage is not a function",
    "_reportEvent is not defined",
    "requestAnimationFrame is not defined",
    "window.requestAnimationFrame is not a function",
    "tronLink.setAddress is not a function",
    // benign errors
    "ResizeObserver loop limit exceeded",
    // cannot do anything with these errors
    "Non-Error promise rejection captured",
  ],

  // integrate sentry with posthog
  integrations: [
    posthog.sentryIntegration({
      organization: "thirdweb-dev",
      projectId: 6690186,
    }),
  ],

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,
});

// This export will instrument router navigations, and is only relevant if you enable tracing.
// `captureRouterTransitionStart` is available from SDK version 9.12.0 onwards
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
