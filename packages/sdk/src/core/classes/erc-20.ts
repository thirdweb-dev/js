import { NetworkOrSignerOrProvider, TransactionResult } from "..";
import { assertEnabled, detectContractFeature } from "../../common";
import {
  fetchCurrencyMetadata,
  fetchCurrencyValue,
} from "../../common/currency";
import {
  FEATURE_TOKEN,
  FEATURE_TOKEN_MINTABLE,
  FEATURE_TOKEN_BATCH_MINTABLE,
  FEATURE_TOKEN_BURNABLE,
  FEATURE_TOKEN_SIGNATURE_MINTABLE,
  FEATURE_TOKEN_CLAIMABLE_WITH_CONDITIONS,
} from "../../constants/erc20-features";
import { TokenMintInput, AmountSchema } from "../../schema";
import {
  Currency,
  CurrencyValue,
  Amount,
  ClaimVerification,
} from "../../types";
import {
  BaseERC20,
  BaseSignatureMintERC20,
  BaseDropERC20,
} from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { UpdateableNetwork } from "../interfaces/contract";
import { ContractWrapper } from "./contract-wrapper";
import { Erc20Burnable } from "./erc-20-burnable";
import { Erc20Droppable } from "./erc-20-droppable";
import { Erc20Mintable } from "./erc-20-mintable";
import { Erc20SignatureMintable } from "./erc-20-signature-mintable";
import type {
  TokenERC20,
  DropERC20,
  IMintableERC20,
  IBurnableERC20,
} from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers, BigNumber, BigNumberish } from "ethers";

/**
 * Standard ERC20 Token functions
 * @remarks Basic functionality for a ERC20 contract that handles all unit transformation for you.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.erc20.transfer(walletAddress, amount);
 * ```
 * @public
 */
export class Erc20<
  T extends TokenERC20 | DropERC20 | BaseERC20 =
    | BaseERC20
    | BaseSignatureMintERC20,
> implements UpdateableNetwork, DetectableFeature
{
  featureName = FEATURE_TOKEN.name;
  /**
   * Mint tokens
   */
  private mintable: Erc20Mintable | undefined;
  private burnable: Erc20Burnable | undefined;
  private droppable: Erc20Droppable | undefined;
  private signatureMintable: Erc20SignatureMintable | undefined;
  protected contractWrapper: ContractWrapper<T>;
  protected storage: ThirdwebStorage;

  constructor(contractWrapper: ContractWrapper<T>, storage: ThirdwebStorage) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.mintable = this.detectErc20Mintable();
    this.burnable = this.detectErc20Burnable();
    this.droppable = this.detectErc20Droppable();
    this.signatureMintable = this.detectErc20SignatureMintable();
  }

  /**
   * @internal
   */
  onNetworkUpdated(network: NetworkOrSignerOrProvider): void {
    this.contractWrapper.updateSignerOrProvider(network);
  }

  /**
   * @internal
   */
  getAddress(): string {
    return this.contractWrapper.readContract.address;
  }

  ////// Standard ERC20 Extension //////

  /**
   * Get the token Metadata (name, symbol, etc...)
   *
   * @example
   * ```javascript
   * const token = await contract.erc20.get();
   * ```
   * @returns The token metadata
   * @twfeature ERC20
   */
  public async get(): Promise<Currency> {
    return await fetchCurrencyMetadata(
      this.contractWrapper.getProvider(),
      this.getAddress(),
    );
  }

  /**
   * Get Token Balance for the currently connected wallet
   *
   * @remarks Get a wallets token balance.
   *
   * @example
   * ```javascript
   * const balance = await contract.erc20.balance();
   * ```
   *
   * @returns The balance of a specific wallet.
   * @twfeature ERC20
   */
  public async balance(): Promise<CurrencyValue> {
    return await this.balanceOf(await this.contractWrapper.getSignerAddress());
  }

  /**
   * Get Token Balance
   *
   * @remarks Get a wallets token balance.
   *
   * @example
   * ```javascript
   * // Address of the wallet to check token balance
   * const walletAddress = "{{wallet_address}}";
   * const balance = await contract.erc20.balanceOf(walletAddress);
   * ```
   *
   * @returns The balance of a specific wallet.
   * @twfeature ERC20
   */
  public async balanceOf(address: string): Promise<CurrencyValue> {
    return this.getValue(
      await this.contractWrapper.readContract.balanceOf(address),
    );
  }

  /**
   * The total supply for this Token
   * @remarks Get how much supply has been minted
   * @example
   * ```javascript
   * const balance = await contract.erc20.totalSupply();
   * ```
   * @twfeature ERC20
   */
  public async totalSupply(): Promise<CurrencyValue> {
    return await this.getValue(
      await this.contractWrapper.readContract.totalSupply(),
    );
  }

  /**
   * Get Token Allowance
   *
   * @remarks Get the allowance of a 'spender' wallet over the connected wallet's funds - the allowance of a different address for a token is the amount of tokens that the `spender` wallet is allowed to spend on behalf of the connected wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet to check token allowance
   * const spenderAddress = "0x...";
   * const allowance = await contract.erc20.allowance(spenderAddress);
   * ```
   *
   * @returns The allowance of one wallet over anothers funds.
   * @twfeature ERC20
   */
  public async allowance(spender: string): Promise<CurrencyValue> {
    return await this.allowanceOf(
      await this.contractWrapper.getSignerAddress(),
      spender,
    );
  }

  /**
   * Get Token Allowance
   *
   * @remarks Get the allowance of one wallet over another wallet's funds - the allowance of a different address for a token is the amount of tokens that the wallet is allowed to spend on behalf of the specified wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet who owns the funds
   * const owner = "{{wallet_address}}";
   * // Address of the wallet to check token allowance
   * const spender = "0x...";
   * const allowance = await contract.erc20.allowanceOf(owner, spender);
   * ```
   *
   * @returns The allowance of one wallet over anothers funds.
   * @twfeature ERC20
   */
  public async allowanceOf(
    owner: string,
    spender: string,
  ): Promise<CurrencyValue> {
    return await this.getValue(
      await this.contractWrapper.readContract.allowance(owner, spender),
    );
  }

  /**
   * Transfer Tokens
   *
   * @remarks Transfer tokens from the connected wallet to another wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet you want to send the tokens to
   * const toAddress = "0x...";
   * // The amount of tokens you want to send
   * const amount = 0.1;
   * await contract.erc20.transfer(toAddress, amount);
   * ```
   * @twfeature ERC20
   */
  public async transfer(
    to: string,
    amount: Amount,
  ): Promise<TransactionResult> {
    return {
      receipt: await this.contractWrapper.sendTransaction("transfer", [
        to,
        await this.normalizeAmount(amount),
      ]),
    };
  }

  /**
   * Transfer Tokens From Address
   *
   * @remarks Transfer tokens from one wallet to another
   *
   * @example
   * ```javascript
   * // Address of the wallet sending the tokens
   * const fromAddress = "{{wallet_address}}";
   * // Address of the wallet you want to send the tokens to
   * const toAddress = "0x...";
   * // The number of tokens you want to send
   * const amount = 1.2
   * // Note that the connected wallet must have approval to transfer the tokens of the fromAddress
   * await contract.erc20.transferFrom(fromAddress, toAddress, amount);
   * ```
   * @twfeature ERC20
   */
  public async transferFrom(
    from: string,
    to: string,
    amount: Amount,
  ): Promise<TransactionResult> {
    return {
      receipt: await this.contractWrapper.sendTransaction("transferFrom", [
        from,
        to,
        await this.normalizeAmount(amount),
      ]),
    };
  }

  /**
   * Allows the specified `spender` wallet to transfer the given `amount` of tokens to another wallet
   *
   * @example
   * ```javascript
   * // Address of the wallet to allow transfers from
   * const spenderAddress = "0x...";
   * // The number of tokens to give as allowance
   * const amount = 100
   * await contract.erc20.setAllowance(spenderAddress, amount);
   * ```
   * @twfeature ERC20
   */
  public async setAllowance(
    spender: string,
    amount: Amount,
  ): Promise<TransactionResult> {
    return {
      receipt: await this.contractWrapper.sendTransaction("approve", [
        spender,
        await this.normalizeAmount(amount),
      ]),
    };
  }

  /**
   * Transfer Tokens To Many Wallets
   *
   * @remarks Mint tokens from the connected wallet to many wallets
   *
   * @example
   * ```javascript
   * // Data of the tokens you want to mint
   * const data = [
   *   {
   *     toAddress: "{{wallet_address}}", // Address to mint tokens to
   *     amount: 100, // How many tokens to mint to specified address
   *   },
   *  {
   *    toAddress: "0x...",
   *    amount: 100,
   *  }
   * ]
   *
   * await contract.erc20.transferBatch(data);
   * ```
   */
  public async transferBatch(args: TokenMintInput[]) {
    const encoded = await Promise.all(
      args.map(async (arg) => {
        const amountWithDecimals = await this.normalizeAmount(arg.amount);
        return this.contractWrapper.readContract.interface.encodeFunctionData(
          "transfer",
          [arg.toAddress, amountWithDecimals],
        );
      }),
    );
    await this.contractWrapper.multiCall(encoded);
  }

  ////// ERC20 Mintable Extension //////

  /**
   * Mint Tokens
   *
   * @remarks Mint tokens to the connected wallet.
   *
   * @example
   * ```javascript
   * const amount = "1.5"; // The amount of this token you want to mint
   * await contract.erc20.mint(toAddress, amount);
   * ```
   * @twfeature ERC20Mintable
   */
  public async mint(amount: Amount): Promise<TransactionResult> {
    return this.mintTo(await this.contractWrapper.getSignerAddress(), amount);
  }

  /**
   * Mint Tokens
   *
   * @remarks Mint tokens to a specified address.
   *
   * @example
   * ```javascript
   * const toAddress = "{{wallet_address}}"; // Address of the wallet you want to mint the tokens to
   * const amount = "1.5"; // The amount of this token you want to mint
   * await contract.erc20.mintTo(toAddress, amount);
   * ```
   * @twfeature ERC20Mintable
   */
  public async mintTo(
    receiver: string,
    amount: Amount,
  ): Promise<TransactionResult> {
    return assertEnabled(this.mintable, FEATURE_TOKEN_MINTABLE).to(
      receiver,
      amount,
    );
  }

  ////// ERC20 BatchMintable Extension //////

  /**
   * Mint Tokens To Many Wallets
   *
   * @remarks Mint tokens to many wallets in one transaction.
   *
   * @example
   * ```javascript
   * // Data of the tokens you want to mint
   * const data = [
   *   {
   *     toAddress: "{{wallet_address}}", // Address to mint tokens to
   *     amount: 0.2, // How many tokens to mint to specified address
   *   },
   *  {
   *    toAddress: "0x...",
   *    amount: 1.4,
   *  }
   * ]
   *
   * await contract.mintBatchTo(data);
   * ```
   * @twfeature ERC20BatchMintable
   */
  public async mintBatchTo(args: TokenMintInput[]): Promise<TransactionResult> {
    return assertEnabled(this.mintable?.batch, FEATURE_TOKEN_BATCH_MINTABLE).to(
      args,
    );
  }

  ////// ERC20 Burnable Extension //////

  /**
   * Burn Tokens
   *
   * @remarks Burn tokens held by the connected wallet
   *
   * @example
   * ```javascript
   * // The amount of this token you want to burn
   * const amount = 1.2;
   *
   * await contract.erc20.burn(amount);
   * ```
   * @twfeature ERC20Burnable
   */
  public async burn(amount: Amount): Promise<TransactionResult> {
    return assertEnabled(this.burnable, FEATURE_TOKEN_BURNABLE).tokens(amount);
  }

  /**
   * Burn Tokens
   *
   * @remarks Burn tokens held by the specified wallet
   *
   * @example
   * ```javascript
   * // Address of the wallet sending the tokens
   * const holderAddress = "{{wallet_address}}";
   *
   * // The amount of this token you want to burn
   * const amount = 1.2;
   *
   * await contract.erc20.burnFrom(holderAddress, amount);
   * ```
   * @twfeature ERC20Burnable
   */
  public async burnFrom(
    holder: string,
    amount: Amount,
  ): Promise<TransactionResult> {
    return assertEnabled(this.burnable, FEATURE_TOKEN_BURNABLE).from(
      holder,
      amount,
    );
  }

  ////// ERC20 Claimable Extension //////

  /**
   * Claim a certain amount of tokens to the connected Wallet
   *
   * @remarks Let the specified wallet claim Tokens.
   *
   * @example
   * ```javascript
   * const address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs
   * const quantity = 42.69; // how many tokens you want to claim
   *
   * const tx = await contract.erc20.claim(address, quantity);
   * const receipt = tx.receipt; // the transaction receipt
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param amount - Quantity of the tokens you want to claim
   * @param checkERC20Allowance - Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer
   * @param claimData
   * @returns - The transaction receipt
   * @twfeature ERC20ClaimableWithConditions
   */
  public async claim(
    amount: Amount,
    checkERC20Allowance = true,
    claimData?: ClaimVerification,
  ): Promise<TransactionResult> {
    return this.claimTo(
      await this.contractWrapper.getSignerAddress(),
      amount,
      checkERC20Allowance,
      claimData,
    );
  }

  /**
   * Claim a certain amount of tokens to a specific Wallet
   *
   * @remarks Let the specified wallet claim Tokens.
   *
   * @example
   * ```javascript
   * const address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs
   * const quantity = 42.69; // how many tokens you want to claim
   *
   * const tx = await contract.erc20.claim(address, quantity);
   * const receipt = tx.receipt; // the transaction receipt
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param amount - Quantity of the tokens you want to claim
   * @param checkERC20Allowance - Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer
   * @param claimData
   * @returns - The transaction receipt
   * @twfeature ERC20ClaimableWithConditions
   */
  public async claimTo(
    destinationAddress: string,
    amount: Amount,
    checkERC20Allowance = true,
    claimData?: ClaimVerification,
  ): Promise<TransactionResult> {
    return assertEnabled(
      this.droppable?.claim,
      FEATURE_TOKEN_CLAIMABLE_WITH_CONDITIONS,
    ).to(destinationAddress, amount, checkERC20Allowance, claimData);
  }

  /**
   * Configure claim conditions
   * @remarks Define who can claim NFTs in the collection, when and how many.
   * @example
   * ```javascript
   * const presaleStartTime = new Date();
   * const publicSaleStartTime = new Date(Date.now() + 60 * 60 * 24 * 1000);
   * const claimConditions = [
   *   {
   *     startTime: presaleStartTime, // start the presale now
   *     maxQuantity: 2, // limit how many mints for this presale
   *     price: 0.01, // presale price
   *     snapshot: ['0x...', '0x...'], // limit minting to only certain addresses
   *   },
   *   {
   *     startTime: publicSaleStartTime, // 24h after presale, start public sale
   *     price: 0.08, // public sale price
   *   }
   * ]);
   * await contract.erc20.claimConditions.set(claimConditions);
   * ```
   * @twfeature ERC20ClaimableWithConditions
   */
  get claimConditions() {
    return assertEnabled(
      this.droppable?.claim,
      FEATURE_TOKEN_CLAIMABLE_WITH_CONDITIONS,
    ).conditions;
  }

  ////// ERC20 SignatureMint Extension //////

  /**
   * Signature Minting
   * @remarks Generate dynamic tokens with your own signature, and let others mint them using that signature.
   * @example
   * ```javascript
   * // see how to craft a payload to sign in the `contract.erc20.signature.generate()` documentation
   * const signedPayload = contract.erc20.signature().generate(payload);
   *
   * // now the payload can be used to mint tokens
   * const tx = contract.erc20.signature.mint(signedPayload);
   * ```
   * @twfeature ERC20SignatureMintable
   */
  get signature() {
    return assertEnabled(
      this.signatureMintable,
      FEATURE_TOKEN_SIGNATURE_MINTABLE,
    );
  }

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  /**
   * returns the wei amount from a token amount
   * @internal
   * @param amount
   */
  public async normalizeAmount(amount: Amount): Promise<BigNumber> {
    const decimals = await this.contractWrapper.readContract.decimals();
    return ethers.utils.parseUnits(AmountSchema.parse(amount), decimals);
  }

  /**
   * @internal
   */
  public async getValue(value: BigNumberish): Promise<CurrencyValue> {
    return await fetchCurrencyValue(
      this.contractWrapper.getProvider(),
      this.getAddress(),
      BigNumber.from(value),
    );
  }

  private detectErc20Mintable(): Erc20Mintable | undefined {
    if (detectContractFeature<IMintableERC20>(this.contractWrapper, "ERC20")) {
      return new Erc20Mintable(this, this.contractWrapper);
    }
    return undefined;
  }

  private detectErc20Burnable(): Erc20Burnable | undefined {
    if (
      detectContractFeature<IBurnableERC20>(
        this.contractWrapper,
        "ERC20Burnable",
      )
    ) {
      return new Erc20Burnable(this, this.contractWrapper);
    }
    return undefined;
  }

  private detectErc20Droppable(): Erc20Droppable | undefined {
    if (
      detectContractFeature<BaseDropERC20>(
        this.contractWrapper,
        "ERC20ClaimableWithConditions",
      )
    ) {
      return new Erc20Droppable(this, this.contractWrapper, this.storage);
    }
    return undefined;
  }

  private detectErc20SignatureMintable(): Erc20SignatureMintable | undefined {
    if (
      detectContractFeature<TokenERC20>(
        this.contractWrapper,
        "ERC20SignatureMintable",
      )
    ) {
      return new Erc20SignatureMintable(this.contractWrapper);
    }
    return undefined;
  }
}
