import {
  AuthOptions,
  AuthParams,
  AuthResult,
  EmbeddedWalletConnectionArgs,
  EmbeddedWalletConnectorOptions,
  OauthOption,
  SendEmailOtpReturnType,
} from "./types";
import type { Chain } from "@thirdweb-dev/chains";
import { providers, Signer } from "ethers";
import { utils } from "ethers";
import {
  customJwt,
  sendEmailOTP,
  socialLogin,
  validateEmailOTP,
} from "./embedded/auth";
import { getEthersSigner } from "./embedded/signer";
import { logoutUser } from "./embedded/helpers/auth/logout";
import {
  clearConnectedEmail,
  getConnectedEmail,
  saveConnectedEmail,
} from "./embedded/helpers/storage/local";
import {
  AuthProvider,
  Connector,
  RecoveryShareManagement,
  UserWalletStatus,
  normalizeChainId,
} from "@thirdweb-dev/wallets";

export class EmbeddedWalletConnector extends Connector<EmbeddedWalletConnectionArgs> {
  private options: EmbeddedWalletConnectorOptions;

  signer?: Signer;

  email?: string;

  constructor(options: EmbeddedWalletConnectorOptions) {
    super();
    this.options = options;

    this.email = getConnectedEmail();
  }

  async connect(options?: EmbeddedWalletConnectionArgs) {
    const connected = await this.isConnected();

    if (connected) {
      if (options?.chainId) {
        this.switchChain(options.chainId);
      }

      return this.getAddress();
    }

    // switch (options?.loginType) {
    //   case "headless_google_oauth":
    //     {
    //       await socialLogin(
    //         {
    //           provider: AuthProvider.GOOGLE,
    //           redirectUrl: options.redirectUrl,
    //         },
    //         this.options.clientId,
    //       );
    //     }
    //     break;
    //   case "headless_email_otp_verification": {
    //     await this.validateEmailOTP({ otp: options.otp });
    //     break;
    //   }
    //   case "jwt": {
    //     await this.customJwt({
    //       jwt: options.jwt,
    //       password: options.password,
    //     });
    //     break;
    //   }
    //   default:
    //     throw new Error("Invalid login type");
    // }

    if (options?.chainId) {
      this.switchChain(options.chainId);
    }

    this.setupListeners();
    return this.getAddress();
  }

  async authenticate(params: AuthParams): Promise<AuthResult> {
    const strategy = params.strategy;
    switch (strategy) {
      case "email_otp": {
        return await this.validateEmailOTP({
          otp: params.otp,
          recoveryCode: params.recoveryCode,
        });
      }
      case "google": {
        return this.socialLogin({
          provider: AuthProvider.GOOGLE,
          redirectUrl: params.redirectUrl,
        });
      }
      case "jwt": {
        return this.customJwt({
          jwt: params.jwt,
          password: params.encryptionKey || "",
        });
      }
      default:
        assertUnreachable(strategy);
    }
  }

  async validateEmailOTP(options: {
    otp: string;
    recoveryCode?: string;
  }): Promise<AuthResult> {
    if (!this.email) {
      throw new Error("Email is required to connect");
    }

    try {
      const { storedToken } = await validateEmailOTP({
        email: this.email,
        clientId: this.options.clientId,
        otp: options.otp,
        recoveryCode: options.recoveryCode,
      });
      console.log("return storedToken in connector", storedToken);
      return {
        user: {
          status: UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED,
          recoveryShareManagement:
            storedToken.authDetails.recoveryShareManagement,
        },
        isNewUser: storedToken.isNewUser,
        needsRecoveryCode:
          storedToken.authDetails.recoveryShareManagement ===
          RecoveryShareManagement.USER_MANAGED,
      };
    } catch (error) {
      console.error(`Error while validating otp: ${error}`);
      if (error instanceof Error) {
        throw new Error(`Error while validating otp: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred while validating otp");
      }
    }
  }

  async sendEmailOtp(options: {
    email: string;
  }): Promise<SendEmailOtpReturnType> {
    this.email = options.email;
    saveConnectedEmail(options.email);
    return sendEmailOTP({
      email: options.email,
      clientId: this.options.clientId,
    });
  }

  async socialLogin(oauthOption: OauthOption): Promise<AuthResult> {
    try {
      const { storedToken, email } = await socialLogin(
        oauthOption,
        this.options.clientId,
      );
      this.email = email;
      saveConnectedEmail(email);

      return {
        user: {
          status: UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED,
          recoveryShareManagement:
            storedToken.authDetails.recoveryShareManagement,
        },
        isNewUser: storedToken.isNewUser,
        needsRecoveryCode:
          storedToken.authDetails.recoveryShareManagement ===
          RecoveryShareManagement.USER_MANAGED,
      };
    } catch (error) {
      console.error(
        `Error while signing in with: ${oauthOption.provider}. ${error}`,
      );
      if (error instanceof Error) {
        throw new Error(
          `Error logging in with ${oauthOption.provider}: ${error.message}`,
        );
      } else {
        throw new Error(
          `An unknown error occurred logging in with ${oauthOption.provider}`,
        );
      }
    }
  }

  async customJwt(authOptions: AuthOptions): Promise<AuthResult> {
    try {
      const { verifiedToken, email } = await customJwt(
        authOptions,
        this.options.clientId,
      );
      this.email = email;
      return {
        user: {
          status: UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED,
          recoveryShareManagement:
            verifiedToken.authDetails.recoveryShareManagement,
        },
        isNewUser: verifiedToken.isNewUser,
        needsRecoveryCode:
          verifiedToken.authDetails.recoveryShareManagement ===
          RecoveryShareManagement.USER_MANAGED,
      };
    } catch (error) {
      console.error(`Error while verifying auth: ${error}`);
      this.disconnect();
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    clearConnectedEmail();
    await logoutUser(this.options.clientId);
    await this.onDisconnect();
    this.signer = undefined;
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
    if (this.signer) {
      return this.signer;
    }

    const signer = await getEthersSigner(this.options.clientId);

    if (!signer) {
      throw new Error("Error fetching the signer");
    }

    this.signer = signer;

    if (this.options.chain.chainId) {
      this.signer = this.signer.connect(
        new providers.JsonRpcProvider(this.options.chain.rpc[0]),
      );
    }

    return signer;
  }

  async isAuthorized(): Promise<boolean> {
    return this.isConnected();
  }

  async switchChain(chainId: number): Promise<void> {
    const chain = this.options.chains.find((c) => c.chainId === chainId);
    if (!chain) {
      throw new Error("Chain not configured");
    }

    // update signer
    this.signer = await getEthersSigner(this.options.clientId);
    this.signer = this.signer.connect(
      new providers.JsonRpcProvider(chain.rpc[0]),
    );

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

  async removeListeners() {
    if (!this.signer) {
      return;
    }

    const provider = await this.getProvider();
    if (provider.off) {
      provider.off("accountsChanged", this.onAccountsChanged);
      provider.off("chainChanged", this.onChainChanged);
      provider.off("disconnect", this.onDisconnect);
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
    this.removeListeners();
    this.emit("disconnect");
  };

  getEmail() {
    return this.email;
  }
}

export function extractSubFromJwt(jwtToken: string): string | undefined {
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
}

function assertUnreachable(x: never): never {
  throw new Error("Invalid param: " + x);
}
