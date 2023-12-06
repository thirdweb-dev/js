import { normalizeChainId } from "../../../lib/wagmi-core/normalizeChainId";
import {
  MagicAuthOptions,
  MagicConnectorBaseOptions,
  MagicOptions,
} from "./types";
import type { Chain } from "@thirdweb-dev/chains";
import { ethers, Signer, utils } from "ethers";
import { OAuthExtension, OAuthProvider } from "@magic-ext/oauth";
import {
  InstanceWithExtensions,
  MagicSDKAdditionalConfiguration,
  MagicSDKExtensionsOption,
  SDKBase,
} from "@magic-sdk/provider";
import { Address } from "@thirdweb-dev/sdk";
import { Magic } from "magic-sdk";
import type { AbstractProvider } from "web3-core";
import { RPCProviderModule } from "@magic-sdk/provider/dist/types/modules/rpc-provider";
import { WagmiConnector } from "../../../lib/wagmi-connectors/WagmiConnector";

export type MagicAuthConnectOptions = {
  chainId?: number;
} & (
  | {
      email: string;
    }
  | {
      phoneNumber: string;
    }
  | {
      oauthProvider: OAuthProvider;
    }
  // eslint-disable-next-line @typescript-eslint/ban-types
  | {}
);

const IS_SERVER = typeof window === "undefined";

type MagicProvider = RPCProviderModule & AbstractProvider;

export abstract class MagicBaseConnector extends WagmiConnector<
  MagicProvider,
  MagicConnectorBaseOptions
> {
  readonly id: string = "magic-link";
  readonly name: string = "Magic Link";
  ready = !IS_SERVER;
  provider!: MagicProvider;
  magicOptions: MagicOptions;

  protected constructor(config: {
    chains?: Chain[];
    options: MagicConnectorBaseOptions;
  }) {
    super(config);
    this.magicOptions = config.options;
  }

  async getAccount(): Promise<Address> {
    const provider = new ethers.providers.Web3Provider(
      (await this.getProvider()) as any, // TODO: fix type mismatch
    );
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    if (account.startsWith("0x")) {
      return account as Address;
    }
    return `0x${account}`;
  }

  async getProvider() {
    if (this.provider) {
      return this.provider;
    }
    const magic = this.getMagicSDK();
    this.provider = magic.rpcProvider;
    return this.provider;
  }

  async getSigner(): Promise<Signer> {
    const provider = new ethers.providers.Web3Provider(
      (await this.getProvider()) as any, // TODO: fix type mismatch
    );
    const signer = await provider.getSigner();
    return signer;
  }

  async isAuthorized() {
    const magic = this.getMagicSDK();
    try {
      return await magic.user.isLoggedIn();
    } catch (e) {
      return false;
    }
  }

  protected onAccountsChanged(accounts: string[]): void {
    if (accounts.length === 0) {
      this.emit("disconnect");
    } else {
      if (accounts[0]) {
        this.emit("change", { account: utils.getAddress(accounts[0]) });
      }
    }
  }

  protected onChainChanged(chainId: string | number): void {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  }

  protected onDisconnect(): void {
    this.emit("disconnect");
  }

  async disconnect(): Promise<void> {
    const magic = this.getMagicSDK();
    await magic.user.logout();
  }

  abstract getMagicSDK(): InstanceWithExtensions<SDKBase, OAuthExtension[]>;
}

export class MagicAuthConnector extends MagicBaseConnector {
  magicSDK?: InstanceWithExtensions<SDKBase, OAuthExtension[]>;
  magicSdkConfiguration?: MagicSDKAdditionalConfiguration<
    string,
    MagicSDKExtensionsOption<OAuthExtension["name"]>
  >;
  #connectedChainId?: number;
  #type?: "connect" | "auth";

  oauthProviders: OAuthProvider[];
  oauthRedirectURI?: string;

  constructor(config: { chains?: Chain[]; options: MagicAuthOptions }) {
    super(config);
    this.magicSdkConfiguration = config.options.magicSdkConfiguration;
    this.#type = config.options.type;
    this.oauthProviders = config.options.oauthOptions?.providers || [];
    this.oauthRedirectURI = config.options.oauthOptions?.redirectURI;
  }

  async connect(options: MagicAuthConnectOptions) {
    if (!this.magicOptions.apiKey) {
      throw new Error("Magic API Key is not provided.");
    }
    try {
      if (options.chainId) {
        this.initializeMagicSDK({ chainId: options.chainId });
      }
      const provider = await this.getProvider();
      this.setupListeners();
      this.emit("message", { type: "connecting" });

      // Check if there is a user logged in
      const isAuthenticated = await this.isAuthorized();

      // Check if we have a chainId, in case of error just assign 0 for legacy
      let chainId: number;
      try {
        chainId = await this.getChainId();
      } catch (e) {
        chainId = 0;
      }

      this.#connectedChainId = chainId;

      // if there is a user logged in, return the user
      if (isAuthenticated) {
        return {
          provider,
          chain: {
            id: chainId,
            unsupported: false,
          },
          account: await this.getAccount(),
        };
      }

      const magic = this.getMagicSDK();

      if (this.#type === "connect") {
        if ("email" in options || "phoneNumber" in options) {
          console.warn(
            "Passing email or phoneNumber is not required for Magic Connect",
          );
        }
        await magic.wallet.connectWithUI();
      } else {
        // LOGIN WITH MAGIC LINK WITH OAUTH PROVIDER
        if ("oauthProvider" in options) {
          await magic.oauth.loginWithRedirect({
            provider: options.oauthProvider,
            redirectURI: this.oauthRedirectURI || window.location.href,
          });
          await new Promise((res) => {
            // never resolve - to keep the app in "connecting..." state until the redirect happens
            setTimeout(res, 10000); // timeout if takes if redirect doesn't happen for 10 seconds (will likely never happen)
          });
        }

        // LOGIN WITH MAGIC LINK WITH EMAIL
        else if ("email" in options) {
          await magic.auth.loginWithMagicLink({
            email: options.email,
            showUI: true,
          });
        }

        // LOGIN WITH MAGIC LINK WITH PHONE NUMBER
        else if ("phoneNumber" in options) {
          await magic.auth.loginWithSMS({
            phoneNumber: options.phoneNumber,
          });
        }

        // error
        else {
          throw new Error(
            "Invalid options: Either provide and email, phoneNumber or oauthProvider when using Magic Auth",
          );
        }
      }

      const signer = await this.getSigner();
      let account = (await signer.getAddress()) as Address;
      if (!account.startsWith("0x")) {
        account = `0x${account}`;
      }

      return {
        account,
        chain: {
          id: chainId,
          unsupported: false,
        },
        provider,
      };

      // throw new UserRejectedRequestError("User rejected request");
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong");
    }
  }

  async getChainId(): Promise<number> {
    const networkOptions = this.magicSdkConfiguration?.network;
    if (typeof networkOptions === "object") {
      const chainID = networkOptions.chainId;
      if (chainID) {
        return normalizeChainId(chainID);
      }
    }
    throw new Error("Chain ID is not defined");
  }

  initializeMagicSDK({ chainId }: { chainId?: number } = {}) {
    const options = {
      ...this.magicSdkConfiguration,
      extensions: [new OAuthExtension()],
    };
    if (chainId) {
      const chain = this.chains.find((c) => c.chainId === chainId);
      if (chain) {
        options.network = {
          rpcUrl: chain.rpc[0] || "", // TODO handle empty RPC array
          chainId: chain.chainId,
        };
      }
    }
    this.magicSDK = new Magic(this.magicOptions.apiKey, options);
    this.provider = this.magicSDK.rpcProvider;
    return this.magicSDK;
  }

  getMagicSDK(): InstanceWithExtensions<SDKBase, OAuthExtension[]> {
    if (!this.magicSDK) {
      return this.initializeMagicSDK();
    }
    return this.magicSDK;
  }

  async setupListeners() {
    const provider = await this.getProvider();
    provider.on("accountsChanged", this.onAccountsChanged);
    provider.on("chainChanged", this.onChainChanged);
    provider.on("disconnect", this.onDisconnect);
  }

  async switchChain(chainId: number): Promise<Chain> {
    const chain = this.chains.find((c) => c.chainId === chainId);

    if (!chain) {
      throw new Error("Chain not found");
    }

    if (this.#connectedChainId !== chainId) {
      this.initializeMagicSDK({ chainId });
    }

    return chain;
  }
}
