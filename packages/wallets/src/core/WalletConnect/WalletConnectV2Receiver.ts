import { Core } from "@walletconnect/core";
import { IWeb3Wallet, Web3Wallet } from "@walletconnect/web3wallet";
import { ICore, SessionTypes, SignClientTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
import { utils } from "ethers";
import {
  WalletConnectMetadata,
  WalletConnectReceiverConfig,
} from "../types/walletConnect";
import {
  EIP155_SIGNING_METHODS,
  TW_WC_PROJECT_ID,
  WC_RELAY_URL,
} from "../../evm/constants/wc";
import { IWalletConnectReceiver } from "./IWalletConnectReceiver";
import { AbstractWallet } from "../../evm/wallets/abstract";

type WalletConnectV2ReceiverConfig = Omit<
  WalletConnectReceiverConfig,
  "enableConnectApp"
> & {
  onSessionProposal?: (
    proposal: SignClientTypes.EventArguments["session_proposal"],
  ) => Promise<void>;
  onSessionRequest?: (
    request: SignClientTypes.EventArguments["session_request"],
    session: SessionTypes.Struct,
  ) => Promise<void>;
};

export class WalletConnectV2Receiver implements IWalletConnectReceiver {
  // wcv2
  #core: ICore;
  #wcWallet: IWeb3Wallet | undefined;
  #session: SessionTypes.Struct | undefined;
  #wcMetadata: WalletConnectMetadata;
  #onSessionProposal?: (
    proposal: SignClientTypes.EventArguments["session_proposal"],
  ) => Promise<void>;
  #onSessionRequest?: (
    request: SignClientTypes.EventArguments["session_request"],
    session: SessionTypes.Struct,
  ) => Promise<void>;

  constructor(options: WalletConnectV2ReceiverConfig) {
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

    this.#onSessionProposal = options?.onSessionProposal;
    this.#onSessionRequest = options?.onSessionRequest;
  }

  async init() {
    this.#wcWallet = await Web3Wallet.init({
      core: this.#core,
      metadata: this.#wcMetadata,
    });

    this.#setupWalletConnectEventsListeners();
  }

  async connectApp(wcUri: string) {
    if (!this.#wcWallet) {
      throw new Error("Please, init the wallet before connecting an app.");
    }
    await this.#wcWallet.core.pairing.pair({ uri: wcUri });
  }

  async approveSession(
    wallet: AbstractWallet,
    proposal: SignClientTypes.EventArguments["session_proposal"],
  ) {
    if (!this.#wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }

    if (!proposal) {
      throw new Error("Please, pass a valid proposal.");
    }

    const account = await wallet.getAddress();

    const { id, params } = proposal;
    const { requiredNamespaces, relays } = params;

    const namespaces: SessionTypes.Namespaces = {};
    Object.keys(requiredNamespaces).forEach((key) => {
      const accounts: string[] = [];
      requiredNamespaces[key].chains?.map((chain) => {
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

  async rejectSession(
    proposal: SignClientTypes.EventArguments["session_proposal"],
  ) {
    if (!this.#wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }

    if (!proposal) {
      throw new Error("Please, pass a valid proposal.");
    }

    const { id } = proposal;
    await this.#wcWallet.rejectSession({
      id,
      reason: getSdkError("USER_REJECTED_METHODS"),
    });
  }

  async approveEIP155Request(
    wallet: AbstractWallet,
    requestEvent: SignClientTypes.EventArguments["session_request"],
  ) {
    const { params, id } = requestEvent;
    const { request } = params;

    switch (request.method) {
      case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
      case EIP155_SIGNING_METHODS.ETH_SIGN:
        const message = this.#getSignParamsMessage(request.params);
        const signedMessage = await wallet.signMessage(message);
        return {
          id,
          jsonrpc: "2.0",
          result: signedMessage,
        };
      default:
        return {
          id,
          jsonrpc: "2.0",
          error: getSdkError("INVALID_EVENT"),
        };
    }
  }

  async rejectEIP155Request(
    request: SignClientTypes.EventArguments["session_request"],
  ) {
    const { id } = request;
    const error = getSdkError("USER_REJECTED_METHODS");

    return {
      id,
      jsonrpc: "2.0",
      error: error,
    };
  }

  #setupWalletConnectEventsListeners() {
    if (!this.#wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }

    this.#wcWallet.on(
      "session_proposal",
      (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
        this.#onSessionProposal?.(proposal);
      },
    );

    this.#wcWallet.on(
      "session_request",
      async (
        requestEvent: SignClientTypes.EventArguments["session_request"],
      ) => {
        if (!this.#session) {
          console.log("No session found on session_request event.");
          return;
        }
        const { params } = requestEvent;
        const { request } = params;

        switch (request.method) {
          case EIP155_SIGNING_METHODS.ETH_SIGN:
          case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
            this.#onSessionRequest?.(requestEvent, this.#session);
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
