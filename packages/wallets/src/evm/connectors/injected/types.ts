type AddEthereumChainParameter = {
  /** A 0x-prefixed hexadecimal string */
  chainId: string;
  chainName: string;
  nativeCurrency?: {
    name: string;
    /** 2-6 characters long */
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  /** Currently ignored. */
  iconUrls?: string[];
};
type WalletPermissionCaveat = {
  type: string;
  value: any;
};
type WalletPermission = {
  caveats: WalletPermissionCaveat[];
  date: number;
  id: string;
  invoker: `http://${string}` | `https://${string}`;
  parentCapability: "eth_accounts" | string;
};

type InjectedProviderFlags = {
  isApexWallet?: true;
  isAvalanche?: true;
  isBitKeep?: true;
  isBitski?: true;
  isBraveWallet?: true;
  isCoinbaseWallet?: true;
  isExodus?: true;
  isFrame?: true;
  isKuCoinWallet?: true;
  isMathWallet?: true;
  isMetaMask?: true;
  isOneInchAndroidWallet?: true;
  isOneInchIOSWallet?: true;
  isOpera?: true;
  isPhantom?: true;
  isPortal?: true;
  isRainbow?: true;
  isTally?: true;
  isTokenPocket?: true;
  isTokenary?: true;
  isTrust?: true;
  isTrustWallet?: true;
  isXDEFI?: true;
  isZerion?: true;
  isOkxWallet?: true;
  isCoreWallet?: true;
  isDefiWallet?: true;
  isRabbyWallet?: true;
  isCoin98Wallet?: true;
};
type InjectedProviders = InjectedProviderFlags & {
  isMetaMask: true;
  /** Only exists in MetaMask as of 2022/04/03 */
  _events: {
    connect?: () => void;
  };
  /** Only exists in MetaMask as of 2022/04/03 */
  _state?: {
    accounts?: string[];
    initialized?: boolean;
    isConnected?: boolean;
    isPermanentlyDisconnected?: boolean;
    isUnlocked?: boolean;
  };
};
export interface Ethereum extends InjectedProviders {
  on?: (...args: any[]) => void;
  removeListener?: (...args: any[]) => void;
  providers?: Ethereum[];
  /**
   * EIP-1193: Ethereum Provider JavaScript API
   * https://eips.ethereum.org/EIPS/eip-1193
   */
  request(args: { method: "eth_accounts" }): Promise<string[]>;
  request(args: { method: "eth_chainId" }): Promise<string>;
  request(args: { method: "eth_requestAccounts" }): Promise<string[]>;
  /**
   * EIP-1474: Remote procedure call specification
   * https://eips.ethereum.org/EIPS/eip-1474
   */
  request(args: { method: "web3_clientVersion" }): Promise<string>;
  /**
   * EIP-2255: Wallet Permissions System
   * https://eips.ethereum.org/EIPS/eip-2255
   */
  request(args: {
    method: "wallet_requestPermissions";
    params: [
      {
        eth_accounts: Record<string, any>;
      },
    ];
  }): Promise<WalletPermission[]>;
  request(args: {
    method: "wallet_getPermissions";
  }): Promise<WalletPermission[]>;
  /**
   * EIP-3085: Wallet Add Ethereum Chain RPC Method
   * https://eips.ethereum.org/EIPS/eip-3085
   */
  request(args: {
    method: "wallet_addEthereumChain";
    params: AddEthereumChainParameter[];
  }): Promise<null>;
  /**
   * EIP-3326: Wallet Switch Ethereum Chain RPC Method
   * https://eips.ethereum.org/EIPS/eip-3326
   */
  request(args: {
    method: "wallet_switchEthereumChain";
    params: [
      {
        chainId: string;
      },
    ];
  }): Promise<null>;
}

export type { Ethereum as E };
