export const RE_EMAIL = new RegExp(
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
);

export const RE_DOMAIN = new RegExp(
  /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/,
);

export const RE_BUNDLE_ID = new RegExp(/^[a-z0-9.-]{3,64}$/);

const RE_INTERNAL_TEST_EMAIL = new RegExp(/^\w+\+test.+@thirdweb\.com$/);
