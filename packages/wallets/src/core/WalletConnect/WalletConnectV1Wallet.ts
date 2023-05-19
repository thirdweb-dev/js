import {
  WCSession,
  WalletConnectWallet,
  WalletConnectReceiverConfig,
  WCMetadata,
} from "../types/walletConnect";
import WalletConnect from "@walletconnect/client";
import { EIP155_SIGNING_METHODS } from "../../evm/constants/wc";
import { AbstractClientWallet } from "../../evm/wallets/base";
import { IStorage } from "../IStorage";
import {
  ISessionStorage,
  IWalletConnectSession,
} from "@walletconnect/legacy-types";
import { utils } from "ethers";

type WalletConnectV1WalletConfig = Omit<
  WalletConnectReceiverConfig,
  "enableConnectApp"
> & {
  storage: IStorage;
};

const STORAGE_URI_KEY = "storage_uri_key";

export class WalletConnectV1Wallet extends WalletConnectWallet {
  #wcMetadata: WCMetadata;
  #wcWallet: WalletConnect | undefined;

  #activeSessionPayload: any;
  #activeCallRequest: any;

  #storage: IStorage;
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

    if (uri) {
      this.#init(uri);
    }

    return Promise.resolve();
  }

  async connectApp(uri: string): Promise<void> {
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
    this.#wcWallet.approveSession({
      accounts: [address],
      chainId: 1,
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

    const { params } = this.#activeCallRequest;
    const message = params[0];
    const stringarray = new TextDecoder().decode(utils.arrayify(message));
    console.log("wcwalletv1.stringarray", stringarray);
    const signedMessage = await wallet.signMessage(stringarray);

    console.log("wcwalletv1.signedMessage", signedMessage);

    this.#wcWallet?.approveRequest({
      id: this.#activeCallRequest?.id,
      result: signedMessage,
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
  disconnectSession(): Promise<void> {
    this.#wcWallet?.killSession();

    this.#wcWallet?.off("session_request");
    this.#wcWallet?.off("call_request");
    this.#wcWallet?.off("disconnect");

    this.#storage.removeItem(STORAGE_URI_KEY);
    this.#wcWallet = undefined;
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
        throw error;
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
        throw error;
      }

      const { params, method } = payload;

      console.log("session_request", payload);

      switch (method) {
        case EIP155_SIGNING_METHODS.ETH_SIGN:
        case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
          this.#activeCallRequest = payload;

          console.log("call_request", method);

          this.emit("session_request", {
            topic: params[1],
            message: params[0],
            peer: {
              metadata: this.#activeSessionPayload.params[0].peerMeta,
            },
            method: method,
          });
          return;
      }
    });

    this.#wcWallet.on("disconnect", (error) => {
      if (error) {
        throw error;
      }

      this.disconnectSession();
    });
  }
}

class SessionStorage implements ISessionStorage {
  #storage: IStorage;

  constructor(storage: IStorage) {
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
