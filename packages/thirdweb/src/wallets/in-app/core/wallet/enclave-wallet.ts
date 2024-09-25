import { bytesToHex } from "viem";
import { getCachedChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { eth_sendRawTransaction } from "../../../../rpc/actions/eth_sendRawTransaction.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import { getAddress } from "../../../../utils/address.js";
import { type Hex, toHex } from "../../../../utils/encoding/hex.js";
import { parseTypedData } from "../../../../utils/signatures/helpers/parseTypedData.js";
import type { Prettify } from "../../../../utils/type-utils.js";
import type {
  Account,
  SendTransactionOption,
} from "../../../interfaces/wallet.js";
import { getUserStatus } from "../../web/lib/actions/get-enclave-user-status.js";
import { signMessage as signEnclaveMessage } from "../../web/lib/actions/sign-message.enclave.js";
import { signTransaction as signEnclaveTransaction } from "../../web/lib/actions/sign-transaction.enclave.js";
import { signTypedData as signEnclaveTypedData } from "../../web/lib/actions/sign-typed-data.enclave.js";
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
  wallets:
    | [
        {
          address: string;
          createdAt: string;
          type: "sharded" | "enclave";
        },
      ]
    | [];
  id: string;
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
      userWalletId: userStatus.id || "",
      recoveryShareManagement: "ENCLAVE",
    };

    if (!wallet) {
      return {
        status: "Logged In, Wallet Uninitialized",
        authDetails,
      };
    }

    return {
      status: "Logged In, Wallet Initialized",
      walletAddress: wallet.address,
      authDetails,
      account: await this.getAccount(),
    };
  }

  /**
   * Returns an account to perform wallet operations
   * @internal
   */
  async getAccount(): Promise<Account> {
    const client = this.client;
    const ecosystem = this.ecosystem;
    const storage = this.localStorage;

    const _signTransaction = async (tx: SendTransactionOption) => {
      const rpcRequest = getRpcClient({
        client,
        chain: getCachedChain(tx.chainId),
      });
      const transaction: Record<string, Hex | number | undefined> = {
        to: (tx.to as Hex) ?? undefined,
        data: tx.data ? toHex(tx.data) : undefined,
        value: tx.value ? toHex(tx.value) : undefined,
        gas: tx.gas ? toHex(tx.gas + tx.gas / BigInt(10)) : undefined, // Add a 10% buffer to gas
        nonce: tx.nonce
          ? toHex(tx.nonce)
          : toHex(
              await import(
                "../../../../rpc/actions/eth_getTransactionCount.js"
              ).then(({ eth_getTransactionCount }) =>
                eth_getTransactionCount(rpcRequest, {
                  address: this.address,
                  blockTag: "pending",
                }),
              ),
            ),
        chainId: toHex(tx.chainId),
      };

      if (tx.maxFeePerGas) {
        transaction.maxFeePerGas = toHex(tx.maxFeePerGas);
        transaction.maxPriorityFeePerGas = tx.maxPriorityFeePerGas
          ? toHex(tx.maxPriorityFeePerGas)
          : undefined;
        transaction.type = 2;
      } else {
        transaction.gasPrice = tx.gasPrice ? toHex(tx.gasPrice) : undefined;
        transaction.type = 0;
      }

      return signEnclaveTransaction({
        client,
        ecosystem,
        storage,
        payload: transaction,
      });
    };
    return {
      address: getAddress(this.address),
      async signTransaction(tx) {
        if (!tx.chainId) {
          throw new Error("chainId required in tx to sign");
        }

        return _signTransaction({
          chainId: tx.chainId,
          ...tx,
        });
      },
      async sendTransaction(tx) {
        const rpcRequest = getRpcClient({
          client,
          chain: getCachedChain(tx.chainId),
        });
        const signedTx = await _signTransaction(tx);
        const transactionHash = await eth_sendRawTransaction(
          rpcRequest,
          signedTx,
        );
        return {
          transactionHash,
        };
      },
      async signMessage({ message }) {
        const messagePayload = (() => {
          if (typeof message === "string") {
            return { message, isRaw: false };
          }
          return {
            message:
              typeof message.raw === "string"
                ? message.raw
                : bytesToHex(message.raw),
            isRaw: true,
          };
        })();

        const { signature } = await signEnclaveMessage({
          client,
          ecosystem,
          payload: messagePayload,
          storage,
        });
        return signature as Hex;
      },
      async signTypedData(_typedData) {
        const parsedTypedData = parseTypedData(_typedData);
        const { signature } = await signEnclaveTypedData({
          client,
          ecosystem,
          payload: parsedTypedData,
          storage,
        });

        return signature as Hex;
      },
    };
  }
}
