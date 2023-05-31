import { resolveAddress } from "../../common/ens/resolveAddress";
import { EIP712Domain, signTypedDataInternal } from "../../common/sign";
import { LOCAL_NODE_PKEY } from "../../constants/addresses/LOCAL_NODE_PKEY";
import { ChainId } from "../../constants/chains/ChainId";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/currency";
import { getChainProvider } from "../../constants/urls";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { Address } from "../../schema/shared/Address";
import { SDKOptions } from "../../schema/sdk-options";
import { Amount, CurrencyValue } from "../../types";
import { ContractWrapper } from "../classes/contract-wrapper";
import { RPCConnectionHandler } from "../classes/rpc-connection-handler";
import { NetworkInput, TransactionResult } from "../types";
import type { IERC20 } from "@thirdweb-dev/contracts-js";
import ERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC20.json";
import { BigNumber, ethers, providers, Signer, TypedDataField } from "ethers";
import EventEmitter from "eventemitter3";
import invariant from "tiny-invariant";
import { fetchCurrencyValue } from "../../common/currency/fetchCurrencyValue";
import { isNativeToken } from "../../common/currency/isNativeToken";
import { normalizePriceValue } from "../../common/currency/normalizePriceValue";

/**
 *
 * {@link UserWallet} events that you can subscribe to using `sdk.wallet.events`.
 *
 * @public
 */
export interface UserWalletEvents {
  /**
   * Emitted when `sdk.wallet.connect()` is called.
   */
  signerChanged: [Signer | undefined];
}

/**
 * Connect and Interact with a user wallet
 * @example
 * ```javascript
 * const balance = await sdk.wallet.balance();
 * ```
 * @public
 */
export class UserWallet {
  private connection: RPCConnectionHandler;
  private options: SDKOptions;
  public events = new EventEmitter<UserWalletEvents>();

  constructor(network: NetworkInput, options: SDKOptions) {
    this.connection = new RPCConnectionHandler(network, options);
    this.options = options;
    this.events = new EventEmitter();
  }

  // TODO disconnect()
  // TODO switchChain()
  // TODO tokens()
  // TODO NFTs()

  // TODO this will become the source of truth of the signer and have every contract read from it
  // TODO separate signer and provider logics
  public connect(network: NetworkInput) {
    this.connection.updateSignerOrProvider(network);
    this.events.emit("signerChanged", this.connection.getSigner());
  }

  /**
   * Transfer native or ERC20 tokens from this wallet to another wallet
   * @example
   * ```javascript
   *  // transfer 0.8 ETH
   * await sdk.wallet.transfer("0x...", 0.8);
   *  // transfer 0.8 tokens of `tokenContractAddress`
   * await sdk.wallet.transfer("0x...", 0.8, tokenContractAddress);
   * ```
   * @param to - the account to send funds to
   * @param amount - the amount in tokens
   * @param currencyAddress - Optional - ERC20 contract address of the token to transfer
   */
  async transfer(
    to: AddressOrEns,
    amount: Amount,
    currencyAddress: AddressOrEns = NATIVE_TOKEN_ADDRESS,
  ): Promise<TransactionResult> {
    const resolvedTo = await resolveAddress(to);
    const resolvedCurrency = await resolveAddress(currencyAddress);

    const signer = this.requireWallet();
    const amountInWei = await normalizePriceValue(
      this.connection.getProvider(),
      amount,
      currencyAddress,
    );
    if (isNativeToken(resolvedCurrency)) {
      // native token transfer
      const from = await signer.getAddress();
      const tx = await signer.sendTransaction({
        from,
        to: resolvedTo,
        value: amountInWei,
      });
      return {
        receipt: await tx.wait(),
      };
    } else {
      // ERC20 token transfer
      return {
        receipt: await this.createErc20(resolvedCurrency).sendTransaction(
          "transfer",
          [resolvedTo, amountInWei],
        ),
      };
    }
  }

  /**
   * Fetch the native or ERC20 token balance of this wallet
   * @example
   * ```javascript
   * // native currency balance
   * const balance = await sdk.wallet.balance();
   * // ERC20 token balance
   * const erc20balance = await sdk.wallet.balance(tokenContractAddress);
   *
   * ```
   */
  async balance(
    currencyAddress: AddressOrEns = NATIVE_TOKEN_ADDRESS,
  ): Promise<CurrencyValue> {
    this.requireWallet();

    const resolvedCurrency = await resolveAddress(currencyAddress);
    const provider = this.connection.getProvider();
    let balance: BigNumber;
    if (isNativeToken(resolvedCurrency)) {
      balance = await provider.getBalance(await this.getAddress());
    } else {
      balance = await this.createErc20(resolvedCurrency).readContract.balanceOf(
        await this.getAddress(),
      );
    }
    return await fetchCurrencyValue(provider, resolvedCurrency, balance);
  }

  /**
   * Get the currently connected address
   * @example
   * ```javascript
   * const address = await sdk.wallet.getAddress();
   * ```
   */
  public async getAddress(): Promise<Address> {
    return (await this.requireWallet().getAddress()) as Address;
  }

  /**
   * Get the currently connected wallet's chainId
   * @internal
   */
  public async getChainId(): Promise<number> {
    return await this.requireWallet().getChainId();
  }

  /**
   * Checks whether there's a signer connected with the SDK
   * @internal
   */
  public isConnected(): boolean {
    try {
      this.requireWallet();
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Sign any message with the connected wallet private key
   * @param message - the message to sign
   * @returns the signed message
   *
   * @example
   * ```javascript
   * // This is the message to be signed
   * const message = "Sign this message...";
   *
   * // Now we can sign the message with the connected wallet
   * const signature = await sdk.wallet.sign(message);
   * ```
   */
  public async sign(message: string): Promise<string> {
    const signer = this.requireWallet();
    return await signer.signMessage(message);
  }

  /**
   * Sign a typed data structure (EIP712) with the connected wallet private key
   * @param domain - the domain as EIP712 standard
   * @param types - the structure and data types as defined by the EIP712 standard
   * @param message - the data to sign
   * @returns the payload and its associated signature
   *
   * @example
   * ```javascript
   * // This is the message to be signed
   * // Now we can sign the message with the connected wallet
   * const { payload, signature } = await sdk.wallet.signTypedData(
   *   {
          name: "MyEIP721Domain",
          version: "1",
          chainId: 1,
          verifyingContract: "0x...",
        },
        { MyStruct: [ { name: "to", type: "address" }, { name: "quantity", type: "uint256" } ] },
        { to: "0x...", quantity: 1 },
   * );
   * ```
   */
  public async signTypedData(
    domain: EIP712Domain,
    types: Record<string, Array<TypedDataField>>,
    message: Record<string, any>,
  ): Promise<{ payload: any; signature: string }> {
    return await signTypedDataInternal(
      this.requireWallet(),
      domain,
      types,
      message,
    );
  }

  /**
   * Recover the signing address from a signed message
   * @param message - the original message that was signed
   * @param signature - the signature to recover the address from
   * @returns the address that signed the message
   *
   * @example
   * ```javascript
   * const message = "Sign this message...";
   * const signature = await sdk.wallet.sign(message);
   *
   * // Now we can recover the signing address
   * const address = sdk.wallet.recoverAddress(message, signature);
   * ```
   */
  public recoverAddress(message: string, signature: string): Address {
    const messageHash = ethers.utils.hashMessage(message);
    const messageHashBytes = ethers.utils.arrayify(messageHash);
    return ethers.utils.recoverAddress(messageHashBytes, signature);
  }

  /**
   * Send a raw transaction to the blockchain from the connected wallet
   * @param transactionRequest - raw transaction data to send to the blockchain
   */
  public async sendRawTransaction(
    transactionRequest: providers.TransactionRequest,
  ): Promise<TransactionResult> {
    const signer = this.requireWallet();
    const tx = await signer.sendTransaction(transactionRequest);
    return {
      receipt: await tx.wait(),
    };
  }

  /**
   * Request funds from a running local node to the currently connected wallet
   * @param amount the amount in native currency (in ETH) to request
   */
  public async requestFunds(amount: Amount): Promise<TransactionResult> {
    const chainId = await this.getChainId();
    if (chainId === ChainId.Localhost || chainId === ChainId.Hardhat) {
      const localWallet = new UserWallet(
        new ethers.Wallet(
          LOCAL_NODE_PKEY,
          getChainProvider(chainId, this.options),
        ),
        this.options,
      );
      return localWallet.transfer(await this.getAddress(), amount);
    } else {
      throw new Error(
        `Requesting funds is not supported on chain: '${chainId}'.`,
      );
    }
  }

  /** ***********************
   * PRIVATE FUNCTIONS
   * ***********************/

  private requireWallet() {
    const signer = this.connection.getSigner();
    invariant(
      signer,
      "This action requires a connected wallet. Please pass a valid signer to the SDK.",
    );
    return signer;
  }

  private createErc20(currencyAddress: Address) {
    return new ContractWrapper<IERC20>(
      this.connection.getSignerOrProvider(),
      currencyAddress,
      ERC20Abi,
      this.options,
    );
  }
}
