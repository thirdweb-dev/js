import type * as ethers5 from "ethers5";
import type { TypedDataDefinition } from "viem";
import { getCachedChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { eth_sendRawTransaction } from "../../../../rpc/actions/eth_sendRawTransaction.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import { type Hex, hexToString } from "../../../../utils/encoding/hex.js";
import { parseTypedData } from "../../../../utils/signatures/helpers/parseTypedData.js";
import type { Prettify } from "../../../../utils/type-utils.js";
import { getEcosystemPartnerPermissions } from "../../../ecosystem/get-ecosystem-partner-permissions.js";
import type {
  Account,
  SendTransactionOption,
} from "../../../interfaces/wallet.js";
import {
  type GetUser,
  type GetUserWalletStatusRpcReturnType,
  type SetUpWalletRpcReturnType,
  UserWalletStatus,
  type WalletAddressObjectType,
} from "../../core/authentication/type.js";
import type {
  ClientIdWithQuerierType,
  Ecosystem,
  GetAddressReturnType,
  SignMessageReturnType,
  SignTransactionReturnType,
  SignedTypedDataReturnType,
} from "../types.js";
import { LocalStorage } from "../utils/Storage/LocalStorage.js";
import type { InAppWalletIframeCommunicator } from "../utils/iFrameCommunication/InAppWalletIframeCommunicator.js";

export type WalletManagementTypes = {
  createWallet: undefined;
  setUpNewDevice: undefined;
  getUserStatus: undefined;
};
export type WalletManagementUiTypes = {
  createWalletUi: undefined;
  setUpNewDeviceUi: undefined;
};

export type InAppWalletInternalHelperType = { showUi: boolean };

export type SignerProcedureTypes = {
  getAddress: undefined;
  signMessage: {
    message: string | Hex;
    chainId: number;
    rpcEndpoint?: string;
    partnerId?: string;
  };
  signTransaction: {
    transaction: ethers5.ethers.providers.TransactionRequest;
    chainId: number;
    rpcEndpoint?: string;
    partnerId?: string;
  };
  signTypedDataV4: {
    domain: TypedDataDefinition["domain"];
    types: TypedDataDefinition["types"];
    message: TypedDataDefinition["message"];
    chainId: number;
    rpcEndpoint?: string;
    partnerId?: string;
  };
  //connect: { provider: Provider };
};

type PostWalletSetup = SetUpWalletRpcReturnType & {
  walletUserId: string;
};

/**
 *
 */
export class IFrameWallet {
  public client: ThirdwebClient;
  public ecosystem?: Ecosystem;
  protected walletManagerQuerier: InAppWalletIframeCommunicator<
    WalletManagementTypes & WalletManagementUiTypes
  >;
  protected localStorage: LocalStorage;

  /**
   * Not meant to be initialized directly. Call {@link initializeUser} to get an instance
   * @internal
   */
  constructor({
    client,
    ecosystem,
    querier,
  }: Prettify<
    ClientIdWithQuerierType & {
      ecosystem?: Ecosystem;
    }
  >) {
    this.client = client;
    this.ecosystem = ecosystem;
    this.walletManagerQuerier = querier;

    this.localStorage = new LocalStorage({
      clientId: client.clientId,
      ecosystemId: ecosystem?.id,
    });
  }

  /**
   * Used to set-up the user device in the case that they are using incognito
   * @returns `{walletAddress : string }` The user's wallet details
   * @internal
   */
  async postWalletSetUp({
    deviceShareStored,
    walletAddress,
    isIframeStorageEnabled,
    walletUserId,
  }: PostWalletSetup): Promise<WalletAddressObjectType> {
    if (!isIframeStorageEnabled) {
      await this.localStorage.saveDeviceShare(deviceShareStored, walletUserId);
    }
    return { walletAddress };
  }

  /**
   * Gets the various status states of the user
   * @example
   * ```typescript
   *  const userStatus = await Paper.getUserWalletStatus();
   *  switch (userStatus.status) {
   *  case UserWalletStatus.LOGGED_OUT: {
   *    // User is logged out, call one of the auth methods on Paper.auth to authenticate the user
   *    break;
   *  }
   *  case UserWalletStatus.LOGGED_IN_WALLET_UNINITIALIZED: {
   *    // User is logged in, but does not have a wallet associated with it
   *    // you also have access to the user's details
   *    userStatus.user.authDetails;
   *    break;
   *  }
   *  case UserWalletStatus.LOGGED_IN_NEW_DEVICE: {
   *    // User is logged in and created a wallet already, but is missing the device shard
   *    // You have access to:
   *    userStatus.user.authDetails;
   *    userStatus.user.walletAddress;
   *    break;
   *  }
   *  case UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED: {
   *    // user is logged in and wallet is all set up.
   *    // You have access to:
   *    userStatus.user.authDetails;
   *    userStatus.user.walletAddress;
   *    userStatus.user.wallet;
   *    break;
   *  }
   *}
   *```
   * @returns `{GetUserWalletStatusFnReturnType}` an object to containing various information on the user statuses
   * @internal
   */
  async getUserWalletStatus(): Promise<GetUser> {
    const userStatus =
      await this.walletManagerQuerier.call<GetUserWalletStatusRpcReturnType>({
        procedureName: "getUserStatus",
        params: undefined,
      });
    if (userStatus.status === UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED) {
      return {
        status: UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED,
        ...userStatus.user,
        account: await this.getAccount(),
      };
    }
    if (userStatus.status === UserWalletStatus.LOGGED_IN_NEW_DEVICE) {
      return {
        status: UserWalletStatus.LOGGED_IN_WALLET_UNINITIALIZED,
        ...userStatus.user,
      };
    }
    if (userStatus.status === UserWalletStatus.LOGGED_IN_WALLET_UNINITIALIZED) {
      return {
        status: UserWalletStatus.LOGGED_IN_WALLET_UNINITIALIZED,
        ...userStatus.user,
      };
    }
    // Logged out
    return { status: userStatus.status };
  }

  /**
   * Returns an account that communicates with the iFrame for signing operations
   * @internal
   */
  async getAccount(): Promise<Account> {
    const querier = this
      .walletManagerQuerier as unknown as InAppWalletIframeCommunicator<SignerProcedureTypes>;
    const client = this.client;
    const partnerId = this.ecosystem?.partnerId;
    const isEcosystem = !!this.ecosystem;

    const permissions = this.ecosystem
      ? await getEcosystemPartnerPermissions(
          this.ecosystem.id,
          this.ecosystem?.partnerId,
        )
      : undefined;

    const { address } = await querier.call<GetAddressReturnType>({
      procedureName: "getAddress",
      params: undefined,
    });
    const _signTransaction = async (tx: SendTransactionOption) => {
      // biome-ignore lint/suspicious/noExplicitAny: ethers tx transformation
      const transaction: Record<string, any> = {
        to: tx.to ?? undefined,
        data: tx.data,
        value: tx.value,
        gasLimit: tx.gas,
        nonce: tx.nonce,
        chainId: tx.chainId,
      };
      if (tx.maxFeePerGas) {
        // ethers (in the iframe) rejects any type 0 trasaction with unknown keys
        // TODO remove this once iframe is upgraded to v5
        transaction.accessList = tx.accessList;
        transaction.maxFeePerGas = tx.maxFeePerGas;
        transaction.maxPriorityFeePerGas = tx.maxPriorityFeePerGas;
        transaction.type = 2;
      } else {
        transaction.gasPrice = tx.gasPrice;
        transaction.type = 0;
      }
      const { signedTransaction } =
        await querier.call<SignTransactionReturnType>({
          procedureName: "signTransaction",
          params: {
            transaction,
            chainId: tx.chainId,
            partnerId,
            rpcEndpoint: `https://${tx.chainId}.rpc.thirdweb.com`, // TODO (ew) shouldnt be needed
          },
          // Can hide the iframe if the partner has full control (no user approvals)
          showIframe: permissions?.permissions.includes("FULL_CONTROL_V1")
            ? false
            : isEcosystem,
        });
      return signedTransaction as Hex;
    };
    return {
      address,
      async signTransaction(tx) {
        if (!tx.chainId) {
          throw new Error("chainId required in tx to sign");
        }
        return _signTransaction({
          ...tx,
          chainId: tx.chainId,
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
        // in-app wallets use ethers to sign messages, which always expects a string (or bytes maybe but string is safest)
        const messageDecoded = (() => {
          if (typeof message === "string") {
            return message;
          }
          if (message.raw instanceof Uint8Array) {
            return message.raw;
          }
          return hexToString(message.raw);
        })();

        const { signedMessage } = await querier.call<SignMessageReturnType>({
          procedureName: "signMessage",
          params: {
            // biome-ignore lint/suspicious/noExplicitAny: ethers tx transformation
            message: messageDecoded as any, // needs bytes or string
            partnerId,
            chainId: 1, // TODO check if we need this
          },
          // Can hide the iframe if the partner has full control (no user approvals)
          showIframe: permissions?.permissions.includes("FULL_CONTROL_V1")
            ? false
            : isEcosystem,
        });
        return signedMessage as Hex;
      },
      async signTypedData(_typedData) {
        const parsedTypedData = parseTypedData(_typedData);
        // deleting EIP712 Domain as it results in ambiguous primary type on some cases
        // this happens when going from viem to ethers via the iframe
        if (parsedTypedData.types?.EIP712Domain) {
          parsedTypedData.types.EIP712Domain = undefined;
        }
        const domain = parsedTypedData.domain as TypedDataDefinition["domain"];
        const chainId = domain?.chainId || 1;

        const { signedTypedData } =
          await querier.call<SignedTypedDataReturnType>({
            procedureName: "signTypedDataV4",
            params: {
              domain: {
                chainId: chainId,
                verifyingContract: domain?.verifyingContract,
                name: domain?.name,
                version: domain?.version,
              },
              types:
                parsedTypedData.types as SignerProcedureTypes["signTypedDataV4"]["types"],
              message:
                parsedTypedData.message as SignerProcedureTypes["signTypedDataV4"]["message"],
              chainId,
              partnerId,
              rpcEndpoint: `https://${chainId}.rpc.thirdweb.com`, // TODO (ew) shouldnt be needed
            },
            // Can hide the iframe if the partner has full control (no user approvals)
            showIframe: permissions?.permissions.includes("FULL_CONTROL_V1")
              ? false
              : isEcosystem,
          });
        return signedTypedData as Hex;
      },
    };
  }
}
