import { MagicConnector, MagicOptions } from "./magicConnector";
import { OAuthExtension, OAuthProvider } from "@magic-ext/oauth";
import {
  InstanceWithExtensions,
  MagicSDKAdditionalConfiguration,
  SDKBase,
} from "@magic-sdk/provider";
import {
  Chain,
  ChainNotConfiguredError,
  normalizeChainId,
  UserRejectedRequestError,
} from "@wagmi/core";
import { getAddress } from "ethers/lib/utils.js";
import { Magic } from "magic-sdk";

export interface MagicAuthOptions extends MagicOptions {
  enableEmailLogin?: boolean;
  enableSMSLogin?: boolean;
  oauthOptions?: {
    providers: OAuthProvider[];
    callbackUrl?: string;
  };
  magicSdkConfiguration?: MagicSDKAdditionalConfiguration<
    string,
    OAuthExtension[]
  >;
}

export class MagicAuthConnector extends MagicConnector {
  magicSDK?: InstanceWithExtensions<SDKBase, OAuthExtension[]>;

  magicSdkConfiguration: MagicSDKAdditionalConfiguration<
    string,
    OAuthExtension[]
  >;

  enableSMSLogin: boolean;

  enableEmailLogin: boolean;

  oauthProviders: OAuthProvider[];

  oauthCallbackUrl?: string;

  constructor(config: { chains?: Chain[]; options: MagicAuthOptions }) {
    super(config);
    this.magicSdkConfiguration = config.options.magicSdkConfiguration || {};
    this.oauthProviders = config.options.oauthOptions?.providers || [];
    this.oauthCallbackUrl = config.options.oauthOptions?.callbackUrl;
    this.enableSMSLogin = config.options.enableSMSLogin || false;
    this.enableEmailLogin = config.options.enableEmailLogin || false;
  }

  async connect({ chainId }: { chainId?: number }) {
    // for a specific chainId we will overwrite the magicSDKConfiguration
    if (chainId) {
      const chain = this.chains.find((c) => c.id === chainId);
      if (chain) {
        this.magicSdkConfiguration = {
          ...this.magicSdkConfiguration,
          network: {
            chainId: chain.id,
            rpcUrl: chain.rpcUrls.default.http[0],
          },
        };
      }
    }
    try {
      const provider = await this.getProvider();

      if (provider.on) {
        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect);
      }

      // Check if there is a user logged in
      const isAuthenticated = await this.isAuthorized();

      // Check if we have a chainId, in case of error just assign 0 for legacy
      let chainId_: number;
      try {
        chainId_ = await this.getChainId();
      } catch (e) {
        chainId_ = 0;
      }

      // if there is a user logged in, return the user
      if (isAuthenticated) {
        return {
          provider,
          chain: {
            id: chainId_,
            unsupported: false,
          },
          account: getAddress(await this.getAccount()),
        };
      }

      // open the modal and process the magic login steps
      if (!this.isModalOpen) {
        const output = await this.getUserDetailsByForm(
          this.enableSMSLogin,
          this.enableEmailLogin,
          this.oauthProviders,
        );
        const magic = this.getMagicSDK();

        // LOGIN WITH MAGIC LINK WITH OAUTH PROVIDER
        if (output.oauthProvider) {
          await magic.oauth.loginWithRedirect({
            provider: output.oauthProvider,
            redirectURI: this.oauthCallbackUrl || window.location.href,
          });
        }

        // LOGIN WITH MAGIC LINK WITH EMAIL
        if (output.email) {
          await magic.auth.loginWithMagicLink({
            email: output.email,
          });
        }

        // LOGIN WITH MAGIC LINK WITH PHONE NUMBER
        if (output.phoneNumber) {
          await magic.auth.loginWithSMS({
            phoneNumber: output.phoneNumber,
          });
        }

        const signer = await this.getSigner();
        const account = await signer.getAddress();

        return {
          account: getAddress(account),
          chain: {
            id: chainId_,
            unsupported: false,
          },
          provider,
        };
      }
      throw new UserRejectedRequestError("User rejected request");
    } catch (error) {
      throw new UserRejectedRequestError("Something went wrong");
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

  getMagicSDK(): InstanceWithExtensions<SDKBase, OAuthExtension[]> {
    if (!this.magicSDK) {
      this.magicSDK = new Magic(this.magicOptions.apiKey, {
        ...this.magicSdkConfiguration,
        extensions: [new OAuthExtension()],
      });
      return this.magicSDK;
    }
    return this.magicSDK;
  }

  async switchChain(chainId: number): Promise<Chain> {
    // check if the chain is supported
    const chain = this.chains.find((c) => c.id === chainId);
    if (!chain) {
      throw new ChainNotConfiguredError({ chainId, connectorId: this.id });
    }
    await this.connect({ chainId });
    return chain;
  }
}
