import * as Sentry from "@sentry/nextjs";

export function register() {
  Sentry.init({
    dsn: "https://8813f5d93c8c4aa89eda86816f0b1bbf@o1378374.ingest.sentry.io/6690186",

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 0.1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
}
