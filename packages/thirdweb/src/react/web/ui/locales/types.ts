/**
 * @locale
 */
export type ThirdwebLocale = {
  wallets: {
    safeWallet: {
      accountDetailsScreen: {
        connectToSafe: string;
        connecting: string;
        dashboardLink: string;
        failedToConnect: string;
        failedToSwitch: string;
        findSafeAddressIn: string;
        invalidChainConfig: string;
        mainnets: string;
        network: string;
        safeAddress: string;
        selectNetworkPlaceholder: string;
        switchNetwork: string;
        switchingNetwork: string;
        testnets: string;
        title: string;
      };
      connectWalletScreen: {
        learnMoreLink: string;
        subtitle: string;
        title: string;
      };
    };
    smartWallet: {
      connecting: string;
      failedToConnect: string;
      wrongNetworkScreen: {
        failedToSwitch: string;
        subtitle: string;
        title: string;
      };
    };
    walletConnect: { scanInstruction: string };
  };
};
