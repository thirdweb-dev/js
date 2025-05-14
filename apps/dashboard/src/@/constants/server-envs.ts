import "server-only";
import { experimental_taintUniqueValue } from "react";
import { isProd } from "./env-utils";

// Make sure to taint the server only envs here with experimental_taintUniqueValue ONLY if they contain a UNIQUE sensitive value
// if an env has a generic value that may appear naturally in client components - do not taint it

export const DASHBOARD_THIRDWEB_SECRET_KEY =
  process.env.DASHBOARD_SECRET_KEY || "";

experimental_taintUniqueValue(
  "Do not pass DASHBOARD_THIRDWEB_SECRET_KEY to the client",
  process,
  DASHBOARD_THIRDWEB_SECRET_KEY,
);

export const NEBULA_APP_SECRET_KEY = process.env.NEBULA_APP_SECRET_KEY || "";

if (NEBULA_APP_SECRET_KEY) {
  experimental_taintUniqueValue(
    "Do not pass NEBULA_APP_SECRET_KEY to the client",
    process,
    NEBULA_APP_SECRET_KEY,
  );
}

export const API_SERVER_SECRET = process.env.API_SERVER_SECRET || "";

if (API_SERVER_SECRET) {
  experimental_taintUniqueValue(
    "Do not pass API_SERVER_SECRET to the client",
    process,
    API_SERVER_SECRET,
  );
}

export const THIRDWEB_ENGINE_URL = process.env.THIRDWEB_ENGINE_URL || "";

if (THIRDWEB_ENGINE_URL) {
  experimental_taintUniqueValue(
    "Do not pass THIRDWEB_ENGINE_URL to the client",
    process,
    THIRDWEB_ENGINE_URL,
  );
}

export const THIRDWEB_ACCESS_TOKEN = process.env.THIRDWEB_ACCESS_TOKEN || "";

if (THIRDWEB_ACCESS_TOKEN) {
  experimental_taintUniqueValue(
    "Do not pass THIRDWEB_ACCESS_TOKEN to the client",
    process,
    THIRDWEB_ACCESS_TOKEN,
  );
}

// Comma-separated list of chain IDs to disable faucet for.
// Note: Can not taint this - because the value is too generic
export const DISABLE_FAUCET_CHAIN_IDS =
  process.env.DISABLE_FAUCET_CHAIN_IDS || "";

export const INSIGHT_SERVICE_API_KEY =
  process.env.INSIGHT_SERVICE_API_KEY || "";

// The value of INSIGHT_SERVICE_API_KEY on dev is generic - so we don't taint it
// TODO - have better INSIGHT_SERVICE_API_KEY on dev
if (isProd && INSIGHT_SERVICE_API_KEY) {
  experimental_taintUniqueValue(
    "Do not pass INSIGHT_SERVICE_API_KEY to the client",
    process,
    INSIGHT_SERVICE_API_KEY,
  );
}

export const MORALIS_API_KEY = process.env.MORALIS_API_KEY || "";

if (MORALIS_API_KEY) {
  experimental_taintUniqueValue(
    "Do not pass MORALIS_API_KEY to the client",
    process,
    MORALIS_API_KEY,
  );
}

export const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL || "";

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";

if (STRIPE_SECRET_KEY) {
  experimental_taintUniqueValue(
    "Do not pass STRIPE_SECRET_KEY to the client",
    process,
    STRIPE_SECRET_KEY,
  );
}

export const API_ROUTES_CLIENT_ID = process.env.API_ROUTES_CLIENT_ID || "";

export const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || "";

if (TURNSTILE_SECRET_KEY) {
  experimental_taintUniqueValue(
    "Do not pass TURNSTILE_SECRET_KEY to the client",
    process,
    TURNSTILE_SECRET_KEY,
  );
}

export const REDIS_URL = process.env.REDIS_URL || "";

if (REDIS_URL) {
  experimental_taintUniqueValue(
    "Do not pass REDIS_URL to the client",
    process,
    REDIS_URL,
  );
}
