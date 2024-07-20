/// --- Thirdweb Brige ---
import { ThirdwebAuth } from "@thirdweb-dev/auth";
import {
  Ethereum,
  defaultChains,
  getChainByChainId,
} from "@thirdweb-dev/chains";
import {
  CoinbasePayIntegration,
  type FundWalletOptions,
} from "@thirdweb-dev/pay";
import {
  type ChainIdOrName,
  ThirdwebSDK,
  getChainProvider,
} from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  type DAppMetaData,
  InAppWallet,
  type InAppWalletOauthStrategy,
  type SmartWalletConfig,
} from "@thirdweb-dev/wallets";
import type { AbstractClientWallet } from "@thirdweb-dev/wallets/evm/wallets/base";
import { CoinbaseWallet } from "@thirdweb-dev/wallets/evm/wallets/coinbase-wallet";
import { EthersWallet } from "@thirdweb-dev/wallets/evm/wallets/ethers";
import { InjectedWallet } from "@thirdweb-dev/wallets/evm/wallets/injected";
import { LocalWallet } from "@thirdweb-dev/wallets/evm/wallets/local-wallet";
import { MetaMaskWallet } from "@thirdweb-dev/wallets/evm/wallets/metamask";
import { RabbyWallet } from "@thirdweb-dev/wallets/evm/wallets/rabby";
import { SmartWallet } from "@thirdweb-dev/wallets/evm/wallets/smart-wallet";
import { WalletConnect } from "@thirdweb-dev/wallets/evm/wallets/wallet-connect";
import {
  type BotInfo,
  type BrowserInfo,
  type NodeInfo,
  type ReactNativeInfo,
  type SearchBotDeviceInfo,
  detect,
} from "detect-browser";
import { BigNumber, ethers } from "ethers";
import type { ContractInterface, Signer } from "ethers";

declare global {
  interface Window {
    bridge: TWBridge;
  }
}

const SEPARATOR = "/";
const SUB_SEPARATOR = "#";

// big number transform
// biome-ignore lint/suspicious/noExplicitAny: TODO: fix use of any
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

const SUPPORTED_WALLET_IDS = [
  "injected",
  "metamask",
  "rabby",
  "walletConnect",
  "coinbase",
  "localWallet",
  "smartWallet",
  "inAppWallet",
] as const;

type FundWalletInput = FundWalletOptions & {
  appId: string;
};

interface TWBridge {
  initialize: (chain: ChainIdOrName, options: string) => void;
  connect: (
    wallet: string,
    chainId: string,
    password?: string,
    email?: string,
    personalWallet?: string,
    authOptions?: string,
    smartWalletAccountOverride?: string,
  ) => Promise<string>;
  disconnect: () => Promise<void>;
  switchNetwork: (chainId: string) => Promise<void>;
  invoke: (route: string, payload: string) => Promise<string | undefined>;
  invokeListener: (
    taskId: string,
    route: string,
    payload: string,
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix use of any
    action: any,
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix use of any
    callback: (jsAction: any, jsTaskId: string, jsResult: string) => void,
  ) => void;
  fundWallet: (options: string) => Promise<void>;
  exportWallet: (password: string) => Promise<string>;
  smartWalletAddAdmin: (admin: string) => Promise<string | undefined>;
  smartWalletRemoveAdmin: (admin: string) => Promise<string | undefined>;
  smartWalletCreateSessionKey: (options: string) => Promise<string | undefined>;
  smartWalletRevokeSessionKey: (signer: string) => Promise<string | undefined>;
  smartWalletGetAllActiveSigners: () => Promise<string | undefined>;
  waitForTransactionResult: (txHash: string) => Promise<string>;
  getLatestBlockNumber: () => Promise<string>;
  getBlock: (blockNumber: string) => Promise<string>;
  getBlockWithTransactions: (blockNumber: string) => Promise<string>;
  getEmail: () => Promise<string>;
  getSignerAddress: () => Promise<string>;
  smartWalletIsDeployed: () => Promise<string>;
  resolveENSFromAddress: (address: string) => Promise<string>;
  resolveAddressFromENS: (ens: string) => Promise<string>;
  copyBuffer: (text: string) => Promise<void>;
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
    if (typeof globalThis !== "undefined") {
      let browser:
        | BrowserInfo
        | SearchBotDeviceInfo
        | BotInfo
        | NodeInfo
        | ReactNativeInfo
        | null;
      try {
        browser = detect();
      } catch {
        console.warn("Failed to detect browser");
        browser = null;
      }
      // biome-ignore lint/suspicious/noExplicitAny: TODO: fix use of any
      (globalThis as any).X_SDK_NAME = "UnitySDK_WebGL";
      // biome-ignore lint/suspicious/noExplicitAny: TODO: fix use of any
      (globalThis as any).X_SDK_PLATFORM = "unity";
      // biome-ignore lint/suspicious/noExplicitAny: TODO: fix use of any
      (globalThis as any).X_SDK_VERSION = "4.16.7";
      // biome-ignore lint/suspicious/noExplicitAny: TODO: fix use of any
      (globalThis as any).X_SDK_OS = browser?.os ?? "unknown";
    }

    this.initializedChain = chain;
    const sdkOptions = JSON.parse(options);
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix use of any
    let supportedChains: any[];
    if (sdkOptions?.supportedChains) {
      try {
        // biome-ignore lint/suspicious/noExplicitAny: TODO: fix use of any
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
      console.warn("no supportedChains passed, using default chains");
      supportedChains = defaultChains;
    }
    sdkOptions.supportedChains = supportedChains;

    const storage = sdkOptions?.storage?.ipfsGatewayUrl
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
    for (const walletId of SUPPORTED_WALLET_IDS) {
      let walletInstance: AbstractClientWallet;
      const dappMetadata: DAppMetaData = {
        name: sdkOptions.wallet?.appName || "thirdweb powered game",
        url: sdkOptions.wallet?.appUrl || "https://thirdweb.com",
        description: sdkOptions.wallet?.appDescription || "",
        logoUrl: sdkOptions.wallet?.appIcons?.[0] || "",
        ...sdkOptions.wallet?.extras,
      };
      switch (walletId) {
        case "injected":
          walletInstance = new InjectedWallet({
            dappMetadata,
            chains: supportedChains,
            clientId: sdkOptions.clientId,
          });
          break;
        case "metamask":
          walletInstance = new MetaMaskWallet({
            dappMetadata,
            chains: supportedChains,
            clientId: sdkOptions.clientId,
          });
          break;
        case "rabby":
          walletInstance = new RabbyWallet({
            projectId: sdkOptions.wallet?.walletConnectProjectId,
            dappMetadata,
            chains: supportedChains,
            clientId: sdkOptions.clientId,
          });
          break;
        case "walletConnect":
          walletInstance = new WalletConnect({
            projectId: sdkOptions.wallet?.walletConnectProjectId,
            dappMetadata,
            chains: supportedChains,
            clientId: sdkOptions.clientId,
            qrModalOptions: {
              enableExplorer:
                sdkOptions.wallet?.walletConnectEnableExplorer ?? false,
              explorerRecommendedWalletIds:
                sdkOptions.wallet?.walletConnectExplorerRecommendedWalletIds ??
                undefined,
              walletImages:
                sdkOptions.wallet?.walletConnectWalletImages ?? undefined,
              desktopWallets:
                sdkOptions.wallet?.walletConnectDesktopWallets ?? undefined,
              mobileWallets:
                sdkOptions.wallet?.walletConnectMobileWallets ?? undefined,
              themeMode: sdkOptions.wallet?.walletConnectThemeMode ?? undefined,
            },
          });
          break;
        case "coinbase":
          walletInstance = new CoinbaseWallet({
            dappMetadata,
            chains: supportedChains,
            clientId: sdkOptions.clientId,
          });
          break;
        case "localWallet":
          walletInstance = new LocalWallet({
            dappMetadata,
            chains: supportedChains,
            clientId: sdkOptions.clientId,
          });
          break;
        case "smartWallet": {
          const config: SmartWalletConfig = {
            chain: chain,
            factoryAddress: sdkOptions.smartWalletConfig?.factoryAddress,
            clientId: sdkOptions.clientId,
            gasless: sdkOptions.smartWalletConfig?.gasless,
            bundlerUrl: sdkOptions.smartWalletConfig?.bundlerUrl,
            paymasterUrl: sdkOptions.smartWalletConfig?.paymasterUrl,
            // paymasterAPI: sdkOptions.smartWalletConfig?.paymasterAPI,
            entryPointAddress: sdkOptions.smartWalletConfig?.entryPointAddress,
            erc20PaymasterAddress:
              sdkOptions.smartWalletConfig?.erc20PaymasterAddress,
            erc20TokenAddress: sdkOptions.smartWalletConfig?.erc20TokenAddress,
          };
          walletInstance = new SmartWallet(config);
          break;
        }
        case "inAppWallet":
          // if already initialized, skip
          if (this.walletMap.has(walletId)) {
            walletInstance = this.walletMap.get(walletId) as InAppWallet;
          } else {
            walletInstance = new InAppWallet({
              clientId: sdkOptions.clientId,
              chain: Ethereum,
              dappMetadata,
              chains: supportedChains,
            });
          }
          break;
        default:
          throw new Error(`Unknown wallet type: ${walletId}`);
      }
      if (walletInstance) {
        walletInstance.on("connect", async () =>
          this.updateSDKSigner(await walletInstance.getSigner()),
        );
        walletInstance.on("change", async () =>
          this.updateSDKSigner(await walletInstance.getSigner()),
        );
        walletInstance.on("disconnect", () => this.updateSDKSigner());

        this.walletMap.set(walletId, walletInstance);
      }
    }
  }

  public async connect(
    wallet: string,
    chainId: string,
    password?: string,
    email?: string,
    phoneNumber?: string,
    personalWallet?: string,
    authOptions?: string,
    smartWalletAccountOverride?: string,
  ) {
    if (!this.activeSDK) {
      throw new Error("SDK not initialized");
    }
    const walletInstance = this.walletMap.get(wallet);
    const chainIdNumber = Number(chainId);
    if (walletInstance) {
      // local wallet needs to be generated or loaded before connecting
      if (wallet === "localWallet") {
        await this.initializeLocalWallet(password as string);
        walletInstance.connect({ chainId: chainIdNumber });
      }

      if (wallet === "inAppWallet") {
        const embeddedWallet = walletInstance as InAppWallet;
        if (
          (await embeddedWallet.connector?.isConnected()) &&
          ((email && (await embeddedWallet.getEmail()) === email) ||
            (phoneNumber &&
              (await embeddedWallet.getPhoneNumber()) === phoneNumber))
        ) {
          console.log(
            "Already connected to InAppWallet, skipping auth. If you meant to re-authenticate, disconnect first.",
          );
        } else {
          const authOptionsParsed = JSON.parse(authOptions || "{}");
          if (authOptionsParsed.authProvider === 0) {
            // EmailOTP
            if (!email) {
              throw new Error("Email is required for EmailOTP auth provider");
            }
            const authResult = await embeddedWallet.authenticate({
              strategy: "iframe_email_verification",
              email,
            });
            await embeddedWallet.connect({
              chainId: chainIdNumber,
              authResult,
            });
          } else if (authOptionsParsed.authProvider < 4) {
            // OAuth
            let authProvider: InAppWalletOauthStrategy;
            switch (authOptionsParsed.authProvider) {
              // Google
              case 1:
                authProvider = "google";
                break;
              // Apple
              case 2:
                authProvider = "apple";
                break;
              // Facebook
              case 3:
                authProvider = "facebook";
                break;
              default:
                throw new Error(
                  `Invalid auth provider: ${authOptionsParsed.authProvider}`,
                );
            }
            const popupWindow = this.openPopupWindow();
            if (!popupWindow) {
              throw new Error("Failed to open login window");
            }
            const authResult = await embeddedWallet.authenticate({
              strategy: authProvider,
              openedWindow: popupWindow,
              closeOpenedWindow: (openedWindow) => {
                openedWindow.close();
              },
            });
            await embeddedWallet.connect({
              chainId: chainIdNumber,
              authResult,
            });
          } else if (authOptionsParsed.authProvider === 4) {
            // JWT
            const authResult = await embeddedWallet.authenticate({
              strategy: "jwt",
              jwt: authOptionsParsed.jwtOrPayload,
              encryptionKey: authOptionsParsed.encryptionKey,
            });
            await embeddedWallet.connect({
              chainId: chainIdNumber,
              authResult,
            });
          } else if (authOptionsParsed.authProvider === 5) {
            // AuthEndpoint
            const authResult = await embeddedWallet.authenticate({
              strategy: "auth_endpoint",
              payload: authOptionsParsed.jwtOrPayload,
              encryptionKey: authOptionsParsed.encryptionKey,
            });
            await embeddedWallet.connect({
              chainId: chainIdNumber,
              authResult,
            });
          } else if (authOptionsParsed.authProvider === 6) {
            // PhoneOTP
            throw new Error(
              "PhoneOTP auth provider not implemented yet for WebGL, stay tuned!",
            );
            // if (!phoneNumber) {
            //   throw new Error(
            //     "Phone number is required for PhoneOTP auth provider",
            //   );
            // }
            // const authResult = await embeddedWallet.authenticate({
            //   strategy: "iframe_phone_number_verification",
            //   phoneNumber,
            // });
            // await embeddedWallet.connect({
            //   chainId: chainIdNumber,
            //   authResult,
            // });
          } else {
            throw new Error(
              `Invalid auth provider: ${authOptionsParsed.authProvider}`,
            );
          }
        }
      } else if (wallet === "smartWallet") {
        if (!personalWallet) {
          throw new Error("Personal wallet is required for smart wallet");
        }
        const smartWallet = walletInstance as SmartWallet;
        // Connect flow for EOA first
        await this.connect(
          personalWallet,
          chainId,
          password,
          email,
          phoneNumber,
          undefined,
          authOptions,
          undefined,
        );
        await this.switchNetwork(chainId); // workaround for polygon/mumbai
        if (this.activeWallet) {
          // Pass EOA and reconnect to initialize smart wallet
          await this.initializeSmartWallet(
            smartWallet,
            this.activeWallet,
            smartWalletAccountOverride,
          );
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
    }
    throw new Error(`This wallet is not supported in WebGL: ${wallet}`);
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

    // console.log("thirdwebSDK call:", route, parsedArgs);

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
      }
      if (routeArgs.length === 2) {
        // @ts-expect-error need to type-guard this properly
        const result = await this.activeSDK[routeArgs[1]](...parsedArgs);
        return JSON.stringify({ result: result }, bigNumberReplacer);
      }
      throw new Error("Invalid Route");
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
      }
      if (prop === "verify" && routeArgs.length === 1) {
        const result = await this.auth.verify(parsedArgs[0]);
        return JSON.stringify({ result: result });
      }
    }

    // contract tx
    if (addrOrSDK.startsWith("0x")) {
      let typeOrAbi: string | ContractInterface | undefined;
      let isAbi = false;
      if (firstArg.length > 1) {
        try {
          typeOrAbi = JSON.parse(firstArg[1]); // try to parse ABI
          isAbi = true;
        } catch (e) {
          typeOrAbi = firstArg[1];
          isAbi = false;
        }
      }

      const contract = typeOrAbi
        ? isAbi
          ? await this.activeSDK.getContractFromAbi(addrOrSDK, typeOrAbi)
          : await this.activeSDK.getContract(addrOrSDK, typeOrAbi)
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
          type: txInput?.type
            ? BigNumber.from(txInput.type).toNumber()
            : undefined,
          accessList: txInput?.accessList,
          // customData: txInput.data,
          // ccipReadEnabled: txInput.ccipReadEnabled,
        });

        if (routeArgs[2].includes("sign")) {
          const result = await tx.sign();
          return JSON.stringify({ result: result }, bigNumberReplacer);
        }
        if (routeArgs[2].includes("send")) {
          tx.setGaslessOptions(
            routeArgs[2] === "sendGasless"
              ? this.activeSDK.options.gasless
              : undefined,
          );
          const result = await tx.send();
          return JSON.stringify({ result: result.hash }, bigNumberReplacer);
        }
        if (routeArgs[2].includes("execute")) {
          tx.setGaslessOptions(
            routeArgs[2] === "executeGasless"
              ? this.activeSDK.options.gasless
              : undefined,
          );
          const result = await tx.execute();
          return JSON.stringify({ result: result }, bigNumberReplacer);
        }
        if (routeArgs[2].includes("estimateGasLimit")) {
          const result = await tx.estimateGasLimit();
          return JSON.stringify({ result: result }, bigNumberReplacer);
        }
        if (routeArgs[2].includes("estimateGasCosts")) {
          const result = await tx.estimateGasCost();
          return JSON.stringify({ result: result }, bigNumberReplacer);
        }
        if (routeArgs[2].includes("simulate")) {
          const result = await tx.simulate();
          return JSON.stringify({ result: result }, bigNumberReplacer);
        }
        if (routeArgs[2].includes("getGasPrice")) {
          const result = await tx.getGasPrice();
          return JSON.stringify({ result: result }, bigNumberReplacer);
        }
      }

      // call
      if (routeArgs.length === 2) {
        // @ts-expect-error need to type-guard this properly
        const result = await contract[routeArgs[1]](...parsedArgs);
        return JSON.stringify({ result: result }, bigNumberReplacer);
      }
      if (routeArgs.length === 3) {
        // @ts-expect-error need to type-guard this properly
        const result = await contract[routeArgs[1]][routeArgs[2]](
          ...parsedArgs,
        );
        return JSON.stringify({ result: result }, bigNumberReplacer);
      }
      if (routeArgs.length === 4) {
        // @ts-expect-error need to type-guard this properly
        const result = await contract[routeArgs[1]][routeArgs[2]][routeArgs[3]](
          ...parsedArgs,
        );
        return JSON.stringify({ result: result }, bigNumberReplacer);
      }
      throw new Error("Invalid Route");
    }
  }

  public async invokeListener(
    taskId: string,
    route: string,
    payload: string,
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix use of any
    action: any,
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix use of any
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
        // biome-ignore lint/suspicious/noExplicitAny: TODO: fix use of any
        await contract[routeArgs[1]](...parsedFnArgs, (result: any) =>
          callback(action, taskId, JSON.stringify(result, bigNumberReplacer)),
        );
      } else if (routeArgs.length === 3) {
        // @ts-expect-error need to type-guard this properly
        await contract[routeArgs[1]][routeArgs[2]](
          ...parsedFnArgs,
          // biome-ignore lint/suspicious/noExplicitAny: TODO: fix use of any
          (result: any) =>
            callback(action, taskId, JSON.stringify(result, bigNumberReplacer)),
        );
      } else if (routeArgs.length === 4) {
        // @ts-expect-error need to type-guard this properly
        await contract[routeArgs[1]][routeArgs[2]][routeArgs[3]](
          ...parsedFnArgs,
          // biome-ignore lint/suspicious/noExplicitAny: TODO: fix use of any
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
    const localWallet = this.walletMap.get("localWallet") as LocalWallet;
    return await localWallet.export({
      strategy: "encryptedJson",
      password: password,
    });
  }

  public async initializeSmartWallet(
    sw: SmartWallet,
    personalWallet: AbstractClientWallet,
    accountAddress?: string,
  ) {
    await sw.connect({
      personalWallet,
      accountAddress: accountAddress,
    });
    if (sw.listenerCount("disconnect") === 1) {
      sw.on("disconnect", () => {
        personalWallet.disconnect();
      });
    }
  }

  public async initializeLocalWallet(password: string): Promise<LocalWallet> {
    const localWallet = this.walletMap.get("localWallet") as LocalWallet;
    try {
      await localWallet.loadOrCreate({
        strategy: "encryptedJson",
        password,
      });
    } catch (e) {
      console.warn(e);
      return localWallet;
    }

    return localWallet;
  }

  public async smartWalletAddAdmin(admin: string) {
    if (!this.activeWallet) {
      throw new Error("No wallet connected");
    }
    const smartWallet = this.activeWallet as SmartWallet;
    const result = await smartWallet.addAdmin(admin);
    return JSON.stringify({ result: result }, bigNumberReplacer);
  }

  public async smartWalletRemoveAdmin(admin: string) {
    if (!this.activeWallet) {
      throw new Error("No wallet connected");
    }
    const smartWallet = this.activeWallet as SmartWallet;
    const result = await smartWallet.removeAdmin(admin);
    return JSON.stringify({ result: result }, bigNumberReplacer);
  }

  public async smartWalletCreateSessionKey(options: string) {
    if (!this.activeWallet) {
      throw new Error("No wallet connected");
    }
    const smartWallet = this.activeWallet as SmartWallet;
    const optionsParsed = JSON.parse(options);
    const approvedCallTargets = optionsParsed.approvedCallTargets;
    const nativeTokenLimitPerTransaction = ethers.utils.formatEther(
      optionsParsed.nativeTokenLimitPerTransactionInWei,
    );
    const startDate = BigNumber.from(optionsParsed.startDate).toNumber();
    const expirationDate = BigNumber.from(
      optionsParsed.expirationDate,
    ).toNumber();
    const result = await smartWallet.createSessionKey(
      optionsParsed.signerAddress,
      {
        approvedCallTargets: approvedCallTargets,
        nativeTokenLimitPerTransaction: nativeTokenLimitPerTransaction,
        startDate: startDate,
        expirationDate: expirationDate,
      },
    );
    return JSON.stringify({ result: result }, bigNumberReplacer);
  }

  public async smartWalletRevokeSessionKey(signer: string) {
    if (!this.activeWallet) {
      throw new Error("No wallet connected");
    }
    const smartWallet = this.activeWallet as SmartWallet;
    const result = await smartWallet.revokeSessionKey(signer);
    return JSON.stringify({ result: result }, bigNumberReplacer);
  }

  public async smartWalletGetAllActiveSigners() {
    if (!this.activeWallet) {
      throw new Error("No wallet connected");
    }
    const smartWallet = this.activeWallet as SmartWallet;
    const res = await smartWallet.getAllActiveSigners();
    return JSON.stringify({ result: res }, bigNumberReplacer);
  }

  public async waitForTransactionResult(txHash: string) {
    if (!this.activeSDK) {
      throw new Error("SDK not initialized");
    }
    const res = await this.activeSDK.getProvider().waitForTransaction(txHash);
    return JSON.stringify({ result: res }, bigNumberReplacer);
  }

  public async getLatestBlockNumber() {
    if (!this.activeSDK) {
      throw new Error("SDK not initialized");
    }
    const res = await this.activeSDK.getProvider().getBlockNumber();
    return JSON.stringify({ result: res }, bigNumberReplacer);
  }

  public async getBlock(blockNumber: string) {
    if (!this.activeSDK) {
      throw new Error("SDK not initialized");
    }
    const res = await this.activeSDK
      .getProvider()
      .getBlock(Number(blockNumber));
    return JSON.stringify({ result: res }, bigNumberReplacer);
  }

  public async getBlockWithTransactions(blockNumber: string) {
    if (!this.activeSDK) {
      throw new Error("SDK not initialized");
    }
    const res = await this.activeSDK
      .getProvider()
      .getBlockWithTransactions(Number(blockNumber));
    return JSON.stringify({ result: res }, bigNumberReplacer);
  }

  public async getEmail() {
    if (!this.activeWallet) {
      throw new Error("No wallet connected");
    }
    const embeddedWallet = this.walletMap.get("inAppWallet") as InAppWallet;
    const email = await embeddedWallet.getEmail();
    return JSON.stringify({ result: email });
  }

  public async getSignerAddress() {
    if (!this.activeWallet) {
      throw new Error("No wallet connected");
    }
    try {
      const smartWallet = this.activeWallet as SmartWallet;
      const signer = await smartWallet.getPersonalWallet()?.getSigner();
      const res = await signer?.getAddress();
      return JSON.stringify({ result: res }, bigNumberReplacer);
    } catch {
      const signer = await this.activeWallet.getSigner();
      const res = await signer.getAddress();
      return JSON.stringify({ result: res }, bigNumberReplacer);
    }
  }

  public async smartWalletIsDeployed() {
    if (!this.activeWallet) {
      throw new Error("No wallet connected");
    }
    const smartWallet = this.activeWallet as SmartWallet;
    const res = await smartWallet.isDeployed();
    return JSON.stringify({ result: res }, bigNumberReplacer);
  }

  public async resolveENSFromAddress(address: string) {
    if (!this.activeSDK) {
      throw new Error("SDK not initialized");
    }

    const provider = getChainProvider(1, {
      clientId: this.activeSDK.options.clientId,
      supportedChains: [
        {
          chainId: 1,
          rpc: ["https://1.rpc.thirdweb.com"],
          nativeCurrency: Ethereum.nativeCurrency,
          slug: Ethereum.slug,
        },
      ],
    });

    const res = await provider.lookupAddress(address);
    return JSON.stringify({ result: res });
  }

  public async resolveAddressFromENS(ens: string) {
    if (!this.activeSDK) {
      throw new Error("SDK not initialized");
    }

    const provider = getChainProvider(1, {
      clientId: this.activeSDK.options.clientId,
      supportedChains: [
        {
          chainId: 1,
          rpc: ["https://1.rpc.thirdweb.com"],
          nativeCurrency: Ethereum.nativeCurrency,
          slug: Ethereum.slug,
        },
      ],
    });

    const res = await provider.resolveName(ens);
    return JSON.stringify({ result: res });
  }

  public async copyBuffer(text: string) {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Could not copy text: ", err);
    });
  }

  public openPopupWindow() {
    const win = window.open("", undefined, "width=350, height=500");
    if (win) {
      win.document.title = "Sign In - OAuth";
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
