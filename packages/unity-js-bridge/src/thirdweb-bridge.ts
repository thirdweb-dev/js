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
              explorerRecommendedWalletIds: [
                "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // metamask
                "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // trustwallet
                "225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f", // safe
                "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369", // rainbow
                "c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a", // uniswap
                "ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18", // zerion
                "ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef", // imtoken
                "bc949c5d968ae81310268bf9193f9c9fb7bb4e1283e1284af8f2bd4992535fd6", // argent
                "74f8092562bd79675e276d8b2062a83601a4106d30202f2d509195e30e19673d", // spot
                "afbd95522f4041c71dd4f1a065f971fd32372865b416f95a0b1db759ae33f2a7", // omni
                "f2436c67184f158d1beda5df53298ee84abfc367581e4505134b5bcf5f46697d", // crypto.com
                "20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66", // tokenpocket
                "8837dd9413b1d9b585ee937d27a816590248386d9dbf59f5cd3422dbbb65683e", // robinhood wallet
                "85db431492aa2e8672e93f4ea7acf10c88b97b867b0d373107af63dc4880f041", // frontier
                "84b43e8ddfcd18e5fcb5d21e7277733f9cccef76f7d92c836d0e481db0c70c04", // blockchain.com
                "0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150", // safepal
                "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662", // bitkeep
                "9414d5a85c8f4eabc1b5b15ebe0cd399e1a2a9d35643ab0ad22a6e4a32f596f0", // zengo
                "c286eebc742a537cd1d6818363e9dc53b21759a1e8e5d9b263d0c03ec7703576", // 1inch
                "8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4", // binance defi wallet
                "e9ff15be73584489ca4a66f64d32c4537711797e30b6660dbcb71ea72a42b1f4", // exodus
                "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927", // ledger live
                "f5b4eeb6015d66be3f5940a895cbaa49ef3439e518cd771270e6b553b48f31d2", // mew wallet
                "138f51c8d00ac7b9ac9d8dc75344d096a7dfe370a568aa167eabc0a21830ed98", // alpha wallet
                "47bb07617af518642f3413a201ec5859faa63acb1dd175ca95085d35d38afb83", // keyring pro
                "76a3d548a08cf402f5c7d021f24fd2881d767084b387a5325df88bc3d4b6f21b", // lobstr wallet
                "dceb063851b1833cbb209e3717a0a0b06bf3fb500fe9db8cd3a553e4b1d02137", // onto
                "7674bb4e353bf52886768a3ddc2a4562ce2f4191c80831291218ebd90f5f5e26", // math wallet
                "8308656f4548bb81b3508afe355cfbb7f0cb6253d1cc7f998080601f838ecee3", // unstoppable domains
                "031f0187049b7f96c6f039d1c9c8138ff7a17fd75d38b34350c7182232cc29aa", // obvious
                "5864e2ced7c293ed18ac35e0db085c09ed567d67346ccb6f58a0327a75137489", // fireblocks
                "2c81da3add65899baeac53758a07e652eea46dbb5195b8074772c62a77bbf568", // ambire wallet
                "802a2041afdaf4c7e41a2903e98df333c8835897532699ad370f829390c6900f", // infinity wallet
                "7424d97904535b14fe34f09f63d8ca66935546f798758dabd5b26c2309f2b1f9", // bridge wallet
                "dd43441a6368ec9046540c46c5fdc58f79926d17ce61a176444568ca7c970dcd", // internet money wallet
                "c482dfe368d4f004479977fd88e80dc9e81107f3245d706811581a6dfe69c534", // now wallet
                "107bb20463699c4e614d3a2fb7b961e66f48774cb8f6d6c1aee789853280972c", // bitcoin.com wallet
                "053ac0ac602e0969736941cf5aa07a3af57396d4601cb521a173a626e1015fb1", // au wallet
                "2a3c89040ac3b723a1972a33a125b1db11e258a6975d3a61252cd64e6ea5ea01", // coin98 super app
                "b956da9052132e3dabdcd78feb596d5194c99b7345d8c4bd7a47cabdcb69a25f", // abc wallet
              ],
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
            paperClientId: sdkOptions.wallet?.paperClientId,
            chain: Ethereum,
            dappMetadata,
            chains: supportedChains,
            clientId: sdkOptions.clientId,
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
}

// add the bridge to the window object type
w.bridge = new ThirdwebBridge();

/// --- End Thirdweb Brige ---
