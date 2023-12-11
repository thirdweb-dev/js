import {
  AuthEndpointOptions,
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
  authEndpoint,
  customJwt,
  sendVerificationEmail,
  socialLogin,
  validateEmailOTP,
} from "./embedded/auth";
import { getEthersSigner } from "./embedded/signer";
import { logoutUser } from "./embedded/helpers/auth/logout";
import {
  clearConnectedAuthStrategy,
  clearConnectedEmail,
  getConnectedAuthStrategy,
  getConnectedEmail,
  saveConnectedAuthStrategy,
  saveConnectedEmail,
} from "./embedded/helpers/storage/local";
import {
  AuthProvider,
  Connector,
  RecoveryShareManagement,
  UserWalletStatus,
  normalizeChainId,
} from "@thirdweb-dev/wallets";
import { isValidUserManagedEmailOtp } from "./embedded/helpers/api/fetchers";

export class EmbeddedWalletConnector extends Connector<EmbeddedWalletConnectionArgs> {
  private options: EmbeddedWalletConnectorOptions;

  signer?: Signer;

  email?: string;

  connectedAuthStrategy?: AuthParams["strategy"];

  constructor(options: EmbeddedWalletConnectorOptions) {
    super();
    this.options = options;

    this.email = getConnectedEmail();

    this.connectedAuthStrategy = getConnectedAuthStrategy();
  }

  async connect(options?: EmbeddedWalletConnectionArgs) {
    try {
      await this.getSigner();
    } catch (error) {
      throw new Error(`Error fetching the signer: ${error}`);
    }

    this.setupListeners();

    if (options?.chainId) {
      await this.switchChain(options.chainId);
    }

    return this.getAddress();
  }

  async authenticate(params: AuthParams): Promise<AuthResult> {
    const strategy = params.strategy;
    this.connectedAuthStrategy = strategy;
    switch (strategy) {
      case "email_verification": {
        return await this.validateEmailOTP({
          email: params.email,
          otp: params.verificationCode,
          recoveryCode: params.recoveryCode,
        });
      }
      case "google": {
        return this.socialLogin({
          provider: AuthProvider.GOOGLE,
          redirectUrl: params.redirectUrl,
        });
      }
      case "facebook": {
        return this.socialLogin({
          provider: AuthProvider.FACEBOOK,
          redirectUrl: params.redirectUrl,
        });
      }
      case "apple": {
        return this.socialLogin({
          provider: AuthProvider.APPLE,
          redirectUrl: params.redirectUrl,
        });
      }
      case "jwt": {
        return this.customJwt({
          jwt: params.jwt,
          password: params.encryptionKey,
        });
      }
      case "auth_endpoint": {
        return this.authEndpoint({
          payload: params.payload,
          encryptionKey: params.encryptionKey,
        });
      }
      default:
        assertUnreachable(strategy);
    }
  }

  private async validateEmailOTP(options: {
    email: string;
    otp: string;
    recoveryCode?: string;
  }): Promise<AuthResult> {
    try {
      const { storedToken } = await validateEmailOTP({
        email: options.email,
        clientId: this.options.clientId,
        otp: options.otp,
        recoveryCode: options.recoveryCode,
      });
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

  async isValidUserManagedEmailOTP(options: { otp: string }) {
    try {
      const result = await isValidUserManagedEmailOtp({
        clientId: this.options.clientId,
        email: this.email || "",
        otp: options.otp,
      });

      if (result.isValid) {
        return result;
      } else {
        throw new Error("Invalid otp, please try again.");
      }
    } catch (error) {
      throw new Error(`Error validating otp: ${error}`);
    }
  }

  async sendVerificationEmail(options: {
    email: string;
  }): Promise<SendEmailOtpReturnType> {
    this.email = options.email;
    return sendVerificationEmail({
      email: options.email,
      clientId: this.options.clientId,
    });
  }

  private async socialLogin(oauthOption: OauthOption): Promise<AuthResult> {
    try {
      const { storedToken, email } = await socialLogin(
        oauthOption,
        this.options.clientId,
      );
      this.email = email;

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
          `Error signing in with ${oauthOption.provider}: ${error.message}`,
        );
      } else {
        throw new Error(
          `An unknown error occurred signing in with ${oauthOption.provider}`,
        );
      }
    }
  }

  private async customJwt(authOptions: AuthOptions): Promise<AuthResult> {
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

  private async authEndpoint(
    authOptions: AuthEndpointOptions,
  ): Promise<AuthResult> {
    try {
      const { verifiedToken, email } = await authEndpoint(
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
    clearConnectedAuthStrategy();
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

    if (this.email) {
      saveConnectedEmail(this.email);
    }
    if (this.connectedAuthStrategy) {
      saveConnectedAuthStrategy(this.connectedAuthStrategy);
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

  getConnectedAuthStrategy() {
    return this.connectedAuthStrategy;
  }
}

function assertUnreachable(x: never): never {
  throw new Error("Invalid param: " + x);
}
