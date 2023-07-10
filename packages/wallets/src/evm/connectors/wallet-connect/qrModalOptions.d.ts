import type { WalletConnectModalConfig } from "@walletconnect/modal";

export type QRModalOptions = {
  /**
   * When using Web3Modal in standalone mode (without wagmi) you can define array of custom chains via this option.
   *
   * Defaults to `undefined`
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#standalonechains-optional
   */
    standaloneChains?: string[];
  /**
   * You can define an array of custom mobile wallets.
   *
   * Note: you will also need to add appropriate wallet images in walletImages.
   *
   * Native link represents deeplinking url like `rainbow://` and Universal link represent webpage link that can redirect to the app or fallback page.
   *
   * Defaults to `undefined`
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#mobilewallets-optional
   */
  mobileWallets?: WalletConnectModalConfig['mobileWallets']
  /**
   * You can define an array of custom desktop or web based wallets.
   *
   * Note: you will also need to add appropriate wallet images in walletImages.
   *
   * Native link represents deeplinking url like `ledgerlive://` and Universal link represents webpage link that can redirect to the app or fallback page.
   *
   * Defaults to `undefined`
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#desktopwallets-optional
   */
  desktopWallets?: WalletConnectModalConfig['desktopWallets'];
  /**
   * Array of wallet id's and their logo mappings.
   *
   * This will override default logos.
   *
   * Id's in this case can be: Explorer id's, wallet id's you provided in mobileWallets or desktopWallets and Wagmi connector id's.
   *
   * Defaults to `undefined`
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#walletimages-optional
   */
  walletImages?: Record<string, string>;
  /**
   * Array of chain id's and their logo mappings.
   *
   * This will override default logos.
   *
   * You can find detailed chain data at chainlist.org
   *
   * Defaults to `undefined`
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#chainimages-optional
   */
  chainImages?: Record<string, string>;
  /**
   * Array of token symbols and their logo mappings.
   *
   * Defaults to `undefined`
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#tokenimages-optional
   */
  tokenImages?: Record<string, string>;
  /**
   * Allows to override default token(s) address for each chain to show custom balances in account view.
   *
   * Defaults to `undefined`
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#tokencontracts-optional
   */
  tokenContracts?: Record<number, string>;
  /**
   * If more than 1 chain was provided in modal or wagmi configuration, users will be show network selection view before selecting a wallet.
   *
   * This option can enable or disable this behavior.
   *
   * Defaults to `false`
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#enablenetworkview-optional
   */
  enableNetworkView?: boolean;
  /**
   * Option to enable or disable the modal's account view.
   *
   * The default setting is set to `true`
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#enableaccountview-optional
   */
  enableAccountView?: boolean;
  /**
   * Option to enable or disable wallet fetching from our Explorer.
   *
   * Defaults to `true`
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#enableexplorer-optional
   */
  enableExplorer?: boolean;
  /**
   * Allows to override default recommended wallets that are fetched from our Explorer API.
   *
   * You can define an array of wallet id's you'd like to prioritise (order is respected).
   *
   * You can get / copy these id's from the explorer link mentioned before.
   *
   * If you want to completely disable recommended wallets, you can set this option to `"NONE"`.
   *
   * Defaults to `undefined`
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#explorerrecommendedwalletids-optional
   */
  explorerRecommendedWalletIds?: string[] | "NONE";
  /**
   * Allows to exclude wallets that are fetched from our Explorer API.
   *
   * You can define an array of wallet id's you'd like to exclude.
   *
   * You can get / copy these id's from the explorer link mentioned before.
   *
   * If you want to exclude all wallets, you can set this option to ALL, however if `explorerRecommendedWalletIds` were defined, they will still be fetched.
   *
   * Defaults to `undefined`
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#explorerexcludedwalletids-optional
   */
  explorerExcludedWalletIds?: string[] | "ALL";
  /**
   * String URL to your terms of service page, if specified will append special "legal info" footer to the modal.
   *
   * Defaults to `undefined`
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#termsofserviceurl-optional
   */
  termsOfServiceUrl?: string;
  /**
   * String URL to your privacy policy page, if specified will append special "legal info" footer to the modal.
   *
   * Defaults to `undefined`
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#privacypolicyurl-optional
   */
  privacyPolicyUrl?: string;

  /**
   * Allows to override Web3Modal's css styles.
   *
   * See [theming](https://docs.walletconnect.com/2.0/web3modal/theming) for all available options.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#themevariables-optional
   */
  themeVariables?: WalletConnectModalConfig['themeVariables']
  /**
   * Puts Web3Modal into dark or light mode. Defaults to user's system preference.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#thememode-optional
   */
  themeMode?: "dark" | "light";
};

