/// --- Thirdweb Brige ---
import {
  API_KEY,
  bigNumberReplacer,
  FundWalletInput,
  PossibleWallet,
  SEPARATOR,
  SUB_SEPARATOR,
  TWBridge,
  w,
  WALLETS,
} from "./common";
import { CoinbasePayIntegration } from "@thirdweb-dev/pay";
import { ChainOrRpc, ThirdwebSDK, getRpcUrl } from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { AbstractWallet } from "@thirdweb-dev/wallets/dist/declarations/src/wallets/base";
import type { ContractInterface, Signer } from "ethers";

class ThirdwebBridge implements TWBridge {
  private walletMap: Map<string, AbstractWallet> = new Map();
  private activeWallet: AbstractWallet | undefined;
  private initializedChain: ChainOrRpc | undefined;
  private activeSDK: ThirdwebSDK | undefined;

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
  }

  public initialize(chain: ChainOrRpc, options: string) {
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
    const rpcUrl = chain.startsWith("http") ? chain : getRpcUrl(chain, API_KEY);
    this.activeSDK = new ThirdwebSDK(rpcUrl, sdkOptions, storage);
    for (let wallet of WALLETS) {
      const walletInstance = new wallet({
        appName: sdkOptions.wallet?.appName || "thirdweb powered dApp",
        ...sdkOptions.wallet?.extras,
      });
      walletInstance.on("connect", async () =>
        this.updateSDKSigner(await walletInstance.getSigner()),
      );
      walletInstance.on("change", async () =>
        this.updateSDKSigner(await walletInstance.getSigner()),
      );
      walletInstance.on("disconnect", () => this.updateSDKSigner());

      this.walletMap.set(wallet.id, walletInstance);
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
      await walletInstance.connect(chainId);
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
