/// --- Thirdweb Brige ---
import {
  TWBridge,
  API_KEY,
  WALLETS,
  PossibleWallet,
  w,
  SEPARATOR,
  SUB_SEPARATOR,
  bigNumberReplacer,
  FundWalletInput,
} from "./common";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { CoinbasePayIntegration } from "@thirdweb-dev/pay";
import { getRpcUrl } from "@thirdweb-dev/sdk";
import { Network, ThirdwebSDK, WalletSigner } from "@thirdweb-dev/sdk/solana";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { AbstractWallet } from "@thirdweb-dev/wallets/dist/declarations/src/wallets/base";

class ThirdwebBridge implements TWBridge {
  private walletMap: Map<string, AbstractWallet> = new Map();
  private activeWallet: PhantomWalletAdapter | undefined;
  private activeSDK: ThirdwebSDK | undefined;

  private updateSDKSigner(signer?: WalletSigner) {
    if (this.activeSDK) {
      if (signer) {
        // set signer if we got one
        this.activeSDK.wallet.connect(signer);
      } else {
        this.activeSDK.wallet.disconnect();
      }
    }
  }

  public initialize(chain: Network, options: string) {
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
    this.activeSDK = ThirdwebSDK.fromNetwork(rpcUrl, storage);
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
    wallet: PossibleWallet = "phantom",
    chainId?: number | undefined,
  ) {
    if (!this.activeSDK) {
      throw new Error("SDK not initialized");
    }
    if (chainId === 0) {
      chainId = undefined;
    }
    const solWallet = new PhantomWalletAdapter();
    if (!solWallet.connected) {
      await solWallet.connect();
    }
    if (!solWallet.publicKey) {
      throw new Error("no public key");
    }
    this.activeWallet = solWallet;
    this.updateSDKSigner(solWallet);
    return solWallet.publicKey.toBase58();
  }
  public async disconnect() {
    if (this.activeWallet) {
      await this.activeWallet.disconnect();
      this.activeWallet = undefined;
      this.updateSDKSigner();
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async switchNetwork(chainId: number) {
    throw new Error("Cannot switch network programmatically on solana");
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
    let typeOrIdl: string | undefined;
    if (firstArg.length > 1) {
      try {
        typeOrIdl = JSON.parse(firstArg[1]); // try to parse ABI
      } catch (e) {
        typeOrIdl = firstArg[1];
      }
    }
    const contract = typeOrIdl
      ? await this.activeSDK.getProgram(addrOrSDK, typeOrIdl as any)
      : await this.activeSDK.getProgram(addrOrSDK);
    console.log("contract", contract);
    if (routeArgs.length === 2) {
      const result = await contract[routeArgs[1]](...parsedArgs);
      console.log("result", result);
      return JSON.stringify({ result: result }, bigNumberReplacer);
    } else if (routeArgs.length === 3) {
      const result = await contract[routeArgs[1]][routeArgs[2]](...parsedArgs);
      return JSON.stringify({ result: result }, bigNumberReplacer);
    } else if (routeArgs.length === 4) {
      const result = await contract[routeArgs[1]][routeArgs[2]][routeArgs[3]](
        ...parsedArgs,
      );
      return JSON.stringify({ result: result }, bigNumberReplacer);
    } else {
      throw new Error("Invalid Route");
    }
  }
  public async fundWallet(options: string) {
    if (!this.activeSDK) {
      throw new Error("SDK not initialized");
    }
    const { appId, ...fundOptions } = JSON.parse(options) as FundWalletInput;
    const cbPay = new CoinbasePayIntegration({ appId });
    return await cbPay.fundWallet({ ...fundOptions, chainId: -1 });
  }
}

// add the bridge to the window object type
w.bridge = new ThirdwebBridge();

/// --- End Thirdweb Brige ---
