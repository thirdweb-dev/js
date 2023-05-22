import {
  WCSession,
  WalletConnectHandler,
  WalletConnectReceiverConfig,
  WCMetadata,
} from "../types/walletConnect";
import WalletConnect from "@walletconnect/client";
import { EIP155_SIGNING_METHODS } from "../../evm/constants/wc";
import { AbstractClientWallet } from "../../evm/wallets/base";
import { SyncStorage } from "../SyncStorage";
import {
  ISessionStorage,
  IWalletConnectSession,
} from "@walletconnect/legacy-types";
import { utils } from "ethers";

type WalletConnectV1WalletConfig = Omit<
  WalletConnectReceiverConfig,
  "enableConnectApp"
> & {
  storage: SyncStorage;
};

const STORAGE_URI_KEY = "storage_uri_key";

export class WalletConnectV1Handler extends WalletConnectHandler {
  #wcMetadata: WCMetadata;
  #wcWallet: WalletConnect | undefined;

  #activeSessionPayload: any;
  #activeCallRequest: any;

  #storage: SyncStorage;
  #sessionStorage: ISessionStorage;

  constructor(options: WalletConnectV1WalletConfig) {
    super();

    this.#wcMetadata = options?.walletConnectV2Metadata || {
      name: "Thirdweb Smart Wallet",
      description: "Thirdweb Smart Wallet",
      url: "https://thirdweb.com",
      icons: ["https://thirdweb.com/favicon.ico"],
    };

    this.#storage = options.storage;
    this.#sessionStorage = new SessionStorage(options.storage);
  }

  async init(): Promise<void> {
    const uri = this.#storage.getItem(STORAGE_URI_KEY);

    console.log("uri", uri);

    if (uri) {
      this.#init(uri);
    }

    return Promise.resolve();
  }

  async connectApp(uri: string): Promise<void> {
    console.log("connectApp", uri);
    if (!this.#wcWallet) {
      this.#storage.setItem(STORAGE_URI_KEY, uri);

      this.#init(uri);
    }

    return Promise.resolve();
  }

  async approveSession(wallet: AbstractClientWallet): Promise<void> {
    if (!this.#wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }

    const address = await wallet.getAddress();
    const chainId = await wallet.getChainId();
    this.#wcWallet.approveSession({
      accounts: [address],
      chainId: chainId,
    });

    return Promise.resolve();
  }
  rejectSession(): Promise<void> {
    if (!this.#wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }

    this.#wcWallet.rejectSession();

    return Promise.resolve();
  }
  async approveEIP155Request(wallet: AbstractClientWallet): Promise<void> {
    console.log("wcwalletv1.approve", !!this.#wcWallet);
    console.log("wcwalletv1.activeCallReqeust", this.#activeCallRequest);

    const { params, method } = this.#activeCallRequest;

    let result;
    switch (method) {
      case EIP155_SIGNING_METHODS.ETH_SIGN:
        const ethMsg = params[1];
        result = await wallet.signMessage(utils.arrayify(ethMsg));
        break;
      case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
        console.log("call_request", method);

        const message = params[0];
        result = await wallet.signMessage(utils.arrayify(message));

        console.log("wcwalletv1.signedMessage", result);
        break;
      case EIP155_SIGNING_METHODS.SWITCH_CHAIN: {
        await wallet.switchChain(params[0].chainId);
        result = params[0].chainId;
        break;
      }
    }

    this.#wcWallet?.approveRequest({
      id: this.#activeCallRequest?.id,
      result,
    });

    return Promise.resolve();
  }
  rejectEIP155Request(): Promise<void> {
    console.log("wcwallet.reject", !!this.#wcWallet);
    this.#wcWallet?.rejectRequest({
      id: 1,
      error: {
        message: "Rejected by user",
      },
    });

    return Promise.resolve();
  }
  getActiveSessions(): WCSession[] {
    const session = this.#wcWallet?.session;

    if (!session) {
      return [];
    }

    console.log("getActiveSession.session", session);

    const result: WCSession[] = [
      {
        topic: session?.clientId,
        peer: {
          metadata: session.peerMeta
            ? session.peerMeta
            : {
                name: "Thirdweb Powered Wallet",
                description: "Thirdweb Powered Wallet",
                url: "https://thirdweb.com",
                icons: ["https://thirdweb.com/favicon.ico"],
              },
        },
      },
    ];

    return result;
  }
  async disconnectSession(): Promise<void> {
    this.#wcWallet?.killSession();

    this.#wcWallet?.off("session_request");
    this.#wcWallet?.off("call_request");
    this.#wcWallet?.off("disconnect");

    this.#storage.removeItem(STORAGE_URI_KEY);
    this.#wcWallet = undefined;

    this.emit("session_delete");

    return Promise.resolve();
  }

  #init(uri: string) {
    this.#wcWallet = new WalletConnect({
      uri: uri,
      clientMeta: this.#wcMetadata,
      storage: this.#sessionStorage,
    });

    this.#setupWalletConnectEventsListeners();
  }

  #setupWalletConnectEventsListeners() {
    if (!this.#wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }

    console.log("setupWalletListeners");

    // Subscribe to session requests
    this.#wcWallet.on("session_request", (error, payload) => {
      if (error) {
        throw new Error(`WCV1H.session_request error: ${error.message}`);
      }

      this.#activeSessionPayload = payload;

      console.log("session_proposal", payload);

      this.emit("session_proposal", {
        proposer: {
          metadata: payload.params[0].peerMeta,
        },
      });
    });

    // Subscribe to call requests
    this.#wcWallet.on("call_request", (error, payload) => {
      console.log("call_request", error, payload);

      if (error) {
        throw new Error(`WCV1H.call_request error: ${error.message}`);
      }

      const { params, method } = payload;
      this.#activeCallRequest = payload;

      switch (method) {
        case EIP155_SIGNING_METHODS.ETH_SIGN:
        case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
          console.log("call_request", method);

          const message = params[0];
          const decodedMessage = new TextDecoder().decode(
            utils.arrayify(message),
          );
          console.log("call_request", method);

          const paramsCopy = [...params];
          paramsCopy[0] = decodedMessage;

          this.emit("session_request", {
            topic: params[1],
            params: paramsCopy,
            peer: {
              metadata: this.#activeSessionPayload.params[0].peerMeta,
            },
            method: method,
          });
          break;
        case EIP155_SIGNING_METHODS.SWITCH_CHAIN:
          console.log("call_request", method);

          this.emit("session_request", {
            topic: params[1],
            params: params,
            peer: {
              metadata: this.#activeSessionPayload.params[0].peerMeta,
            },
            method: method,
          });
          break;
        default:
          throw new Error(
            `WalletConnectV1Handler.call_request. Method not implemented: ${method}`,
          );
      }
    });

    this.#wcWallet.on("disconnect", (error) => {
      console.log("disconnect", error);
      if (error) {
        throw new Error(`WCV1H.disconnect error: ${error.message}`);
      }

      this.disconnectSession();
    });
  }
}

class SessionStorage implements ISessionStorage {
  #storage: SyncStorage;

  constructor(storage: SyncStorage) {
    this.#storage = storage;
  }

  getSession(): IWalletConnectSession | null {
    const session = this.#storage.getItem("session");

    if (!session) {
      return null;
    }

    const sessionObj = JSON.parse(session);

    return sessionObj as IWalletConnectSession;
  }

  setSession(session: IWalletConnectSession): IWalletConnectSession {
    this.#storage.setItem("session", JSON.stringify(session));

    return session;
  }

  removeSession() {
    this.#storage.removeItem("session");
  }
}
