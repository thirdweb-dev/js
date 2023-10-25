/// --- Thirdweb Brige ---
import { ThirdwebAuth } from "@thirdweb-dev/auth";
import { CoinbasePayIntegration, FundWalletOptions } from "@thirdweb-dev/pay";
import { ThirdwebSDK, ChainIdOrName } from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  DAppMetaData,
  SmartWalletConfig,
  walletIds,
} from "@thirdweb-dev/wallets";
import type { AbstractClientWallet } from "@thirdweb-dev/wallets/evm/wallets/base";
import { CoinbaseWallet } from "@thirdweb-dev/wallets/evm/wallets/coinbase-wallet";
import { LocalWallet } from "@thirdweb-dev/wallets/evm/wallets/local-wallet";
import { EthersWallet } from "@thirdweb-dev/wallets/evm/wallets/ethers";
import { InjectedWallet } from "@thirdweb-dev/wallets/evm/wallets/injected";
import { MetaMaskWallet } from "@thirdweb-dev/wallets/evm/wallets/metamask";
import { MagicLink } from "@thirdweb-dev/wallets/evm/wallets/magic";
import { SmartWallet } from "@thirdweb-dev/wallets/evm/wallets/smart-wallet";
import { WalletConnect } from "@thirdweb-dev/wallets/evm/wallets/wallet-connect";
import { PaperWallet } from "@thirdweb-dev/wallets/evm/wallets/paper-wallet";
import { EmbeddedWallet } from "@thirdweb-dev/wallets/evm/wallets/embedded-wallet";
import { BigNumber } from "ethers";
import {
  Ethereum,
  defaultChains,
  getChainByChainId,
} from "@thirdweb-dev/chains";
import type { ContractInterface, Signer } from "ethers";

declare global {
  interface Window {
    bridge: TWBridge;
  }
}

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
  MetaMaskWallet,
  InjectedWallet,
  WalletConnect,
  PaperWallet,
  CoinbaseWallet,
  LocalWallet,
  MagicLink,
  SmartWallet,
  EmbeddedWallet,
] as const;

type PossibleWallet = (typeof WALLETS)[number]["id"];

type FundWalletInput = FundWalletOptions & {
  appId: string;
};

interface TWBridge {
  initialize: (chain: ChainIdOrName, options: string) => void;
  connect: (
    wallet: PossibleWallet,
    chainId: string,
    password?: string,
    email?: string,
    personalWallet?: PossibleWallet,
    useGoogle?: string,
  ) => Promise<string>;
  disconnect: () => Promise<void>;
  switchNetwork: (chainId: string) => Promise<void>;
  invoke: (route: string, payload: string) => Promise<string | undefined>;
  invokeListener: (
    taskId: string,
    route: string,
    payload: string,
    action: any,
    callback: (jsAction: any, jsTaskId: string, jsResult: string) => void,
  ) => void;
  fundWallet: (options: string) => Promise<void>;
  exportWallet: (password: string) => Promise<string>;
}

const w = window;

class ThirdwebBridge implements TWBridge {
  private walletMap: Map<string, AbstractClientWallet> = new Map();
  private activeWallet: AbstractClientWallet | undefined;
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
    let supportedChains;
    if (sdkOptions?.supportedChains) {
      try {
        supportedChains = sdkOptions.supportedChains.map((chainData: any) => {
          return {
            ...getChainByChainId(BigNumber.from(chainData.chainId).toNumber()),
            rpc: chainData.rpcUrls,
          };
        });
      } catch (error) {
        console.warn(
          "error parsing supported chains, using default chains",
          error,
        );
        supportedChains = defaultChains;
      }
    } else {
      console.debug("no supportedChains passed, using default chains");
      supportedChains = defaultChains;
    }
    sdkOptions.supportedChains = supportedChains;

    const storage =
      sdkOptions?.storage && sdkOptions?.storage?.ipfsGatewayUrl
        ? new ThirdwebStorage({
            gatewayUrls: {
              "ipfs://": [sdkOptions.storage.ipfsGatewayUrl],
            },
            clientId: sdkOptions.clientId,
          })
        : new ThirdwebStorage({
            clientId: sdkOptions.clientId,
          });
    this.activeSDK = new ThirdwebSDK(chain, sdkOptions, storage);
    for (const possibleWallet of WALLETS) {
      let walletInstance: AbstractClientWallet;
      const dappMetadata: DAppMetaData = {
        name: sdkOptions.wallet?.appName || "thirdweb powered game",
        url: sdkOptions.wallet?.appUrl || "https://thirdweb.com",
        description: sdkOptions.wallet?.appDescription || "",
        logoUrl: sdkOptions.wallet?.appIcons?.[0] || "",
        ...sdkOptions.wallet?.extras,
      };
      switch (possibleWallet.id) {
        case "injected":
          walletInstance = new InjectedWallet({
            dappMetadata,
            chains: supportedChains,
            clientId: sdkOptions.clientId,
          });
          break;
        case walletIds.metamask:
          walletInstance = new MetaMaskWallet({
            dappMetadata,
            chains: supportedChains,
            clientId: sdkOptions.clientId,
          });
          break;
        case walletIds.walletConnect:
          walletInstance = new WalletConnect({
            projectId: sdkOptions.wallet?.walletConnectProjectId,
            dappMetadata,
            chains: supportedChains,
            clientId: sdkOptions.clientId,
            qrModalOptions: {
              explorerRecommendedWalletIds:
                sdkOptions.wallet?.walletConnectExplorerRecommendedWalletIds,
            },
          });
          break;
        case walletIds.coinbase:
          walletInstance = new CoinbaseWallet({
            dappMetadata,
            chains: supportedChains,
            clientId: sdkOptions.clientId,
          });
          break;
        case walletIds.localWallet:
          walletInstance = new LocalWallet({
            dappMetadata,
            chains: supportedChains,
            clientId: sdkOptions.clientId,
          });
          break;
        case walletIds.magicLink:
          walletInstance = new MagicLink({
            dappMetadata,
            apiKey: sdkOptions.wallet?.magicLinkApiKey,
            emailLogin: true,
            chains: supportedChains,
            clientId: sdkOptions.clientId,
          });
          break;
        case walletIds.paper:
          walletInstance = new PaperWallet({
            paperClientId: sdkOptions.wallet?.paperClientId ?? "uninitialized",
            chain: Ethereum,
            dappMetadata,
            chains: supportedChains,
            clientId: sdkOptions.clientId,
            advancedOptions: {
              recoveryShareManagement: "USER_MANAGED",
            },
          });
          break;
        case walletIds.smartWallet:
          const config: SmartWalletConfig = {
            chain: chain,
            factoryAddress: sdkOptions.smartWalletConfig?.factoryAddress,
            clientId: sdkOptions.clientId,
            gasless: sdkOptions.smartWalletConfig?.gasless,
            bundlerUrl: sdkOptions.smartWalletConfig?.bundlerUrl,
            paymasterUrl: sdkOptions.smartWalletConfig?.paymasterUrl,
            // paymasterAPI: sdkOptions.smartWalletConfig?.paymasterAPI,
            entryPointAddress: sdkOptions.smartWalletConfig?.entryPointAddress,
          };
          walletInstance = new SmartWallet(config);
          break;
        case walletIds.embeddedWallet:
          walletInstance = new EmbeddedWallet({
            clientId: sdkOptions.clientId,
            chain: Ethereum,
            dappMetadata,
            chains: supportedChains,
          });
          break;
        default:
          throw new Error(`Unknown wallet type: ${possibleWallet.id}`);
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
    chainId: string,
    password?: string,
    email?: string,
    personalWallet: PossibleWallet = "localWallet",
    useGoogle?: string,
  ) {
    if (!this.activeSDK) {
      throw new Error("SDK not initialized");
    }
    const walletInstance = this.walletMap.get(wallet);
    const chainIdNumber = Number(chainId);
    if (walletInstance) {
      // local wallet needs to be generated or loaded before connecting
      if (walletInstance.walletId === walletIds.localWallet) {
        await this.initializeLocalWallet(password as string);
        walletInstance.connect({ chainId: chainIdNumber });
      }

      if (walletInstance.walletId === walletIds.magicLink) {
        const magicLinkWallet = walletInstance as MagicLink;
        if (!email) {
          throw new Error("Email is required for Magic Link Wallet");
        }
        await magicLinkWallet.connect({ chainId: chainIdNumber, email: email });
      } else if (walletInstance.walletId === walletIds.embeddedWallet) {
        const embeddedWallet = walletInstance as EmbeddedWallet;

        if (useGoogle?.toLowerCase() === "true") {
          const googleWindow = this.openGoogleSignInWindow();
          if (!googleWindow) {
            throw new Error("Failed to open google login window");
          }
          const authResult = await embeddedWallet.authenticate({
            strategy: "google",
          });
          await embeddedWallet.connect({
            chainId: chainIdNumber,
            authResult,
          });
        } else {
          if (!email) {
            throw new Error("Email is required for EmbeddedWallet");
          }
          const authResult = await embeddedWallet.authenticate({
            strategy: "iframe_otp",
            email,
          });
          await embeddedWallet.connect({
            chainId: chainIdNumber,
            authResult,
          });
        }
      } else if (walletInstance.walletId === walletIds.paper) {
        const paperWallet = walletInstance as PaperWallet;
        if (!email) {
          throw new Error("Email is required for Paper Wallet");
        }
        await paperWallet.connect({ chainId: chainIdNumber, email: email });
      } else if (walletInstance.walletId === walletIds.smartWallet) {
        const smartWallet = walletInstance as SmartWallet;
        const eoaWallet = this.walletMap.get(personalWallet);
        // Connect flow for EOA first
        await this.connect(
          eoaWallet?.walletId,
          chainId,
          password,
          email,
          personalWallet,
        );
        if (this.activeWallet) {
          // Pass EOA and reconnect to initialize smart wallet
          await this.initializeSmartWallet(smartWallet, this.activeWallet);
        } else {
          // If EOA wallet is not connected, throw error
          throw new Error(
            "Unable to connect EOA wallet to initialize smart wallet!",
          );
        }
      } else {
        await walletInstance.connect({ chainId: chainIdNumber });
      }

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

  public async switchNetwork(chainId: string) {
    if (chainId && this.activeWallet && "switchChain" in this.activeWallet) {
      await this.activeWallet.switchChain(Number(chainId));
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
      let prop = undefined;
      if (firstArg.length > 1) {
        prop = firstArg[1];
      }
      if (prop === "login" && routeArgs.length === 1) {
        const result = await this.auth.login({ domain: parsedArgs[0] });
        return JSON.stringify({ result: result });
      } else if (prop === "verify" && routeArgs.length === 1) {
        const result = await this.auth.verify(parsedArgs[0]);
        return JSON.stringify({ result: result });
      }
    }

    // contract tx
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

      // tx
      if (routeArgs.length === 3 && routeArgs[1] === "tx") {
        const txInput = parsedArgs[0];
        const fnName = parsedArgs[1];
        const args = parsedArgs[2];

        const tx = contract.prepare(fnName, args, {
          value: txInput?.value,
          gasLimit: txInput?.gas,
          gasPrice: txInput?.gasPrice,
          maxFeePerGas: txInput?.maxFeePerGas,
          maxPriorityFeePerGas: txInput?.maxPriorityFeePerGas,
          nonce: txInput?.nonce,
          type: txInput?.type?.toNumber(),
          accessList: txInput?.accessList,
          // customData: txInput.data,
          // ccipReadEnabled: txInput.ccipReadEnabled,
        });

        if (routeArgs[2].includes("send")) {
          tx.setGaslessOptions(
            routeArgs[2] === "sendGasless"
              ? this.activeSDK.options.gasless
              : undefined,
          );
          const result = await tx.send();
          return JSON.stringify({ result: result.hash }, bigNumberReplacer);
        } else if (routeArgs[2].includes("execute")) {
          tx.setGaslessOptions(
            routeArgs[2] === "executeGasless"
              ? this.activeSDK.options.gasless
              : undefined,
          );
          const result = await tx.execute();
          return JSON.stringify({ result: result }, bigNumberReplacer);
        } else if (routeArgs[2].includes("estimateGasLimit")) {
          const result = await tx.estimateGasLimit();
          return JSON.stringify({ result: result }, bigNumberReplacer);
        } else if (routeArgs[2].includes("estimateGasCosts")) {
          const result = await tx.estimateGasCost();
          return JSON.stringify({ result: result }, bigNumberReplacer);
        } else if (routeArgs[2].includes("simulate")) {
          const result = await tx.simulate();
          return JSON.stringify({ result: result }, bigNumberReplacer);
        } else if (routeArgs[2].includes("getGasPrice")) {
          const result = await tx.getGasPrice();
          return JSON.stringify({ result: result }, bigNumberReplacer);
        }
      }

      // call
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

  public async exportWallet(password: string): Promise<string> {
    const localWallet = this.walletMap.get(
      walletIds.localWallet,
    ) as LocalWallet;
    return await localWallet.export({
      strategy: "encryptedJson",
      password: password,
    });
  }

  public async initializeSmartWallet(
    sw: SmartWallet,
    personalWallet: AbstractClientWallet,
  ) {
    const personalWalletAddress = await personalWallet.getAddress();
    console.debug("Personal wallet address:", personalWalletAddress);
    await sw.connect({
      personalWallet,
    });
    if (sw.listenerCount("disconnect") === 1) {
      sw.on("disconnect", () => {
        personalWallet.disconnect();
      });
    }
  }

  public async initializeLocalWallet(password: string): Promise<LocalWallet> {
    const localWallet = this.walletMap.get(
      walletIds.localWallet,
    ) as LocalWallet;
    await localWallet.loadOrCreate({
      strategy: "encryptedJson",
      password,
    });
    return localWallet;
  }

  public openGoogleSignInWindow() {
    const win = window.open("", undefined, "width=350, height=500");
    if (win) {
      win.document.title = "Sign In - Google Accounts";
      win.document.body.innerHTML = `
      <svg class="loader" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#000"
          stroke-width="4"
        />
      </svg>
      
      <style>
        body,
        html {
          height: 100%;
          margin: 0;
          padding: 0;
        }
      
        body {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      
        .loader {
          width: 15vw;
          height: 15vw;
          animation: spin 2s linear infinite;
        }
      
        .loader circle {
          animation: loading 1.5s linear infinite;
        }
      
        @keyframes loading {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }
      
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
      </style>
      `;
    }
    return win;
  }
}

// add the bridge to the window object type
w.bridge = new ThirdwebBridge();

/// --- End Thirdweb Brige ---
