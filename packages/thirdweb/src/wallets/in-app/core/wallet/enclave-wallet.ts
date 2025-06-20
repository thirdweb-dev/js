import { bytesToHex } from "viem";
import { trackTransaction } from "../../../../analytics/track/transaction.js";
import { getCachedChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { eth_sendRawTransaction } from "../../../../rpc/actions/eth_sendRawTransaction.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import { getAddress } from "../../../../utils/address.js";
import { type Hex, isHex, toHex } from "../../../../utils/encoding/hex.js";
import { parseTypedData } from "../../../../utils/signatures/helpers/parse-typed-data.js";
import type { Prettify } from "../../../../utils/type-utils.js";
import type {
  Account,
  SendTransactionOption,
} from "../../../interfaces/wallet.js";
import { getUserStatus } from "../actions/get-enclave-user-status.js";
import { signAuthorization as signEnclaveAuthorization } from "../actions/sign-authorization.enclave.js";
import { signMessage as signEnclaveMessage } from "../actions/sign-message.enclave.js";
import { signTransaction as signEnclaveTransaction } from "../actions/sign-transaction.enclave.js";
import { signTypedData as signEnclaveTypedData } from "../actions/sign-typed-data.enclave.js";
import type { ClientScopedStorage } from "../authentication/client-scoped-storage.js";
import type {
  AuthDetails,
  AuthResultAndRecoveryCode,
  GetUser,
} from "../authentication/types.js";
import type { Ecosystem } from "./types.js";
import type { IWebWallet } from "./web-wallet.js";

export type UserStatus = {
  linkedAccounts: {
    type: string;
    details:
      | { email: string; [key: string]: string }
      | { phone: string; [key: string]: string }
      | { address: string; [key: string]: string }
      | { id: string; [key: string]: string };
  }[];
  wallets: UserWallet[];
  id: string;
};

export type UserWallet = {
  address: string;
  createdAt: string;
  type: "sharded" | "enclave";
};

export class EnclaveWallet implements IWebWallet {
  private client: ThirdwebClient;
  private ecosystem?: Ecosystem;
  private address: string;
  private localStorage: ClientScopedStorage;

  constructor({
    client,
    ecosystem,
    address,
    storage,
  }: Prettify<{
    client: ThirdwebClient;
    ecosystem?: Ecosystem;
    address: string;
    storage: ClientScopedStorage;
  }>) {
    this.client = client;
    this.ecosystem = ecosystem;
    this.address = address;
    this.localStorage = storage;
  }

  /**
   * Store the auth token for use
   * @returns `{walletAddress: string }` The user's wallet details
   * @internal
   */
  async postWalletSetUp(authResult: AuthResultAndRecoveryCode): Promise<void> {
    await this.localStorage.saveAuthCookie(authResult.storedToken.cookieString);
  }

  /**
   * Gets the current user's details
   * @internal
   */
  async getUserWalletStatus(): Promise<GetUser> {
    const token = await this.localStorage.getAuthCookie();
    if (!token) {
      return { status: "Logged Out" };
    }

    const userStatus = await getUserStatus({
      authToken: token,
      client: this.client,
      ecosystem: this.ecosystem,
    });

    if (!userStatus) {
      return { status: "Logged Out" };
    }
    const wallet = userStatus.wallets[0];

    const authDetails: AuthDetails = {
      email: userStatus.linkedAccounts.find(
        (account) => account.details.email !== undefined,
      )?.details.email,
      phoneNumber: userStatus.linkedAccounts.find(
        (account) => account.details.phone !== undefined,
      )?.details.phone,
      recoveryShareManagement: "ENCLAVE",
      userWalletId: userStatus.id || "",
    };

    if (!wallet) {
      return {
        authDetails,
        status: "Logged In, Wallet Uninitialized",
      };
    }

    return {
      account: await this.getAccount(),
      authDetails,
      status: "Logged In, Wallet Initialized",
      walletAddress: wallet.address,
    };
  }

  /**
   * Returns an account to perform wallet operations
   * @internal
   */
  async getAccount(): Promise<Account> {
    const client = this.client;
    const storage = this.localStorage;
    const address = this.address;
    const ecosystem = this.ecosystem;

    const _signTransaction = async (tx: SendTransactionOption) => {
      const rpcRequest = getRpcClient({
        chain: getCachedChain(tx.chainId),
        client,
      });
      const transaction: Record<string, unknown> = {
        chainId: toHex(tx.chainId),
        data: tx.data,
        gas: hexlify(tx.gas),
        nonce:
          hexlify(tx.nonce) ||
          toHex(
            await import(
              "../../../../rpc/actions/eth_getTransactionCount.js"
            ).then(({ eth_getTransactionCount }) =>
              eth_getTransactionCount(rpcRequest, {
                address: getAddress(this.address),
                blockTag: "pending",
              }),
            ),
          ),
        to: tx.to ? getAddress(tx.to) : undefined,
        value: hexlify(tx.value),
      };

      if (tx.authorizationList && tx.authorizationList.length > 0) {
        transaction.type = 4;
        transaction.authorizationList = tx.authorizationList;
        transaction.maxFeePerGas = hexlify(tx.maxFeePerGas);
        transaction.maxPriorityFeePerGas = hexlify(tx.maxPriorityFeePerGas);
      } else if (hexlify(tx.maxFeePerGas)) {
        transaction.maxFeePerGas = hexlify(tx.maxFeePerGas);
        transaction.maxPriorityFeePerGas = hexlify(tx.maxPriorityFeePerGas);
        transaction.type = 2;
      } else {
        transaction.gasPrice = hexlify(tx.gasPrice);
        transaction.type = 0;
      }

      return signEnclaveTransaction({
        client,
        payload: transaction,
        storage,
      });
    };
    return {
      address: getAddress(address),
      async sendTransaction(tx) {
        const rpcRequest = getRpcClient({
          chain: getCachedChain(tx.chainId),
          client,
        });
        const signedTx = await _signTransaction(tx);

        const transactionHash = await eth_sendRawTransaction(
          rpcRequest,
          signedTx,
        );

        trackTransaction({
          chainId: tx.chainId,
          client,
          contractAddress: tx.to ?? undefined,
          ecosystem,
          gasPrice: tx.gasPrice,
          transactionHash,
          walletAddress: address,
          walletType: "inApp",
        });

        return { transactionHash };
      },
      async signAuthorization(payload) {
        const authorization = await signEnclaveAuthorization({
          client,
          payload,
          storage,
        });
        return {
          address: getAddress(authorization.address),
          chainId: Number.parseInt(authorization.chainId),
          nonce: BigInt(authorization.nonce),
          r: BigInt(authorization.r),
          s: BigInt(authorization.s),
          yParity: Number.parseInt(authorization.yParity),
        };
      },
      async signMessage({ message, originalMessage, chainId }) {
        const messagePayload = (() => {
          if (typeof message === "string") {
            return { chainId, isRaw: false, message, originalMessage };
          }
          return {
            chainId,
            isRaw: true,
            message:
              typeof message.raw === "string"
                ? message.raw
                : bytesToHex(message.raw),
            originalMessage,
          };
        })();

        const { signature } = await signEnclaveMessage({
          client,
          payload: messagePayload,
          storage,
        });
        return signature as Hex;
      },
      async signTransaction(tx) {
        if (!tx.chainId) {
          throw new Error("chainId required in tx to sign");
        }

        return _signTransaction({
          chainId: tx.chainId,
          ...tx,
        });
      },
      async signTypedData(_typedData) {
        const parsedTypedData = parseTypedData(_typedData);
        const { signature } = await signEnclaveTypedData({
          client,
          payload: parsedTypedData,
          storage,
        });

        return signature as Hex;
      },
    };
  }
}

function hexlify(value: string | number | bigint | undefined) {
  return value === undefined || isHex(value) ? value : toHex(value);
}
