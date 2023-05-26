import { AmountSchema } from "../../../core/schema/shared";
import { assertEnabled } from "../../common/feature-detection/assertEnabled";
import { detectContractFeature } from "../../common/feature-detection/detectContractFeature";
import {
  fetchCurrencyMetadata,
  fetchCurrencyValue,
} from "../../common/currency";
import { resolveAddress } from "../../common/ens";
import { buildTransactionFunction } from "../../common/transactions";
import {
  FEATURE_TOKEN,
  FEATURE_TOKEN_MINTABLE,
  FEATURE_TOKEN_BATCH_MINTABLE,
  FEATURE_TOKEN_BURNABLE,
  FEATURE_TOKEN_SIGNATURE_MINTABLE,
  FEATURE_TOKEN_CLAIM_CONDITIONS_V2,
} from "../../constants/erc20-features";
import { Address, AddressOrEns } from "../../schema/shared";
import { TokenMintInput } from "../../schema/tokens/token";
import { Currency, CurrencyValue, Amount, ClaimOptions } from "../../types";
import {
  BaseERC20,
  BaseSignatureMintERC20,
  BaseDropERC20,
} from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { UpdateableNetwork } from "../interfaces/contract";
import type { NetworkInput } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { Erc20Burnable } from "./erc-20-burnable";
import { Erc20Droppable } from "./erc-20-droppable";
import { Erc20Mintable } from "./erc-20-mintable";
import { Erc20SignatureMintable } from "./erc-20-signature-mintable";
import { Transaction } from "./transactions";
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

  private _chainId: number;
  get chainId() {
    return this._chainId;
  }

  constructor(
    contractWrapper: ContractWrapper<T>,
    storage: ThirdwebStorage,
    chainId: number,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.mintable = this.detectErc20Mintable();
    this.burnable = this.detectErc20Burnable();
    this.droppable = this.detectErc20Droppable();
    this.signatureMintable = this.detectErc20SignatureMintable();
    this._chainId = chainId;
  }

  /**
   * @internal
   */
  onNetworkUpdated(network: NetworkInput): void {
    this.contractWrapper.updateSignerOrProvider(network);
  }

  /**
   * @internal
   */
  getAddress(): Address {
    return this.contractWrapper.readContract.address;
  }

  ////// Standard ERC20 Extension //////

  /**
   * Get the token metadata
   * @remarks name, symbol, etc...
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
   * Get token balance for the currently connected wallet
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
   * Get token balance for a specific wallet
   *
   * @remarks Get a wallets token balance.
   *
   * @example
   * ```javascript
   * const walletAddress = "{{wallet_address}}";
   * const balance = await contract.erc20.balanceOf(walletAddress);
   * ```
   *
   * @returns The balance of a specific wallet.
   * @twfeature ERC20
   */
  public async balanceOf(address: AddressOrEns): Promise<CurrencyValue> {
    return this.getValue(
      await this.contractWrapper.readContract.balanceOf(
        await resolveAddress(address),
      ),
    );
  }

  /**
   * Get the total supply for this token
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
   * Get token allowance
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
  public async allowance(spender: AddressOrEns): Promise<CurrencyValue> {
    return await this.allowanceOf(
      await this.contractWrapper.getSignerAddress(),
      await resolveAddress(spender),
    );
  }

  /**
   * Get token allowance of a specific wallet
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
    owner: AddressOrEns,
    spender: AddressOrEns,
  ): Promise<CurrencyValue> {
    return await this.getValue(
      await this.contractWrapper.readContract.allowance(
        await resolveAddress(owner),
        await resolveAddress(spender),
      ),
    );
  }

  /**
   * Transfer tokens
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
  transfer = buildTransactionFunction(
    async (to: AddressOrEns, amount: Amount) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "transfer",
        args: [await resolveAddress(to), await this.normalizeAmount(amount)],
      });
    },
  );

  /**
   * Transfer tokens from a specific address
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
  transferFrom = buildTransactionFunction(
    async (from: AddressOrEns, to: AddressOrEns, amount: Amount) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "transferFrom",
        args: [
          await resolveAddress(from),
          await resolveAddress(to),
          await this.normalizeAmount(amount),
        ],
      });
    },
  );

  /**
   * Set token allowance
   * @remarks Allows the specified `spender` wallet to transfer the given `amount` of tokens to another wallet
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
  setAllowance = buildTransactionFunction(
    async (spender: AddressOrEns, amount: Amount) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "approve",
        args: [
          await resolveAddress(spender),
          await this.normalizeAmount(amount),
        ],
      });
    },
  );

  /**
   * Transfer tokens to many wallets
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
  transferBatch = buildTransactionFunction(async (args: TokenMintInput[]) => {
    const encoded = await Promise.all(
      args.map(async (arg) => {
        const amountWithDecimals = await this.normalizeAmount(arg.amount);
        return this.contractWrapper.readContract.interface.encodeFunctionData(
          "transfer",
          [await resolveAddress(arg.toAddress), amountWithDecimals],
        );
      }),
    );
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "multicall",
      args: [encoded],
    });
  });

  ////// ERC20 Mintable Extension //////

  /**
   * Mint tokens
   *
   * @remarks Mint tokens to the connected wallet.
   *
   * @example
   * ```javascript
   * const amount = "1.5"; // The amount of this token you want to mint
   * await contract.erc20.mint(amount);
   * ```
   * @twfeature ERC20Mintable
   */
  mint = buildTransactionFunction(async (amount: Amount) => {
    return this.mintTo.prepare(
      await this.contractWrapper.getSignerAddress(),
      amount,
    );
  });

  /**
   * Mint tokens to a specific wallet
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
  mintTo = buildTransactionFunction(
    async (receiver: AddressOrEns, amount: Amount) => {
      return assertEnabled(this.mintable, FEATURE_TOKEN_MINTABLE).to.prepare(
        receiver,
        amount,
      );
    },
  );

  /**
   * Construct a mint transaction without executing it
   * @remarks This is useful for estimating the gas cost of a mint transaction, overriding transaction options and having fine grained control over the transaction execution.
   * @param receiver - Address you want to send the token to
   * @param amount - The amount of tokens you want to mint
   *
   * @deprecated Use `contract.erc20.mint.prepare(...args)` instead
   * @twfeature ERC20Mintable
   */
  public async getMintTransaction(
    receiver: AddressOrEns,
    amount: Amount,
  ): Promise<Transaction> {
    return assertEnabled(
      this.mintable,
      FEATURE_TOKEN_MINTABLE,
    ).getMintTransaction(receiver, amount);
  }

  ////// ERC20 BatchMintable Extension //////

  /**
   * Mint tokens to many wallets
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
  mintBatchTo = buildTransactionFunction(async (args: TokenMintInput[]) => {
    return assertEnabled(
      this.mintable?.batch,
      FEATURE_TOKEN_BATCH_MINTABLE,
    ).to.prepare(args);
  });

  ////// ERC20 Burnable Extension //////

  /**
   * Burn tokens
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
  burn = buildTransactionFunction(async (amount: Amount) => {
    return assertEnabled(this.burnable, FEATURE_TOKEN_BURNABLE).tokens.prepare(
      amount,
    );
  });

  /**
   * Burn tokens from a specific wallet
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
  burnFrom = buildTransactionFunction(
    async (holder: AddressOrEns, amount: Amount) => {
      return assertEnabled(this.burnable, FEATURE_TOKEN_BURNABLE).from.prepare(
        holder,
        amount,
      );
    },
  );

  ////// ERC20 Claimable Extension //////

  /**
   * Claim tokens
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
   * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1
   */
  claim = buildTransactionFunction(
    async (amount: Amount, options?: ClaimOptions) => {
      return this.claimTo.prepare(
        await this.contractWrapper.getSignerAddress(),
        amount,
        options,
      );
    },
  );

  /**
   * Claim tokens to a specific wallet
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
   * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1
   */
  claimTo = buildTransactionFunction(
    async (
      destinationAddress: AddressOrEns,
      amount: Amount,
      options?: ClaimOptions,
    ) => {
      return assertEnabled(
        this.droppable?.claim,
        FEATURE_TOKEN_CLAIM_CONDITIONS_V2,
      ).to.prepare(destinationAddress, amount, options);
    },
  );

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
   *     maxClaimableSupply: 2, // limit how many mints for this presale
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
   * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1
   */
  get claimConditions() {
    return assertEnabled(
      this.droppable?.claim,
      FEATURE_TOKEN_CLAIM_CONDITIONS_V2,
    ).conditions;
  }

  ////// ERC20 SignatureMint Extension //////

  /**
   * Mint with signature
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
        "ERC20ClaimConditionsV1",
      ) ||
      detectContractFeature<BaseDropERC20>(
        this.contractWrapper,
        "ERC20ClaimConditionsV2",
      ) ||
      detectContractFeature<BaseDropERC20>(
        this.contractWrapper,
        "ERC20ClaimPhasesV1",
      ) ||
      detectContractFeature<BaseDropERC20>(
        this.contractWrapper,
        "ERC20ClaimPhasesV2",
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
