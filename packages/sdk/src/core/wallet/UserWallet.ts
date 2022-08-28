import { RPCConnectionHandler } from "../classes/rpc-connection-handler";
import { NetworkOrSignerOrProvider, TransactionResult } from "../types";
import { SDKOptions } from "../../schema";
import invariant from "tiny-invariant";
import { Amount, CurrencyValue } from "../../types";
import {
  fetchCurrencyValue,
  isNativeToken,
  normalizePriceValue,
} from "../../common/currency";
import { NATIVE_TOKEN_ADDRESS } from "../../constants";
import ERC20Abi from "@thirdweb-dev/contracts-js/abis/IERC20.json";
import { ContractWrapper } from "../classes/contract-wrapper";
import { IERC20 } from "@thirdweb-dev/contracts-js";
import { ethers, BigNumber, providers } from "ethers";

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

  constructor(network: NetworkOrSignerOrProvider, options: SDKOptions) {
    this.connection = new RPCConnectionHandler(network, options);
    this.options = options;
  }

  // TODO connect()
  // TODO disconnect()
  // TODO switchChain()
  // TODO event listener
  // TODO tokens()
  // TODO NFTs()

  // TODO this will become the source of truth of the signer and have every contract read from it
  onNetworkUpdated(network: NetworkOrSignerOrProvider): void {
    this.connection.updateSignerOrProvider(network);
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
    to: string,
    amount: Amount,
    currencyAddress = NATIVE_TOKEN_ADDRESS,
  ): Promise<TransactionResult> {
    const signer = this.requireWallet();
    const amountInWei = await normalizePriceValue(
      this.connection.getProvider(),
      amount,
      currencyAddress,
    );
    if (isNativeToken(currencyAddress)) {
      // native token transfer
      const from = await signer.getAddress();
      const tx = await signer.sendTransaction({
        from,
        to,
        value: amountInWei,
      });
      return {
        receipt: await tx.wait(),
      };
    } else {
      // ERC20 token transfer
      return {
        receipt: await this.createErc20(currencyAddress).sendTransaction(
          "transfer",
          [to, amountInWei],
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
    currencyAddress = NATIVE_TOKEN_ADDRESS,
  ): Promise<CurrencyValue> {
    this.requireWallet();
    const provider = this.connection.getProvider();
    let balance: BigNumber;
    if (isNativeToken(currencyAddress)) {
      balance = await provider.getBalance(await this.getAddress());
    } else {
      balance = await this.createErc20(currencyAddress).readContract.balanceOf(
        await this.getAddress(),
      );
    }
    return await fetchCurrencyValue(provider, currencyAddress, balance);
  }

  /**
   * Get the currently connected address
   * @example
   * ```javascript
   * const address = await sdk.wallet.getAddress();
   * ```
   */
  async getAddress(): Promise<string> {
    return await this.requireWallet().getAddress();
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
  async sign(message: string): Promise<string> {
    const signer = this.requireWallet();
    return await signer.signMessage(message);
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
  public recoverAddress(message: string, signature: string): string {
    const messageHash = ethers.utils.hashMessage(message);
    const messageHashBytes = ethers.utils.arrayify(messageHash);
    return ethers.utils.recoverAddress(messageHashBytes, signature);
  }

  /**
   * Send a raw transaction to the blockchain from the connected wallet
   * @param transactionRequest - raw transaction data to send to the blockchain
   */
  async sendRawTransaction(
    transactionRequest: providers.TransactionRequest,
  ): Promise<TransactionResult> {
    const signer = this.requireWallet();
    const tx = await signer.sendTransaction(transactionRequest);
    return {
      receipt: await tx.wait(),
    };
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

  private createErc20(currencyAddress: string) {
    return new ContractWrapper<IERC20>(
      this.connection.getSignerOrProvider(),
      currencyAddress,
      ERC20Abi,
      this.options,
    );
  }
}
