/**
 * @internal
 */
export type InjectedWalletLocale = {
  connectionScreen: {
    failed: string;
    inProgress: string;
    instruction: string;
    retry: string;
  };
  getStartedLink: string;
  getStartedScreen: {
    instruction: string;
  };
  scanScreen: { instruction: string };
  download: {
    chrome: string;
    android: string;
    iOS: string;
  };
};
