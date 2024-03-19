/**
 * @internal
 */
const injectedWalletLocaleEn = (wallet: string) => ({
  connectionScreen: {
    inProgress: "Awaiting Confirmation",
    failed: "Connection failed",
    instruction: `Accept the connection request in ${wallet} wallet`,
    retry: "Try Again",
  },
  getStartedScreen: {
    instruction: `Scan the QR code to download ${wallet} app`,
  },
  scanScreen: {
    instruction: `Scan the QR code with ${wallet} wallet app to connect`,
  },
  getStartedLink: `Don't have ${wallet} wallet?`,
});

export default injectedWalletLocaleEn;
