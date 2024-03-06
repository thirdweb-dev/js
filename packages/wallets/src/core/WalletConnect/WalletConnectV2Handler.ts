import { Core } from "@walletconnect/core";
import {
  IWeb3Wallet,
  Web3Wallet,
  Web3WalletTypes,
} from "@walletconnect/web3wallet";
import { ICore, SessionTypes, SignClientTypes } from "@walletconnect/types";
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
import { formatJsonRpcResult } from "@walletconnect/jsonrpc-utils";

export class WalletConnectV2Handler extends WalletConnectHandler {
  private _core: ICore;
  private _wcWallet: IWeb3Wallet | undefined;
  private _session: SessionTypes.Struct | undefined;
  private _wcMetadata: WCMetadata;
  private _activeProposal: Web3WalletTypes.SessionProposal | undefined;
  private _activeRequestEvent: Web3WalletTypes.SessionRequest | undefined;

  constructor(options: WalletConnectReceiverConfig, wallet: AbstractWallet) {
    super(wallet);

    const defaultWCReceiverConfig = {
      walletConnectWalletMetadata: {
        name: "Thirdweb Smart Wallet",
        description: "Thirdweb Smart Wallet",
        url: "https://thirdweb.com",
        icons: ["https://thirdweb.com/favicon.ico"],
      },
      walletConnectV2ProjectId: TW_WC_PROJECT_ID,
      walletConnectV2RelayUrl: WC_RELAY_URL,
      ...(options?.walletConnectReceiver === true
        ? {}
        : options?.walletConnectReceiver),
    };

    this._wcMetadata = defaultWCReceiverConfig.walletConnectWalletMetadata;

    this._core = new Core({
      projectId: defaultWCReceiverConfig.walletConnectV2ProjectId,
      relayUrl: defaultWCReceiverConfig.walletConnectV2RelayUrl,
    });
  }

  async init() {
    this._wcWallet = await Web3Wallet.init({
      core: this._core,
      metadata: this._wcMetadata,
    });

    const sessions = this._wcWallet.getActiveSessions();
    const keys = Object.keys(sessions);
    if (keys[0]) {
      this._session = sessions[keys[0]];
    }

    this._setupWalletConnectEventsListeners();
  }

  async connectApp(wcUri: string) {
    if (!this._wcWallet) {
      throw new Error("Please, init the wallet before connecting an app.");
    }
    await this._wcWallet.core.pairing.pair({ uri: wcUri });
  }

  async approveSession() {
    if (!this._wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }

    if (!this._activeProposal) {
      throw new Error("Please, pass a valid proposal.");
    }

    const account = await this.wallet.getAddress();

    const { id, params } = this._activeProposal;
    const { requiredNamespaces, relays } = params;

    const namespaces: SessionTypes.Namespaces = {};
    Object.keys(requiredNamespaces).forEach((key) => {
      const accounts: string[] = [];
      const namespace = requiredNamespaces[key];
      if (namespace) {
        namespace.chains?.map((chain: string) => {
          accounts.push(`${chain}:${account}`);
        });
        namespaces[key] = {
          accounts,
          methods: namespace.methods,
          events: namespace.events,
        };
      }
    });

    this._session = await this._wcWallet.approveSession({
      id,
      relayProtocol: relays[0]?.protocol,
      namespaces,
    });

    this.emit("session_approved");
  }

  async rejectSession() {
    if (!this._wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }

    if (!this._activeProposal) {
      throw new Error("Please, pass a valid proposal.");
    }

    const { id } = this._activeProposal;
    await this._wcWallet.rejectSession({
      id,
      reason: {
        message: "User rejected methods.",
        code: 5002,
      },
    });
  }

  async approveEIP155Request() {
    if (!this._activeRequestEvent) {
      return;
    }
    const { topic, params, id } = this._activeRequestEvent;
    const { request } = params;

    let response;
    switch (request.method) {
      case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
      case EIP155_SIGNING_METHODS.ETH_SIGN:
        const message = this._getSignParamsMessage(request.params);
        const signedMessage = await this.wallet.signMessage(message || ""); // TODO: handle empty message

        response = formatJsonRpcResult(id, signedMessage);
        break;
      // case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
      // case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
      // case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
      //   const {
      //     domain,
      //     types,
      //     message: data,
      //   } = getSignTypedDataParamsData(request.params);
      //   // https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471
      //   delete types.EIP712Domain;
      //   const signedData = await wallet._signTypedData(domain, types, data);
      //   return formatJsonRpcResult(id, signedData);
      case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
        const signer = await this.wallet.getSigner();
        const sendTransaction = request.params[0];

        const tx = await signer.sendTransaction(sendTransaction);

        const { transactionHash } = await tx.wait();

        response = formatJsonRpcResult(id, transactionHash);
        break;
      case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
        const signerSign = await this.wallet.getSigner();
        const signTransaction = request.params[0];

        const signature = await signerSign.signTransaction(signTransaction);
        response = formatJsonRpcResult(id, signature);
        break;
      default:
        const error = {
          id,
          jsonrpc: "2.0",
          error: {
            message: "Invalid event.",
            code: 1002,
          },
        };
        return this._wcWallet?.respondSessionRequest({
          topic,
          response: error,
        });
    }

    return this._wcWallet?.respondSessionRequest({ topic, response });
  }

  async rejectEIP155Request() {
    if (!this._activeRequestEvent) {
      return;
    }
    const { topic, id } = this._activeRequestEvent;

    const response = {
      id,
      jsonrpc: "2.0",
      error: {
        message: "User rejected methods.",
        code: 5002,
      },
    };

    return this._wcWallet?.respondSessionRequest({ topic, response });
  }

  getActiveSessions(): WCSession[] {
    if (!this._wcWallet) {
      throw new Error("Please, init the wallet before getting sessions.");
    }

    const sessions = this._wcWallet.getActiveSessions();

    const sessionKeys = Object.keys(sessions);
    if (!sessions || sessionKeys.length === 0) {
      return [];
    }

    const thisSessions = [];
    for (const sessionKey of sessionKeys) {
      const session = sessions[sessionKey];

      if (session) {
        const topic = session.topic;
        const peerMeta = session.peer.metadata;

        thisSessions.push({
          topic,
          peer: {
            metadata: peerMeta,
          },
        });
      }
    }

    return thisSessions;
  }

  disconnectSession(): Promise<void> {
    if (!this._wcWallet) {
      throw new Error("Please, init the wallet before disconnecting sessions.");
    }

    if (!this._session) {
      return Promise.resolve();
    }

    const params = {
      topic: this._session.topic,
      reason: {
        message: "User disconnected.",
        code: 6000,
      },
    };

    return this._wcWallet?.disconnectSession(params);
  }

  private _setupWalletConnectEventsListeners() {
    if (!this._wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }

    this._wcWallet.on(
      "session_proposal",
      (proposal: Web3WalletTypes.SessionProposal) => {
        this._activeProposal = proposal;

        this.emit("session_proposal", {
          proposer: {
            metadata: proposal.params.proposer.metadata,
          },
        });
      },
    );

    this._wcWallet.on(
      "session_delete",
      (session: SignClientTypes.EventArguments["session_delete"]) => {
        this._session = undefined;
        this._activeProposal = undefined;

        this.emit("session_delete", { topic: session.topic });
      },
    );

    this._wcWallet.on(
      "session_request",
      async (requestEvent: Web3WalletTypes.SessionRequest) => {
        if (!this._session) {
          return;
        }
        const { params: requestParams } = requestEvent;
        const { request } = requestParams;
        const { params } = request;

        switch (request.method) {
          case EIP155_SIGNING_METHODS.ETH_SIGN:
          case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
            this._activeRequestEvent = requestEvent;

            const message = params[0];
            const decodedMessage = new TextDecoder().decode(
              utils.arrayify(message),
            );

            const paramsCopy = [...params];
            paramsCopy[0] = decodedMessage;

            this.emit("session_request", {
              topic: this._session.topic,
              params: paramsCopy,
              peer: {
                metadata: this._session.peer.metadata,
              },
              method: request.method,
            });
            return;
          case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
          case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
            this._activeRequestEvent = requestEvent;

            this.emit("session_request", {
              topic: this._session.topic,
              params: requestEvent.params.request.params,
              peer: {
                metadata: this._session.peer.metadata,
              },
              method: request.method,
            });
            return;
          default:
            throw new Error(`WCV2.Method not supported: ${request.method}`);
        }
      },
    );
  }

  /**
   * Gets message from various signing request methods by filtering out
   * a value that is not an address (thus is a message).
   * If it is a hex string, it gets converted to utf8 string
   */
  private _getSignParamsMessage(params: string[]) {
    const message = params.filter((p) => !utils.isAddress(p))[0] || ""; // TODO: handle empty message

    if (utils.isHexString(message)) {
      return utils.toUtf8String(message);
    }

    return message;
  }
}
