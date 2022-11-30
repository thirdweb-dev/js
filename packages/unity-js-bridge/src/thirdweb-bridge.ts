/// --- Thirdweb Brige ---
import { ChainOrRpc, ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  CoinbaseWalletConnector,
  InjectedConnector,
  MetaMaskConnector,
  WalletConnectConnector,
} from "@thirdweb-dev/wallets";
import { ContractInterface, ethers } from "ethers";

declare global {
  interface Window {
    bridge: TWBridge;
    thirdweb: ThirdwebSDK;
  }
}

const SEPARATOR = "/";
const SUB_SEPARATOR = "#";

// big number transform
const bigNumberReplacer = (_key: string, value: any) => {
  // if we find a BigNumber then make it into a string (since that is safe)
  if (
    ethers.BigNumber.isBigNumber(value) ||
    (typeof value === "object" &&
      value !== null &&
      value.type === "BigNumber" &&
      "hex" in value)
  ) {
    return ethers.BigNumber.from(value).toString();
  }
  return value;
};

interface TWBridge {
  initialize: (chain: ChainOrRpc, options: string) => void;
  connect: (wallet: keyof typeof WALLET_MAP) => Promise<string>;
  disconnect: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
  invoke: (route: string, payload: string) => Promise<string | undefined>;
}

// add the bridge to the window object type

const WALLET_MAP = {
  injected: InjectedConnector,
  metamask: MetaMaskConnector,
  walletConnect: WalletConnectConnector,
  coinbase: CoinbaseWalletConnector,
} as const;

// TODO - fix any;
let activeWallet: any;

const w = window;

async function updateSDKSigner() {
  if (w.thirdweb && activeWallet) {
    w.thirdweb.updateSignerOrProvider(await activeWallet.getSigner());
  }
}

w.bridge = {
  initialize: (chain: ChainOrRpc, options: string) => {
    console.debug("thirdwebSDK initialization:", chain, options);
    const sdkOptions = JSON.parse(options);
    let storage = new ThirdwebStorage();
    if (sdkOptions && sdkOptions.ipfsGatewayUrl) {
      storage = new ThirdwebStorage({
        gatewayUrls: {
          "ipfs://": [sdkOptions.ipfsGatewayUrl],
        },
      });
    }
    w.thirdweb = new ThirdwebSDK(chain, sdkOptions, storage);
  },
  connect: async (wallet: keyof typeof WALLET_MAP = "injected") => {
    if (wallet in WALLET_MAP) {
      const walletInstance = new WALLET_MAP[wallet]({
        options: { appName: "" },
      });
      await walletInstance.connect();
      activeWallet = walletInstance;
      await updateSDKSigner();
      return await w.thirdweb.wallet.getAddress();
    } else {
      throw new Error("Invalid Wallet");
    }
  },
  disconnect: async () => {
    if (activeWallet) {
      await activeWallet.disconnect();
    }
  },
  switchNetwork: async (chainId: number) => {
    if (chainId && activeWallet && "switchChain" in activeWallet) {
      await activeWallet.switchChain(chainId);
      await updateSDKSigner();
    } else {
      throw new Error("Error Switching Network");
    }
  },
  invoke: async (route: string, payload: string) => {
    const routeArgs = route.split(SEPARATOR);
    const firstArg = routeArgs[0].split(SUB_SEPARATOR);
    const addrOrSDK = firstArg[0];

    const fnArgs = JSON.parse(payload).arguments;
    const parsedArgs = fnArgs.map((arg: unknown) => {
      try {
        return typeof arg === "string" &&
          (arg.startsWith("{") || arg.startsWith("["))
          ? JSON.parse(arg)
          : arg;
      } catch (e) {
        return arg;
      }
    });
    console.debug("thirdwebSDK call:", route, parsedArgs);

    // wallet call
    if (addrOrSDK.startsWith("sdk")) {
      let prop = undefined;
      if (firstArg.length > 1) {
        prop = firstArg[1];
      }
      if (prop && routeArgs.length === 2) {
        // @ts-expect-error need to type-guard this properly
        const result = await w.thirdweb[prop][routeArgs[1]](...parsedArgs);
        return JSON.stringify({ result: result }, bigNumberReplacer);
      } else if (routeArgs.length === 2) {
        // @ts-expect-error need to type-guard this properly
        const result = await w.thirdweb[routeArgs[1]](...parsedArgs);
        return JSON.stringify({ result: result }, bigNumberReplacer);
      } else {
        throw new Error("Invalid Route");
      }
    }

    // contract call
    if (addrOrSDK.startsWith("0x")) {
      let typeOrAbi: string | ContractInterface | undefined;
      if (firstArg.length > 1) {
        try {
          typeOrAbi = JSON.parse(firstArg[1]); // try to parse ABI
        } catch (e) {
          typeOrAbi = firstArg[1];
        }
      }
      const contract = typeOrAbi
        ? await w.thirdweb.getContract(addrOrSDK, typeOrAbi)
        : await w.thirdweb.getContract(addrOrSDK);
      if (routeArgs.length === 2) {
        // @ts-expect-error need to type-guard this properly
        const result = await contract[routeArgs[1]](...parsedArgs);
        return JSON.stringify({ result: result }, bigNumberReplacer);
      } else if (routeArgs.length === 3) {
        // @ts-expect-error need to type-guard this properly
        const result = await contract[routeArgs[1]][routeArgs[2]](
          ...parsedArgs,
        );
        return JSON.stringify({ result: result }, bigNumberReplacer);
      } else if (routeArgs.length === 4) {
        // @ts-expect-error need to type-guard this properly
        const result = await contract[routeArgs[1]][routeArgs[2]][routeArgs[3]](
          ...parsedArgs,
        );
        return JSON.stringify({ result: result }, bigNumberReplacer);
      } else {
        throw new Error("Invalid Route");
      }
    }
  },
};

/// --- End Thirdweb Brige ---
