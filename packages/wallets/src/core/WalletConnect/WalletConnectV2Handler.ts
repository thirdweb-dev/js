import { Core } from "@walletconnect/core";
import {
  IWeb3Wallet,
  Web3Wallet,
  Web3WalletTypes,
} from "@walletconnect/web3wallet";
import { ICore, SessionTypes, SignClientTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
import { utils } from "ethers";
import {
  WCSession,
  WalletConnectHandler,
  WalletConnectReceiverConfig,
  WCMetadata,
} from "../types/walletConnect";
import {
  EIP155_SIGNING_METHODS,
  TW_WC_PROJECT_ID,
  WC_RELAY_URL,
} from "../../evm/constants/wc";
import { AbstractWallet } from "../../evm/wallets/abstract";

type WalletConnectV2WalletConfig = Omit<
  WalletConnectReceiverConfig,
  "enableConnectApp"
>;

export class WalletConnectV2Handler extends WalletConnectHandler {
  #core: ICore;
  #wcWallet: IWeb3Wallet | undefined;
  #session: SessionTypes.Struct | undefined;
  #wcMetadata: WCMetadata;
  #activeProposal: Web3WalletTypes.SessionProposal | undefined;
  #activeRequestEvent: Web3WalletTypes.SessionRequest | undefined;

  constructor(options: WalletConnectV2WalletConfig) {
    super();

    this.#wcMetadata = options?.walletConnectV2Metadata || {
      name: "Thirdweb Smart Wallet",
      description: "Thirdweb Smart Wallet",
      url: "https://thirdweb.com",
      icons: ["https://thirdweb.com/favicon.ico"],
    };

    this.#core = new Core({
      projectId: options?.walletConenctV2ProjectId || TW_WC_PROJECT_ID,
      relayUrl: options?.walletConnectV2RelayUrl || WC_RELAY_URL,
    });
  }

  async init() {
    this.#wcWallet = await Web3Wallet.init({
      core: this.#core,
      metadata: this.#wcMetadata,
    });

    const sessions = this.#wcWallet.getActiveSessions();
    const keys = Object.keys(sessions);
    if (keys.length > 0) {
      this.#session = sessions[keys[0]];
    }

    this.#setupWalletConnectEventsListeners();
  }

  async connectApp(wcUri: string) {
    if (!this.#wcWallet) {
      throw new Error("Please, init the wallet before connecting an app.");
    }
    await this.#wcWallet.core.pairing.pair({ uri: wcUri });
  }

  async approveSession(wallet: AbstractWallet) {
    if (!this.#wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }

    if (!this.#activeProposal) {
      throw new Error("Please, pass a valid proposal.");
    }

    const account = await wallet.getAddress();

    const { id, params } = this.#activeProposal;
    const { requiredNamespaces, relays } = params;

    const namespaces: SessionTypes.Namespaces = {};
    Object.keys(requiredNamespaces).forEach((key) => {
      const accounts: string[] = [];
      requiredNamespaces[key].chains?.map((chain: string) => {
        accounts.push(`${chain}:${account}`);
      });
      namespaces[key] = {
        accounts,
        methods: requiredNamespaces[key].methods,
        events: requiredNamespaces[key].events,
      };
    });

    this.#session = await this.#wcWallet.approveSession({
      id,
      relayProtocol: relays[0].protocol,
      namespaces,
    });
  }

  async rejectSession() {
    if (!this.#wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }

    if (!this.#activeProposal) {
      throw new Error("Please, pass a valid proposal.");
    }

    const { id } = this.#activeProposal;
    await this.#wcWallet.rejectSession({
      id,
      reason: getSdkError("USER_REJECTED_METHODS"),
    });
  }

  async approveEIP155Request(wallet: AbstractWallet) {
    if (!this.#activeRequestEvent) {
      return;
    }
    const { topic, params, id } = this.#activeRequestEvent;
    const { request } = params;

    console.log("receiver.method", request.method);

    switch (request.method) {
      case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
      case EIP155_SIGNING_METHODS.ETH_SIGN:
        const message = this.#getSignParamsMessage(request.params);
        const signedMessage = await wallet.signMessage(message);

        console.log("message", message);
        console.log("signedMessage", signedMessage);

        const response = {
          id,
          jsonrpc: "2.0",
          result: signedMessage,
        };
        return this.#wcWallet?.respondSessionRequest({ topic, response });
      default:
        const error = {
          id,
          jsonrpc: "2.0",
          error: getSdkError("INVALID_EVENT"),
        };
        return this.#wcWallet?.respondSessionRequest({
          topic,
          response: error,
        });
    }
  }

  async rejectEIP155Request() {
    if (!this.#activeRequestEvent) {
      return;
    }
    const { topic, id } = this.#activeRequestEvent;
    const error = getSdkError("USER_REJECTED_METHODS");

    const response = {
      id,
      jsonrpc: "2.0",
      error: error,
    };

    return this.#wcWallet?.respondSessionRequest({ topic, response });
  }

  getActiveSessions(): WCSession[] {
    if (!this.#wcWallet) {
      throw new Error("Please, init the wallet before getting sessions.");
    }

    const sessions = this.#wcWallet.getActiveSessions();

    const sessionKeys = Object.keys(sessions);
    if (!sessions || sessionKeys.length === 0) {
      return [];
    }

    console.log("sessions", sessions);

    const thisSessions = [];
    for (const sessionKey of sessionKeys) {
      const topic = sessions[sessionKey].topic;
      const peerMeta = sessions[sessionKey].peer.metadata;

      thisSessions.push({
        topic,
        peer: {
          metadata: peerMeta,
        },
      });
    }

    return thisSessions;
  }

  disconnectSession(): Promise<void> {
    if (!this.#wcWallet) {
      throw new Error("Please, init the wallet before disconnecting sessions.");
    }

    if (!this.#session) {
      return Promise.resolve();
    }

    const params = {
      topic: this.#session.topic,
      reason: getSdkError("USER_DISCONNECTED"),
    };

    return this.#wcWallet?.disconnectSession(params);
  }

  #setupWalletConnectEventsListeners() {
    if (!this.#wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }

    this.#wcWallet.on(
      "session_proposal",
      (proposal: Web3WalletTypes.SessionProposal) => {
        this.#activeProposal = proposal;

        this.emit("session_proposal", {
          proposer: {
            metadata: proposal.params.proposer.metadata,
          },
        });
      },
    );

    this.#wcWallet.on(
      "session_delete",
      (session: SignClientTypes.EventArguments["session_delete"]) => {
        this.#session = undefined;
        this.#activeProposal = undefined;

        this.emit("session_delete", { topic: session.topic });
      },
    );

    this.#wcWallet.on(
      "session_request",
      async (requestEvent: Web3WalletTypes.SessionRequest) => {
        if (!this.#session) {
          console.log("No session found on session_request event.");
          return;
        }
        const { params } = requestEvent;
        const { request } = params;

        switch (request.method) {
          case EIP155_SIGNING_METHODS.ETH_SIGN:
          case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
            this.#activeRequestEvent = requestEvent;

            this.emit("session_request", {
              topic: this.#session.topic,
              peer: {
                metadata: this.#session.peer.metadata,
              },
              method: request.method,
            });
            return;
        }
      },
    );
  }

  /**
   * Gets message from various signing request methods by filtering out
   * a value that is not an address (thus is a message).
   * If it is a hex string, it gets converted to utf8 string
   */
  #getSignParamsMessage(params: string[]) {
    const message = params.filter((p) => !utils.isAddress(p))[0];

    if (utils.isHexString(message)) {
      return utils.toUtf8String(message);
    }

    return message;
  }
}
