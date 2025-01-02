export type WalletInfo = {
  id: string;
  name: string;
  homepage: string;
  image_id: string;
  app: {
    browser: string | null;
    ios: string | null;
    android: string | null;
    mac: string | null;
    windows: string | null;
    linux: string | null;
    chrome: string | null;
    firefox: string | null;
    safari: string | null;
    edge: string | null;
    opera: string | null;
  };
  rdns: string | null;
  mobile: {
    native: string | null;
    universal: string | null;
  };
  desktop: {
    native: string | null;
    universal: string | null;
  };
  deepLink?: {
    mobile: string;
  };
};
