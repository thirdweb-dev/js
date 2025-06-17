import "server-only";
import { experimental_taintUniqueValue as _experimental_taintUniqueValue } from "react";

// on storybook, experimental_taintUniqueValue is not available, because its not available in the react version we are using - its added by next.js
const experimental_taintUniqueValue =
  _experimental_taintUniqueValue || (() => {});

// Make sure to taint the server only envs here with experimental_taintUniqueValue ONLY if they contain a UNIQUE sensitive value
// if an env has a generic value that may appear naturally in client components - do not taint it

export const NEBULA_APP_SECRET_KEY = process.env.NEBULA_APP_SECRET_KEY || "";

if (NEBULA_APP_SECRET_KEY) {
  experimental_taintUniqueValue(
    "Do not pass NEBULA_APP_SECRET_KEY to the client",
    process,
    NEBULA_APP_SECRET_KEY,
  );
}

export const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || "";

if (TURNSTILE_SECRET_KEY) {
  experimental_taintUniqueValue(
    "Do not pass TURNSTILE_SECRET_KEY to the client",
    process,
    TURNSTILE_SECRET_KEY,
  );
}
