/// --- Thirdweb Brige ---
import { ThirdwebAuth } from "@thirdweb-dev/auth";
import { CoinbasePayIntegration, FundWalletOptions } from "@thirdweb-dev/pay";
import { ThirdwebSDK, ChainIdOrName } from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { AbstractBrowserWallet } from "@thirdweb-dev/wallets/evm/wallets/base";
import { CoinbaseWallet } from "@thirdweb-dev/wallets/evm/wallets/coinbase-wallet";
import { EthersWallet } from "@thirdweb-dev/wallets/evm/wallets/ethers";
import { InjectedWallet } from "@thirdweb-dev/wallets/evm/wallets/injected";
import { MetaMask } from "@thirdweb-dev/wallets/evm/wallets/metamask";
import { WalletConnect } from "@thirdweb-dev/wallets/evm/wallets/wallet-connect";
import { BigNumber } from "ethers";
import type { ContractInterface, Signer } from "ethers";
import { AsyncStorage } from "@thirdweb-dev/wallets";

declare global {
  interface Window {
    bridge: TWBridge;
  }
}

const API_KEY =
  "339d65590ba0fa79e4c8be0af33d64eda709e13652acb02c6be63f5a1fbef9c3";
const TW_WC_PROJECT_ID = "145769e410f16970a79ff77b2d89a1e0";
const SEPARATOR = "/";
const SUB_SEPARATOR = "#";

// big number transform
const bigNumberReplacer = (_key: string, value: any) => {
  // if we find a BigNumber then make it into a string (since that is safe)
  if (
    BigNumber.isBigNumber(value) ||
    (typeof value === "object" &&
      value !== null &&
      value.type === "BigNumber" &&
      "hex" in value)
  ) {
    return BigNumber.from(value).toString();
  }
  return value;
};

const WALLETS = [
  MetaMask,
  InjectedWallet,
  WalletConnect,
  CoinbaseWallet,
] as const;

type PossibleWallet = (typeof WALLETS)[number]["id"];

type FundWalletInput = FundWalletOptions & {
  appId: string;
};

const PREFIX = "__TW__";

export class WebGLLocalStorage implements AsyncStorage {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  getItem(key: string) {
    return new Promise<string | null>((res) => {
      res(window.localStorage.getItem(`${PREFIX}/${this.name}/${key}`));
    });
  }

  setItem(key: string, value: string) {
    return new Promise<void>((res, rej) => {
      try {
        window.localStorage.setItem(`${PREFIX}/${this.name}/${key}`, value);
        res();
      } catch (e) {
        rej(e);
      }
    });
  }

  removeItem(key: string) {
    return new Promise<void>((res) => {
      window.localStorage.removeItem(`${PREFIX}/${this.name}/${key}`);
      res();
    });
  }
}

interface TWBridge {
  initialize: (chain: ChainIdOrName, options: string) => void;
  connect: (wallet: PossibleWallet, chainId?: number) => Promise<string>;
  disconnect: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
  invoke: (route: string, payload: string) => Promise<string | undefined>;
  invokeListener: (
    taskId: string,
    route: string,
    payload: string,
    action: any,
    callback: (jsAction: any, jsTaskId: string, jsResult: string) => void,
  ) => void;
  fundWallet: (options: string) => Promise<void>;
}

const w = window;
const coordinatorStorage = new WebGLLocalStorage("coordinator");

class ThirdwebBridge implements TWBridge {
  private walletMap: Map<string, AbstractBrowserWallet> = new Map();
  private activeWallet: AbstractBrowserWallet | undefined;
  private initializedChain: ChainIdOrName | undefined;
  private activeSDK: ThirdwebSDK | undefined;
  private auth: ThirdwebAuth | undefined;

  private updateSDKSigner(signer?: Signer) {
    if (this.activeSDK) {
      if (signer) {
        // set signer if we got one
        this.activeSDK.updateSignerOrProvider(signer);
      } else if (this.initializedChain) {
        // reset back to provider only in case signer gets reomved (disconnect case)
        this.activeSDK.updateSignerOrProvider(this.initializedChain);
      }
    }

    if (signer) {
      if (this.auth) {
        this.auth.updateWallet(new EthersWallet(signer));
      } else {
        // Domain will always be overwritten in the actual auth call
        this.auth = new ThirdwebAuth(new EthersWallet(signer), "example.com");
      }
    }
  }

  public initialize(chain: ChainIdOrName, options: string) {
    this.initializedChain = chain;
    console.debug("thirdwebSDK initialization:", chain, options);
    const sdkOptions = JSON.parse(options);
    const storage =
      sdkOptions?.storage && sdkOptions?.storage?.ipfsGatewayUrl
        ? new ThirdwebStorage({
            gatewayUrls: {
              "ipfs://": [sdkOptions.storage.ipfsGatewayUrl],
            },
          })
        : new ThirdwebStorage();
    sdkOptions.thirdwebApiKey = sdkOptions.thirdwebApiKey || API_KEY;
    this.activeSDK = new ThirdwebSDK(chain, sdkOptions, storage);
    for (let possibleWallet of WALLETS) {
      let walletInstance: AbstractBrowserWallet;
      switch (possibleWallet.id) {
        case "injected":
          walletInstance = new InjectedWallet({
            dappMetadata: {
              name: sdkOptions.wallet?.appName || "thirdweb powered dApp",
              url: sdkOptions.wallet?.appUrl || "",
            },
            walletStorage: new WebGLLocalStorage(possibleWallet.id),
            coordinatorStorage: coordinatorStorage,
            connectorStorage: new WebGLLocalStorage(
              possibleWallet.id + "_connector",
            ),
          });
          break;
        case "metamask":
          walletInstance = new MetaMask({
            dappMetadata: {
              name: sdkOptions.wallet?.appName || "thirdweb powered dApp",
              url: sdkOptions.wallet?.appUrl || "",
              logoUrl: sdkOptions.wallet?.appLogoUrl || "",
            },
            walletStorage: new WebGLLocalStorage(possibleWallet.id),
            coordinatorStorage: coordinatorStorage,
            connectorStorage: new WebGLLocalStorage(
              possibleWallet.id + "_connector",
            ),
          });
          break;
        case "walletConnect":
          walletInstance = new WalletConnect({
            dappMetadata: {
              name: sdkOptions.wallet?.appName || "thirdweb powered dApp",
              url: sdkOptions.wallet?.appUrl || "",
            },
            walletStorage: new WebGLLocalStorage(possibleWallet.id),
            coordinatorStorage: coordinatorStorage,
            projectId: TW_WC_PROJECT_ID,
          });
          break;
        case "coinbaseWallet":
          walletInstance = new CoinbaseWallet({
            dappMetadata: {
              name: sdkOptions.wallet?.appName || "thirdweb powered dApp",
              url: sdkOptions.wallet?.appUrl || "",
            },
            walletStorage: new WebGLLocalStorage(possibleWallet.id),
            coordinatorStorage: coordinatorStorage,
          });
          break;
      }
      if (walletInstance) {
        walletInstance.on("connect", async () =>
          this.updateSDKSigner(await walletInstance.getSigner()),
        );
        walletInstance.on("change", async () =>
          this.updateSDKSigner(await walletInstance.getSigner()),
        );
        walletInstance.on("disconnect", () => this.updateSDKSigner());

        this.walletMap.set(possibleWallet.id, walletInstance);
      }
    }
  }

  public async connect(
    wallet: PossibleWallet = "injected",
    chainId?: number | undefined,
  ) {
    if (!this.activeSDK) {
      throw new Error("SDK not initialized");
    }
    if (chainId === 0) {
      chainId = undefined;
    }
    const walletInstance = this.walletMap.get(wallet);
    if (walletInstance) {
      await walletInstance.connect({ chainId });
      this.activeWallet = walletInstance;
      this.updateSDKSigner(await walletInstance.getSigner());
      return await this.activeSDK.wallet.getAddress();
    } else {
      throw new Error("Invalid Wallet");
    }
  }

  public async disconnect() {
    if (this.activeWallet) {
      await this.activeWallet.disconnect();
      this.activeWallet = undefined;
      this.updateSDKSigner();
    }
  }

  public async switchNetwork(chainId: number) {
    if (chainId && this.activeWallet && "switchChain" in this.activeWallet) {
      await this.activeWallet.switchChain(chainId);
      this.updateSDKSigner(await this.activeWallet.getSigner());
    } else {
      throw new Error("Error Switching Network");
    }
  }

  public async invoke(route: string, payload: string) {
    if (!this.activeSDK) {
      throw new Error("SDK not initialized");
    }
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
        const result = await this.activeSDK[prop][routeArgs[1]](...parsedArgs);
        return JSON.stringify({ result: result }, bigNumberReplacer);
      } else if (routeArgs.length === 2) {
        // @ts-expect-error need to type-guard this properly
        const result = await this.activeSDK[routeArgs[1]](...parsedArgs);
        return JSON.stringify({ result: result }, bigNumberReplacer);
      } else {
        throw new Error("Invalid Route");
      }
    }

    if (addrOrSDK.startsWith("auth")) {
      if (!this.auth) {
        throw new Error("You need to connect a wallet to use auth!");
      }

      const result = await this.auth.login({ domain: parsedArgs[0] });
      return JSON.stringify({ result: result });
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
        ? await this.activeSDK.getContract(addrOrSDK, typeOrAbi)
        : await this.activeSDK.getContract(addrOrSDK);
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
  }

  public async invokeListener(
    taskId: string,
    route: string,
    payload: string,
    action: any,
    callback: (jsAction: any, jsTaskId: string, jsResult: string) => void,
  ) {
    if (!this.activeSDK) {
      throw new Error("SDK not initialized");
    }

    const routeArgs = route.split(SEPARATOR);
    const firstArg = routeArgs[0].split(SUB_SEPARATOR);
    const addrOrSDK = firstArg[0];

    const fnArgs = JSON.parse(payload).arguments;
    const parsedFnArgs = fnArgs.map((arg: unknown) => {
      try {
        return typeof arg === "string" &&
          (arg.startsWith("{") || arg.startsWith("["))
          ? JSON.parse(arg)
          : arg;
      } catch (e) {
        return arg;
      }
    });

    console.debug(
      "thirdwebSDK invoke listener:",
      taskId,
      route,
      parsedFnArgs,
      action,
    );

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
        ? await this.activeSDK.getContract(addrOrSDK, typeOrAbi)
        : await this.activeSDK.getContract(addrOrSDK);

      if (routeArgs.length === 2) {
        // @ts-expect-error need to type-guard this properly
        await contract[routeArgs[1]](...parsedFnArgs, (result: any) =>
          callback(action, taskId, JSON.stringify(result, bigNumberReplacer)),
        );
      } else if (routeArgs.length === 3) {
        // @ts-expect-error need to type-guard this properly
        await contract[routeArgs[1]][routeArgs[2]](
          ...parsedFnArgs,
          (result: any) =>
            callback(action, taskId, JSON.stringify(result, bigNumberReplacer)),
        );
      } else if (routeArgs.length === 4) {
        // @ts-expect-error need to type-guard this properly
        await contract[routeArgs[1]][routeArgs[2]][routeArgs[3]](
          ...parsedFnArgs,
          (result: any) =>
            callback(action, taskId, JSON.stringify(result, bigNumberReplacer)),
        );
      } else {
        throw new Error("Invalid Route");
      }
    }
  }

  public async fundWallet(options: string) {
    if (!this.activeSDK) {
      throw new Error("SDK not initialized");
    }
    const { appId, ...fundOptions } = JSON.parse(options) as FundWalletInput;
    const cbPay = new CoinbasePayIntegration({ appId });

    return await cbPay.fundWallet(fundOptions);
  }
}

// add the bridge to the window object type
w.bridge = new ThirdwebBridge();

/// --- End Thirdweb Brige ---
