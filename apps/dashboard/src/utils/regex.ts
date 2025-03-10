export const RE_DOMAIN = new RegExp(
  /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/,
);

// bundle are case sensitive (/i) and can only contain letters, numbers, hyphens, and periods
export const RE_BUNDLE_ID = new RegExp(/^[a-z0-9.-]{3,64}$/i);
