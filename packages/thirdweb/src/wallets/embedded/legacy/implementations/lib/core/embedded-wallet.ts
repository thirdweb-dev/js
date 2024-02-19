import type {
  ClientIdWithQuerierAndChainType,
  GetUser,
  GetUserWalletStatusRpcReturnType,
  SetUpWalletRpcReturnType,
  WalletAddressObjectType,
} from "../../interfaces/embedded-wallets/embedded-wallets.js";
import { UserWalletStatus } from "../../interfaces/embedded-wallets/embedded-wallets.js";

import { LocalStorage } from "../../utils/Storage/LocalStorage.js";
import type { EmbeddedWalletIframeCommunicator } from "../../utils/iFrameCommunication/EmbeddedWalletIframeCommunicator.js";
import type { Chain } from "../../../../../../chains/types.js";
import type { Account } from "../../../../../index.js";
import type {
  GetAddressReturnType,
  SignMessageReturnType,
  SignTransactionReturnType,
  SignedTypedDataReturnType,
} from "../../interfaces/embedded-wallets/signer.js";
import { getRpcClient } from "../../../../../../rpc/rpc.js";
import { defineChain } from "../../../../../../chains/utils.js";
import type { SendTransactionOption } from "../../../../../interfaces/wallet.js";
import type { Hex, TransactionSerializable, TypedDataDefinition } from "viem";
import type { ThirdwebClient } from "../../../../../../index.js";
import { eth_sendRawTransaction } from "../../../../../../rpc/actions/eth_sendRawTransaction.js";

export type WalletManagementTypes = {
  createWallet: void;
  setUpNewDevice: void;
  getUserStatus: void;
};
export type WalletManagementUiTypes = {
  createWalletUi: void;
  setUpNewDeviceUi: void;
};

export type EmbeddedWalletInternalHelperType = { showUi: boolean };

export type SignerProcedureTypes = {
  getAddress: void;
  signMessage: {
    message: string | Hex;
    chainId: number;
    rpcEndpoint?: string;
  };
  signTransaction: {
    transaction: TransactionSerializable;
    chainId: number;
    rpcEndpoint?: string;
  };
  signTypedDataV4: {
    domain: TypedDataDefinition["domain"];
    types: TypedDataDefinition["types"];
    message: TypedDataDefinition["message"];
    chainId: number;
    rpcEndpoint?: string;
  };
  //connect: { provider: Provider };
};

type PostWalletSetup = SetUpWalletRpcReturnType & {
  walletUserId: string;
};

/**
 *
 */
export class EmbeddedWallet {
  protected client: ThirdwebClient;
  protected chain: Chain;
  protected walletManagerQuerier: EmbeddedWalletIframeCommunicator<
    WalletManagementTypes & WalletManagementUiTypes
  >;
  protected localStorage: LocalStorage;

  /**
   * Not meant to be initialized directly. Call {@link initializeUser} to get an instance
   * @internal
   */
  constructor({ client, chain, querier }: ClientIdWithQuerierAndChainType) {
    this.client = client;
    this.chain = chain;
    this.walletManagerQuerier = querier;

    this.localStorage = new LocalStorage({ clientId: client.clientId });
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
        wallet: this,
      };
    } else if (userStatus.status === UserWalletStatus.LOGGED_IN_NEW_DEVICE) {
      return {
        status: UserWalletStatus.LOGGED_IN_WALLET_UNINITIALIZED,
        ...userStatus.user,
      };
    } else if (
      userStatus.status === UserWalletStatus.LOGGED_IN_WALLET_UNINITIALIZED
    ) {
      return {
        status: UserWalletStatus.LOGGED_IN_WALLET_UNINITIALIZED,
        ...userStatus.user,
      };
    } else {
      // Logged out
      return { status: userStatus.status };
    }
  }

  /**
   * Switches the chain that the user wallet is currently on.
   * @example
   * @param param0.chain
   * ```typescript
   * // user wallet will be set to Polygon
   * const Paper = new ThirdwebEmbeddedWalletSdk({clientId: "", chain: "Polygon"});
   * const user = await Paper.initializeUser();
   * // Switch the user wallet to Mumbai
   * await user.wallet.setChain({ chain: "Mumbai" });
   * ```
   * @param param0 - The chain that we are changing the user wallet too
   * @internal
   */
  async setChain({ chain }: { chain: Chain }): Promise<void> {
    this.chain = chain;
  }

  /**
   * Returns an Ethers.Js compatible signer that you can use in conjunction with the rest of dApp
   * @param network.rpcEndpoint
   * @example
   * ```typescript
   * const Paper = new ThirdwebEmbeddedWalletSdk({clientId: "", chain: "Polygon"});
   * const user = await Paper.getUser();
   * if (user.status === UserStatus.LOGGED_IN_WALLET_INITIALIZED) {
   *    // returns a signer on the Polygon mainnet
   *    const signer = await user.getEthersJsSigner();
   *    // returns a signer on the specified RPC endpoints
   *    const signer = await user.getEthersJsSigner({rpcEndpoint: "https://eth-rpc.gateway.pokt.network"});
   * }
   * ```
   * @param network - object with the rpc url where calls will be routed through
   * @throws If attempting to call the function without the user wallet initialize on their current device. This should never happen if call {@link ThirdwebEmbeddedWalletSdk.initializeUser} before accessing this function
   * @returns A signer that is compatible with Ether.js. Defaults to the public rpc on the chain specified when initializing the {@link ThirdwebEmbeddedWalletSdk} instance
   * @internal
   *
   */
  async getAccount(): Promise<Account> {
    const querier = this
      .walletManagerQuerier as unknown as EmbeddedWalletIframeCommunicator<SignerProcedureTypes>;
    const { address } = await querier.call<GetAddressReturnType>({
      procedureName: "getAddress",
      params: undefined,
    });
    const signTransaction = async (tx: SendTransactionOption) => {
      const { signedTransaction } =
        await querier.call<SignTransactionReturnType>({
          procedureName: "signTransaction",
          params: {
            transaction: tx,
            chainId: tx.chainId,
          },
        });
      return signedTransaction as Hex;
    };
    const client = this.client;
    return {
      address,
      async sendTransaction(tx) {
        const rpcRequest = getRpcClient({
          client,
          chain: defineChain(tx.chainId),
        });
        const signedTx = await signTransaction(tx);
        const transactionHash = await eth_sendRawTransaction(
          rpcRequest,
          signedTx,
        );
        return {
          transactionHash,
        };
      },
      async signMessage({ message }) {
        const { signedMessage } = await querier.call<SignMessageReturnType>({
          procedureName: "signMessage",
          params: {
            message:
              typeof message === "string" ? message : message.raw.toString(),
            chainId: 1, // TODO check if we need this
          },
        });
        return signedMessage as Hex;
      },
      async signTypedData(_typedData) {
        const { signedTypedData } =
          await querier.call<SignedTypedDataReturnType>({
            procedureName: "signTypedDataV4",
            params: {
              domain: _typedData.domain,
              types:
                _typedData.types as SignerProcedureTypes["signTypedDataV4"]["types"],
              message:
                _typedData.message as SignerProcedureTypes["signTypedDataV4"]["message"],
              chainId: 1, // TODO check if we need this
            },
          });
        return signedTypedData as Hex;
      },
    };
  }
}
