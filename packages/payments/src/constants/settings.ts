const isDev = (): boolean => {
  return !!(
    typeof window !== "undefined" &&
    window.localStorage.getItem("IS_PAPER_DEV") === "true"
  );
};

const isOldPaperDomain = (): boolean =>
  typeof window !== "undefined" && window.location.origin.includes("paper.xyz");

export const getPaperOriginUrl = (): string => {
  if (isDev()) {
    return (
      window.localStorage.getItem("PAPER_DEV_URL") ?? "http://localhost:3000"
    );
  }

  if (isOldPaperDomain()) {
    return window.location.origin;
  }

  return "https://payments.thirdweb.com";
};

// eslint-disable-next-line better-tree-shaking/no-top-level-side-effects
export const PAPER_APP_URL = getPaperOriginUrl();

export const CHECKOUT_WITH_ETH_IFRAME_URL = "/sdk/2022-08-12/checkout-with-eth";
export const CHECKOUT_WITH_CARD_IFRAME_URL =
  "/sdk/2022-08-12/checkout-with-card";
export const CREATE_WALLET_IFRAME_URL = "/sdk/v2/verify-email";
