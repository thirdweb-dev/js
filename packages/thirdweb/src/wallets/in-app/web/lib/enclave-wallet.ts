import { bytesToHex } from "viem";
import { getCachedChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { eth_sendRawTransaction } from "../../../../rpc/actions/eth_sendRawTransaction.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import { getAddress } from "../../../../utils/address.js";
import { type Hex, toHex } from "../../../../utils/encoding/hex.js";
import { parseTypedData } from "../../../../utils/signatures/helpers/parseTypedData.js";
import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import type { Prettify } from "../../../../utils/type-utils.js";
import type {
  Account,
  SendTransactionOption,
} from "../../../interfaces/wallet.js";
import { ClientScopedStorage } from "../../core/authentication/client-scoped-storage.js";
import {
  type GetUser,
  RecoveryShareManagement,
  UserWalletStatus,
  type WalletAddressObjectType,
} from "../../core/authentication/types.js";
import type { Ecosystem } from "../types.js";
import { getUserStatus } from "./actions/get-enclave-user-status.js";
import { signMessage as signEnclaveMessage } from "./actions/sign-message.enclave.js";
import { signTransaction as signEnclaveTransaction } from "./actions/sign-transaction.enclave.js";
import { signTypedData as signEnclaveTypedData } from "./actions/sign-typed-data.enclave.js";
import type { IWebWallet, PostWalletSetup } from "./web-wallet.js";

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
  public client: ThirdwebClient;
  public ecosystem?: Ecosystem;
  public address: string;
  protected localStorage: ClientScopedStorage;

  constructor({
    client,
    ecosystem,
    address,
  }: Prettify<{
    client: ThirdwebClient;
    ecosystem?: Ecosystem;
    address: string;
  }>) {
    this.client = client;
    this.ecosystem = ecosystem;
    this.address = address;

    this.localStorage = new ClientScopedStorage({
      storage: webLocalStorage,
      clientId: client.clientId,
      ecosystemId: ecosystem?.id,
    });
  }

  /**
   * Store the auth token for use
   * @returns `{walletAddress: string }` The user's wallet details
   * @internal
   */
  async postWalletSetUp({
    walletAddress,
    authToken,
  }: PostWalletSetup): Promise<WalletAddressObjectType> {
    await this.localStorage.saveAuthCookie(authToken);
    return { walletAddress };
  }

  /**
   * Gets the current user's details
   * @internal
   */
  async getUserWalletStatus(): Promise<GetUser> {
    const token = await this.localStorage.getAuthCookie();
    if (!token) {
      return { status: UserWalletStatus.LOGGED_OUT };
    }

    const userStatus = await getUserStatus({
      authToken: token,
      client: this.client,
      ecosystem: this.ecosystem,
    });

    if (!userStatus) {
      return { status: UserWalletStatus.LOGGED_OUT };
    }
    const wallet = userStatus.wallets[0];

    const authDetails = {
      email: userStatus.linkedAccounts.find(
        (account) => account.details.email !== undefined,
      )?.details.email,
      phoneNumber: userStatus.linkedAccounts.find(
        (account) => account.details.phone !== undefined,
      )?.details.phone,
      userWalletId: userStatus.id || "",
      recoveryShareManagement: RecoveryShareManagement.ENCLAVE,
    };

    if (!wallet) {
      return {
        status: UserWalletStatus.LOGGED_IN_WALLET_UNINITIALIZED,
        authDetails,
      };
    }

    return {
      status: UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED,
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
        });
        return signature as Hex;
      },
      async signTypedData(_typedData) {
        const parsedTypedData = parseTypedData(_typedData);
        const { signature } = await signEnclaveTypedData({
          client,
          ecosystem,
          payload: parsedTypedData,
        });

        return signature as Hex;
      },
    };
  }
}
