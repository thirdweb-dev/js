import {
  WalletOptions,
  AbstractClientWallet,
  EmbeddedWalletAdditionalOptions,
  walletIds,
  IWalletConnectReceiver,
  WalletConnectHandler,
  WalletConnectReceiverConfig,
  NoOpWalletConnectHandler,
  WalletConnectV2Handler,
  WCSession,
  WCProposal,
  WCRequest,
} from "@thirdweb-dev/wallets";
import type { EmbeddedWalletConnector } from "../../connectors/embedded-wallet/embedded-connector";
import {
  AuthParams,
  EmbeddedWalletConnectionArgs,
} from "../../connectors/embedded-wallet/types";
import { EMAIL_WALLET_ICON } from "../../../assets/svgs";

export type EmbeddedWalletOptions = WalletOptions<
  EmbeddedWalletAdditionalOptions & WalletConnectReceiverConfig
>;

export class EmbeddedWallet
  extends AbstractClientWallet<
    EmbeddedWalletOptions,
    EmbeddedWalletConnectionArgs
  >
  implements IWalletConnectReceiver
{
  connector?: EmbeddedWalletConnector;
  options: EmbeddedWalletOptions;

  public enableConnectApp: boolean = false;
  protected wcWallet: WalletConnectHandler;

  static async sendVerificationEmail(options: {
    email: string;
    clientId: string;
  }) {
    const { sendVerificationEmail } = await import(
      "../../connectors/embedded-wallet/embedded/auth"
    );
    return sendVerificationEmail(options);
  }

  static meta = {
    name: "Embedded Wallet",
    iconURL: EMAIL_WALLET_ICON,
  };

  static id = walletIds.embeddedWallet;

  constructor(options: EmbeddedWalletOptions) {
    super(EmbeddedWallet.id, options);

    this.options = options;

    this.initializeConnector();

    this.setupListeners();

    console.log("EmbeddedWallet", options);
    this.enableConnectApp = options?.enableConnectApp || false;

    console.log("EmbeddedWallet.enableConnectApp", this.enableConnectApp);
    this.wcWallet = this.enableConnectApp
      ? new WalletConnectV2Handler({
          walletConnectWalletMetadata: options?.walletConnectWalletMetadata,
          walletConnectV2ProjectId: options?.walletConnectV2ProjectId,
          walletConnectV2RelayUrl: options?.walletConnectV2RelayUrl,
        })
      : new NoOpWalletConnectHandler();
  }

  async getConnector(): Promise<EmbeddedWalletConnector> {
    if (!this.connector) {
      return await this.initializeConnector();
    }
    return this.connector;
  }

  async initializeConnector() {
    const { EmbeddedWalletConnector } = await import(
      "../../connectors/embedded-wallet/embedded-connector"
    );
    this.connector = new EmbeddedWalletConnector({
      ...this.options,
      clientId: this.options.clientId,
      chains: this.chains,
    });

    return this.connector;
  }

  async sendVerificationEmail(email: string) {
    return this.connector?.sendVerificationEmail({ email });
  }

  async authenticate(params: AuthParams) {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.authenticate(params);
  }

  onConnected = () => {
    this.emit("message", { type: "connected" });
  };

  onDisconnect = () => {
    this.removeListeners();
  };

  onChange = async (payload: any) => {
    if (payload.chain) {
      // chain changed
    } else if (payload.account) {
      //account change
    }
  };

  getEmail() {
    return this.connector?.getEmail();
  }

  onEmailSent = ({ email }: { email: string }) => {
    this.emit("message", { type: "emailSent", data: email });
  };

  setupListeners() {
    if (!this.connector) {
      return;
    }

    this.removeListeners();
    this.connector.on("emailSent", this.onEmailSent);
    this.connector.on("connected", this.onConnected);
    this.connector.on("disconnect", this.onDisconnect);
    this.connector.on("change", this.onChange);
  }

  removeListeners() {
    if (!this.connector) {
      return;
    }
    this.connector.removeListener("emailSent", this.onEmailSent);
    this.connector.removeListener("connected", this.onConnected);
    this.connector.removeListener("disconnect", this.onDisconnect);
    this.connector.removeListener("change", this.onChange);
  }

  // wcv2
  async connectApp(uri: string) {
    if (!this.enableConnectApp) {
      throw new Error("enableConnectApp is set to false in this wallet config");
    }

    this.wcWallet?.connectApp(uri);
  }

  async approveSession(): Promise<void> {
    await this.wcWallet.approveSession(this);

    this.emit("message", { type: "session_approved" });
  }

  rejectSession() {
    return this.wcWallet.rejectSession();
  }

  approveRequest() {
    return this.wcWallet.approveEIP155Request(this);
  }

  rejectRequest() {
    return this.wcWallet.rejectEIP155Request();
  }

  getActiveSessions(): WCSession[] {
    if (!this.wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }

    return this.wcWallet.getActiveSessions();
  }

  disconnectSession(): Promise<void> {
    return this.wcWallet?.disconnectSession();
  }

  isWCReceiverEnabled() {
    return this.enableConnectApp;
  }

  setupWalletConnectEventsListeners() {
    if (!this.wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }

    this.wcWallet.on("session_proposal", (proposal: WCProposal) => {
      this.emit("message", {
        type: "session_proposal",
        data: proposal,
      });
    });

    this.wcWallet.on("session_delete", () => {
      this.emit("message", { type: "session_delete" });
    });

    this.wcWallet.on("switch_chain", (request: WCRequest) => {
      const chainId = request.params[0].chainId;

      this.emit("message", {
        type: "switch_chain",
        data: { chainId },
      });

      this.wcWallet.disconnectSession();
    });

    this.wcWallet.on("session_request", (request: WCRequest) => {
      this.emit("message", {
        type: "session_request",
        data: request,
      });
    });
  }
}
