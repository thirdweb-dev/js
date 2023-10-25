import { Chain } from "@thirdweb-dev/chains";
import type { Signer, providers } from "ethers";
import { utils } from "ethers";
import { normalizeChainId } from "../../../lib/wagmi-core";
import { walletIds } from "../../constants/walletIds";
import { Connector } from "../../interfaces/connector";

import {
  AuthLoginReturnType,
  EmbeddedWalletSdk,
  InitializedUser,
  SendEmailOtpReturnType,
  UserWalletStatus,
} from "./implementations";
import {
  AuthData,
  AuthParams,
  EmbeddedWalletConnectionArgs,
  EmbeddedWalletConnectorOptions,
} from "./types";

export class EmbeddedWalletConnector extends Connector<EmbeddedWalletConnectionArgs> {
  readonly id: string = walletIds.paper;
  readonly name: string = "Embedded Wallet";
  ready = true;

  private user: InitializedUser | null = null;
  #embeddedWalletSdk?: EmbeddedWalletSdk;
  private options: EmbeddedWalletConnectorOptions;

  #signer?: Signer;

  constructor(options: EmbeddedWalletConnectorOptions) {
    super();
    this.options = options;
  }

  getEmbeddedWalletSDK(): EmbeddedWalletSdk {
    if (!this.#embeddedWalletSdk) {
      this.#embeddedWalletSdk = new EmbeddedWalletSdk({
        clientId: this.options.clientId,
        chain: "Ethereum",
        styles: this.options.styles,
      });
    }
    return this.#embeddedWalletSdk;
  }

  async sendEmailOtp({
    email,
  }: {
    email: string;
  }): Promise<SendEmailOtpReturnType> {
    const ewSDK = this.getEmbeddedWalletSDK();
    return ewSDK.auth.sendEmailLoginOtp({ email });
  }

  async connect(options?: EmbeddedWalletConnectionArgs): Promise<string> {
    const ewSDK = this.getEmbeddedWalletSDK();
    let authResult: AuthLoginReturnType;

    const strategy = options?.authData.strategy;
    switch (strategy) {
      case "email": {
        if (!options?.extraArgs?.otp) {
          throw new Error("No OTP provided");
        }
        authResult = await ewSDK.auth.verifyEmailLoginOtp({
          email: options.authData.email,
          otp: options.extraArgs.otp,
          recoveryCode: options.extraArgs?.password,
        });
        break;
      }
      case "google": {
        authResult = await ewSDK.auth.loginWithGoogle({
          closeOpenedWindow: options?.extraArgs?.closeOpenedWindow,
          openedWindow: options?.extraArgs?.openedWindow,
        });
        break;
      }
      case "jwt": {
        if (!options?.authData?.jwt) {
          throw new Error("No JWT provided");
        }
        const sub = extractSubFromJwt(options.authData.jwt);
        if (!sub) {
          throw new Error(
            "No sub found in JWT - make sure the format is correct",
          );
        }
        authResult = await ewSDK.auth.loginWithCustomJwt({
          jwt: options?.authData?.jwt,
          encryptionKey: sub,
        });
        break;
      }
      case "iframe_otp": {
        if (!options) {
          throw new Error("No options provided");
        }
        authResult = await ewSDK.auth.loginWithEmailOtp({
          email: options?.authData.email,
        });
        break;
      }
      case "iframe":
      case undefined: {
        authResult = await ewSDK.auth.loginWithModal();
        break;
      }
      default:
        assertUnreachable(strategy);
    }
    this.user = authResult.user;

    if (!this.user) {
      throw new Error("Error connecting User");
    }

    if (options?.chainId) {
      this.switchChain(options.chainId);
    }

    this.setupListeners();
    return this.getAddress();
  }

  async disconnect(): Promise<void> {
    const paper = this.#embeddedWalletSdk;
    await paper?.auth.logout();
    this.#signer = undefined;
    this.#embeddedWalletSdk = undefined;
    this.user = null;
  }

  async getAddress(): Promise<string> {
    const signer = await this.getSigner();
    return signer.getAddress();
  }

  async isConnected(): Promise<boolean> {
    try {
      const addr = await this.getAddress();
      return !!addr;
    } catch (e) {
      return false;
    }
  }

  async getProvider(): Promise<providers.Provider> {
    const signer = await this.getSigner();
    if (!signer.provider) {
      throw new Error("Provider not found");
    }
    return signer.provider;
  }

  public async getSigner(): Promise<Signer> {
    if (this.#signer) {
      return this.#signer;
    }

    const user = await this.getUser();
    const signer = await user?.wallet.getEthersJsSigner({
      rpcEndpoint: this.options.chain.rpc[0] || "", // TODO: handle chain.rpc being empty array
    });

    if (!signer) {
      throw new Error("Signer not found");
    }

    this.#signer = signer;

    return signer;
  }

  async isAuthorized(): Promise<boolean> {
    return false;
  }

  async switchChain(chainId: number): Promise<void> {
    const chain = this.options.chains.find((c) => c.chainId === chainId);
    if (!chain) {
      throw new Error("Chain not configured");
    }

    // update chain in wallet
    await this.user?.wallet.setChain({ chain: "Ethereum" }); // just pass Ethereum no matter what chain we are going to connect

    // update signer
    this.#signer = await this.user?.wallet.getEthersJsSigner({
      rpcEndpoint: chain.rpc[0] || "", // TODO: handle chain.rpc being empty array
    });

    this.emit("change", { chain: { id: chainId, unsupported: false } });
  }

  async setupListeners() {
    const provider = await this.getProvider();
    if (provider.on) {
      provider.on("accountsChanged", this.onAccountsChanged);
      provider.on("chainChanged", this.onChainChanged);
      provider.on("disconnect", this.onDisconnect);
    }
  }

  updateChains(chains: Chain[]) {
    this.options.chains = chains;
  }

  protected onAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      await this.onDisconnect();
    } else {
      this.emit("change", {
        account: utils.getAddress(accounts[0] as string),
      });
    }
  };

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId);
    const unsupported =
      this.options.chains.findIndex((c) => c.chainId === id) === -1;
    this.emit("change", { chain: { id, unsupported } });
  };

  protected onDisconnect = async () => {
    this.emit("disconnect");
  };

  async getUser(): Promise<InitializedUser | null> {
    if (!this.user) {
      const embeddedWalletSdk = this.getEmbeddedWalletSDK();
      const user = await embeddedWalletSdk.getUser();
      switch (user.status) {
        case UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED: {
          this.user = user;
          break;
        }
      }
    }
    return this.user;
  }

  async getEmail() {
    // implicit call to set the user
    await this.getSigner();
    if (!this.user) {
      throw new Error("No user found, Embedded Wallet is not connected");
    }
    return this.user.authDetails.email;
  }

  async getRecoveryInformation() {
    // implicit call to set the user
    await this.getSigner();
    if (!this.user) {
      throw new Error("No user found, Embedded Wallet is not connected");
    }
    return this.user.authDetails;
  }

  // TODO extract as standalone function
  async authenticate(params: AuthParams): Promise<AuthData> {
    switch (params.strategy) {
      case "email": {
        const result = await this.sendEmailOtp({ email: params.email });
        return {
          ...params,
          result,
        };
      }
      case "google":
      case "jwt":
      case "iframe":
      case "iframe_otp": {
        return params;
      }
      default:
        assertUnreachable(params);
    }
  }
}

function assertUnreachable(x: never): never {
  throw new Error("Invalid param: " + x);
}

function extractSubFromJwt(jwtToken: string): string | null {
  const parts = jwtToken.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT format.");
  }

  const encodedPayload = parts[1];
  if (!encodedPayload) {
    throw new Error("Invalid JWT format.");
  }
  const decodedPayload = Buffer.from(encodedPayload, "base64").toString("utf8");

  try {
    const payloadObject = JSON.parse(decodedPayload);
    if (payloadObject && payloadObject.sub) {
      return payloadObject.sub;
    }
  } catch (error) {
    throw new Error("Error parsing JWT payload as JSON.");
  }

  return null;
}
