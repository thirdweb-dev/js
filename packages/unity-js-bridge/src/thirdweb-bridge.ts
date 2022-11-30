/// --- Thirdweb Brige ---
import { ChainOrRpc, ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { CoinbaseWallet } from "@thirdweb-dev/wallets";
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

const WALLETS = [CoinbaseWallet] as const;

interface TWBridge {
  initialize: (chain: ChainOrRpc, options: string) => void;
  connect: (
    wallet: typeof WALLETS[number]["id"],
    chainId?: number,
  ) => Promise<string>;
  disconnect: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
  invoke: (route: string, payload: string) => Promise<string | undefined>;
}

const w = window;

class ThirdwebBridge implements TWBridge {
  private walletMap: Map<string, CoinbaseWallet> = new Map();
  private activeWallet: CoinbaseWallet | undefined;
  private initializedChain: ChainOrRpc | undefined;
  private activeSDK: ThirdwebSDK | undefined;

  private async updateSDKSigner() {
    if (this.activeSDK) {
      let signer: ethers.Signer | undefined = undefined;
      if (this.activeWallet) {
        signer = await this.activeWallet.getSigner();
      }
      if (signer) {
        // set signer if we got one
        this.activeSDK.updateSignerOrProvider(signer);
      } else if (this.initializedChain) {
        // reset back to provider only in case signer gets reomved (disconnect case)
        this.activeSDK.updateSignerOrProvider(this.initializedChain);
      }
    }
  }

  public initialize(chain: ChainOrRpc, options: string) {
    this.initializedChain = chain;
    console.debug("thirdwebSDK initialization:", chain, options);
    const sdkOptions = JSON.parse(options);
    const storage =
      sdkOptions && sdkOptions.ipfsGatewayUrl
        ? new ThirdwebStorage({
            gatewayUrls: {
              "ipfs://": [sdkOptions.ipfsGatewayUrl],
            },
          })
        : new ThirdwebStorage();

    this.activeSDK = new ThirdwebSDK(chain, sdkOptions, storage);
    w.thirdweb = this.activeSDK;
    for (let wallet of WALLETS) {
      const walletInstance = new wallet();
      walletInstance.on("connect", () => this.updateSDKSigner());
      walletInstance.on("disconnect", () => this.updateSDKSigner());
      walletInstance.on("change", () => this.updateSDKSigner());
      this.walletMap.set(wallet.id, walletInstance);
    }
  }
  public async connect(
    wallet = "coinbaseWallet",
    chainId?: number | undefined,
  ) {
    if (!this.activeSDK) {
      throw new Error("SDK not initialized");
    }
    const walletInstance = this.walletMap.get(wallet);
    if (walletInstance) {
      await walletInstance.connect(chainId);
      this.activeWallet = walletInstance;
      await this.updateSDKSigner();
      return await this.activeSDK.wallet.getAddress();
    } else {
      throw new Error("Invalid Wallet");
    }
  }
  public async disconnect() {
    if (this.activeWallet) {
      await this.activeWallet.disconnect();
      await this.updateSDKSigner();
    }
  }
  public async switchNetwork(chainId: number) {
    if (chainId && this.activeWallet && "switchChain" in this.activeWallet) {
      await this.activeWallet.switchChain(chainId);
      await this.updateSDKSigner();
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
}

// add the bridge to the window object type
w.bridge = new ThirdwebBridge();

/// --- End Thirdweb Brige ---
