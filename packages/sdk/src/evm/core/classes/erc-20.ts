import { AmountSchema } from "../../../core/schema/shared";
import { assertEnabled } from "../../common/feature-detection/assertEnabled";
import { detectContractFeature } from "../../common/feature-detection/detectContractFeature";
import { resolveAddress } from "../../common/ens/resolveAddress";
import { buildTransactionFunction } from "../../common/transactions";
import {
  FEATURE_TOKEN,
  FEATURE_TOKEN_MINTABLE,
  FEATURE_TOKEN_BATCH_MINTABLE,
  FEATURE_TOKEN_BURNABLE,
  FEATURE_TOKEN_SIGNATURE_MINTABLE,
  FEATURE_TOKEN_CLAIM_CONDITIONS_V2,
} from "../../constants/erc20-features";
import type { Address } from "../../schema/shared/Address";
import type { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import type { TokenMintInput } from "../../schema/tokens/token";
import type {
  Currency,
  CurrencyValue,
  Amount,
  ClaimOptions,
} from "../../types";
import type {
  BaseERC20,
  BaseSignatureMintERC20,
  BaseDropERC20,
} from "../../types/eips";
import type { DetectableFeature } from "../interfaces/DetectableFeature";
import { UpdateableNetwork } from "../interfaces/contract";
import type { NetworkInput } from "../types";
import type { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";
import type {
  TokenERC20,
  DropERC20,
  IMintableERC20,
  IBurnableERC20,
  IMulticall,
} from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers, BigNumber, BigNumberish } from "ethers";
import { fetchCurrencyMetadata } from "../../common/currency/fetchCurrencyMetadata";
import { fetchCurrencyValue } from "../../common/currency/fetchCurrencyValue";

import { normalizePriceValue } from "../../common/currency/normalizePriceValue";
import { setErc20Allowance } from "../../common/currency/setErc20Allowance";
import type { TokenInitializer } from "../../contracts";
import {
  FilledSignaturePayload20,
  MintRequest20,
  PayloadToSign20,
  PayloadWithUri20,
  Signature20PayloadInput,
  Signature20PayloadOutput,
  SignedPayload20,
} from "../../schema/contracts/common/signature";
import { ContractRoles } from "./contract-roles";
import type { ITokenERC20 } from "@thirdweb-dev/contracts-js";
import invariant from "tiny-invariant";

import { CustomContractSchema } from "../../schema/contracts/custom";
import { ContractMetadata } from "./contract-metadata";
import { DropClaimConditions } from "./drop-claim-conditions";

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

export class Erc20Burnable implements DetectableFeature {
  featureName = FEATURE_TOKEN_BURNABLE.name;

  private erc20: Erc20;
  private contractWrapper: ContractWrapper<IBurnableERC20>;

  constructor(erc20: Erc20, contractWrapper: ContractWrapper<IBurnableERC20>) {
    this.erc20 = erc20;
    this.contractWrapper = contractWrapper;
  }

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
   * await contract.token.burn.tokens(amount);
   * ```
   */
  tokens = buildTransactionFunction(async (amount: Amount) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "burn",
      args: [await this.erc20.normalizeAmount(amount)],
    });
  });

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
   * await contract.token.burn.from(holderAddress, amount);
   * ```
   */
  from = buildTransactionFunction(
    async (holder: AddressOrEns, amount: Amount) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "burnFrom",
        args: [
          await resolveAddress(holder),
          await this.erc20.normalizeAmount(amount),
        ],
      });
    },
  );
}

/**
 * Configure and claim ERC20 tokens
 * @remarks Manage claim phases and claim ERC20 tokens that have been lazily minted.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.token.drop.claim.to("0x...", quantity);
 * ```
 */
export class Erc20Droppable {
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
   * await contract.nft.drop.claim.conditions.set(claimConditions);
   * ```
   */
  public claim: Erc20ClaimableWithConditions;
  private contractWrapper: ContractWrapper<BaseDropERC20>;
  private erc20: Erc20;
  private storage: ThirdwebStorage;

  constructor(
    erc20: Erc20,
    contractWrapper: ContractWrapper<BaseDropERC20>,
    storage: ThirdwebStorage,
  ) {
    this.erc20 = erc20;
    this.contractWrapper = contractWrapper;

    this.storage = storage;
    this.claim = new Erc20ClaimableWithConditions(
      this.erc20,
      this.contractWrapper,
      this.storage,
    );
  }
}

/**
 * Mint ERC20 Tokens
 * @remarks Token minting functionality that handles unit parsing for you.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.nft.mint.to(walletAddress, nftMetadata);
 * ```
 * @public
 */
export class Erc20Mintable implements DetectableFeature {
  featureName = FEATURE_TOKEN_MINTABLE.name;
  private contractWrapper: ContractWrapper<IMintableERC20>;
  private erc20: Erc20;

  /**
   * Batch mint Tokens to many addresses
   */
  public batch: Erc20BatchMintable | undefined;

  constructor(erc20: Erc20, contractWrapper: ContractWrapper<IMintableERC20>) {
    this.erc20 = erc20;
    this.contractWrapper = contractWrapper;
    this.batch = this.detectErc20BatchMintable();
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
   * await contract.token.mint.to(toAddress, amount);
   * ```
   */
  to = buildTransactionFunction(async (to: AddressOrEns, amount: Amount) => {
    return await this.getMintTransaction(to, amount);
  });

  /**
   * @deprecated Use `contract.erc20.mint.prepare(...args)` instead
   */
  public async getMintTransaction(
    to: AddressOrEns,
    amount: Amount,
  ): Promise<Transaction> {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "mintTo",
      args: [
        await resolveAddress(to),
        await this.erc20.normalizeAmount(amount),
      ],
    });
  }

  private detectErc20BatchMintable() {
    if (
      detectContractFeature<IMintableERC20 & IMulticall>(
        this.contractWrapper,
        "ERC20BatchMintable",
      )
    ) {
      return new Erc20BatchMintable(this.erc20, this.contractWrapper);
    }
    return undefined;
  }
}

/**
 * Enables generating ERC20 Tokens with rules and an associated signature, which can then be minted by anyone securely
 * @public
 */
// TODO consolidate into a single class
export class Erc20SignatureMintable implements DetectableFeature {
  featureName = FEATURE_TOKEN_SIGNATURE_MINTABLE.name;

  private contractWrapper: ContractWrapper<TokenERC20>;
  private roles:
    | ContractRoles<TokenERC20, (typeof TokenInitializer.roles)[number]>
    | undefined;

  constructor(
    contractWrapper: ContractWrapper<TokenERC20>,
    roles?: ContractRoles<TokenERC20, (typeof TokenInitializer.roles)[number]>,
  ) {
    this.contractWrapper = contractWrapper;
    this.roles = roles;
  }

  /**
   * Mint tokens from a signature
   *
   * @remarks Mint a certain amount of tokens from a previously generated signature.
   *
   * @example
   * ```javascript
   * // see how to craft a payload to sign in the `generate()` documentation
   * const signedPayload = contract.erc20.signature.generate(payload);
   *
   * // Use the signed payload to mint the tokens
   * const tx = contract.erc20.signature.mint(signedPayload);
   * ```
   * @param signedPayload - the previously generated payload and signature with {@link Erc20SignatureMintable.generate}
   * @twfeature ERC20SignatureMintable
   */
  mint = buildTransactionFunction(async (signedPayload: SignedPayload20) => {
    const mintRequest = signedPayload.payload;
    const signature = signedPayload.signature;
    const message = await this.mapPayloadToContractStruct(mintRequest);
    const overrides = await this.contractWrapper.getCallOverrides();
    // TODO: Transaction Sequence Pattern
    await setErc20Allowance(
      this.contractWrapper,
      BigNumber.from(message.price),
      mintRequest.currencyAddress,
      overrides,
    );
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "mintWithSignature",
      args: [message, signature],
      overrides,
    });
  });

  /**
   * Mint any number of generated tokens signatures at once
   * @remarks Mint multiple token signatures in one transaction. Note that this is only possible for free mints (cannot batch mints with a price attached to it for security reasons)
   * @param signedPayloads - the array of signed payloads to mint
   * @twfeature ERC20SignatureMintable
   */
  mintBatch = buildTransactionFunction(
    async (signedPayloads: SignedPayload20[]) => {
      const contractPayloads = await Promise.all(
        signedPayloads.map(async (s) => {
          const message = await this.mapPayloadToContractStruct(s.payload);
          const signature = s.signature;
          const price = s.payload.price;
          if (BigNumber.from(price).gt(0)) {
            throw new Error(
              "Can only batch free mints. For mints with a price, use regular mint()",
            );
          }
          return {
            message,
            signature,
          };
        }),
      );
      const encoded = contractPayloads.map((p) => {
        return this.contractWrapper.readContract.interface.encodeFunctionData(
          "mintWithSignature",
          [p.message, p.signature],
        );
      });
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "multicall",
        args: [encoded],
      });
    },
  );

  /**
   * Verify that a payload is correctly signed
   * @param signedPayload - the payload to verify
   * @twfeature ERC20SignatureMintable
   *
   * ```javascript
   * const startTime = new Date();
   * const endTime = new Date(Date.now() + 60 * 60 * 24 * 1000);
   * const payload = {
   *   quantity: 4.2, // The quantity of tokens to be minted
   *   to: {{wallet_address}}, // Who will receive the tokens
   *   price: 0.5, // the price to pay for minting those tokens
   *   currencyAddress: NATIVE_TOKEN_ADDRESS, // the currency to pay with
   *   mintStartTime: startTime, // can mint anytime from now
   *   mintEndTime: endTime, // to 24h from now,
   *   primarySaleRecipient: "0x...", // custom sale recipient for this token mint
   * };
   *
   * const signedPayload = await contract.erc20.signature.generate(payload);
   * // Now you can verify if the signed payload is valid
   * const isValid = await contract.erc20.signature.verify(signedPayload);
   * ```
   */
  public async verify(signedPayload: SignedPayload20): Promise<boolean> {
    const mintRequest = signedPayload.payload;
    const signature = signedPayload.signature;
    const message = await this.mapPayloadToContractStruct(mintRequest);
    const verification: [boolean, string] =
      await this.contractWrapper.readContract.verify(message, signature);
    return verification[0];
  }

  /**
   * Generate a signature that can be used to mint a certain amount of tokens
   *
   * @remarks Takes in a quantity of tokens, some conditions for how it can be minted and signs it with your private key. The generated signature can then be used to mint those tokens using the exact payload and signature generated.
   *
   * @example
   * ```javascript
   * const startTime = new Date();
   * const endTime = new Date(Date.now() + 60 * 60 * 24 * 1000);
   * const payload = {
   *   quantity: 4.2, // The quantity of tokens to be minted
   *   to: {{wallet_address}}, // Who will receive the tokens
   *   price: 0.5, // the price to pay for minting those tokens
   *   currencyAddress: NATIVE_TOKEN_ADDRESS, // the currency to pay with
   *   mintStartTime: startTime, // can mint anytime from now
   *   mintEndTime: endTime, // to 24h from now,
   *   primarySaleRecipient: "0x...", // custom sale recipient for this token mint
   * };
   *
   * const signedPayload = await contract.erc20.signature.generate(payload);
   * // now anyone can use these to mint the NFT using `contract.erc20.signature.mint(signedPayload)`
   * ```
   * @param mintRequest - the payload to sign
   * @returns the signed payload and the corresponding signature
   * @twfeature ERC20SignatureMintable
   */
  public async generate(
    mintRequest: PayloadToSign20,
  ): Promise<SignedPayload20> {
    return (await this.generateBatch([mintRequest]))[0];
  }

  /**
   * Generate a batch of signatures that can be used to mint many token signatures.
   *
   * @remarks See {@link Erc20SignatureMintable.generate}
   *
   * @param payloadsToSign - the payloads to sign
   * @returns an array of payloads and signatures
   * @twfeature ERC20SignatureMintable
   */
  public async generateBatch(
    payloadsToSign: PayloadToSign20[],
  ): Promise<SignedPayload20[]> {
    await this.roles?.verify(
      ["minter"],
      await this.contractWrapper.getSignerAddress(),
    );

    const parsedRequests: FilledSignaturePayload20[] = await Promise.all(
      payloadsToSign.map((m) => Signature20PayloadInput.parseAsync(m)),
    );

    const chainId = await this.contractWrapper.getChainID();
    const signer = this.contractWrapper.getSigner();
    invariant(signer, "No signer available");

    // ERC20Permit (EIP-712) spec differs from signature mint 721, 1155.
    const name = await this.contractWrapper.readContract.name();

    return await Promise.all(
      parsedRequests.map(async (m) => {
        const finalPayload = await Signature20PayloadOutput.parseAsync(m);
        const signature = await this.contractWrapper.signTypedData(
          signer,
          {
            name,
            version: "1",
            chainId,
            verifyingContract: this.contractWrapper.readContract.address,
          },
          { MintRequest: MintRequest20 },
          await this.mapPayloadToContractStruct(finalPayload),
        );
        return {
          payload: finalPayload,
          signature: signature.toString(),
        };
      }),
    );
  }

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  /**
   * Maps a payload to the format expected by the contract
   *
   * @internal
   *
   * @param mintRequest - The payload to map.
   * @returns - The mapped payload.
   */
  private async mapPayloadToContractStruct(
    mintRequest: PayloadWithUri20,
  ): Promise<ITokenERC20.MintRequestStructOutput> {
    const normalizedPrice = await normalizePriceValue(
      this.contractWrapper.getProvider(),
      mintRequest.price,
      mintRequest.currencyAddress,
    );
    const amountWithDecimals = ethers.utils.parseUnits(
      mintRequest.quantity,
      await this.contractWrapper.readContract.decimals(),
    );
    return {
      to: mintRequest.to,
      primarySaleRecipient: mintRequest.primarySaleRecipient,
      quantity: amountWithDecimals,
      price: normalizedPrice,
      currency: mintRequest.currencyAddress,
      validityEndTimestamp: mintRequest.mintEndTime,
      validityStartTimestamp: mintRequest.mintStartTime,
      uid: mintRequest.uid,
    } as ITokenERC20.MintRequestStructOutput;
  }
}

/**
 * Configure and claim ERC20 tokens
 * @remarks Manage claim phases and claim ERC20 tokens that have been lazily minted.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.token.drop.claim.to("0x...", quantity);
 * ```
 */
export class Erc20ClaimableWithConditions implements DetectableFeature {
  featureName = FEATURE_TOKEN_CLAIM_CONDITIONS_V2.name;
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
   * await contract.token.drop.claim.conditions.set(claimConditions);
   * ```
   */
  public conditions: DropClaimConditions<BaseDropERC20>;
  private contractWrapper: ContractWrapper<BaseDropERC20>;
  private erc20: Erc20;
  private storage: ThirdwebStorage;

  constructor(
    erc20: Erc20,
    contractWrapper: ContractWrapper<BaseDropERC20>,
    storage: ThirdwebStorage,
  ) {
    this.erc20 = erc20;
    this.contractWrapper = contractWrapper;

    this.storage = storage;
    const metadata = new ContractMetadata(
      this.contractWrapper,
      CustomContractSchema,
      this.storage,
    );
    this.conditions = new DropClaimConditions(
      this.contractWrapper,
      metadata,
      this.storage,
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
   * const tx = await contract.token.drop.claim.to(address, quantity);
   * const receipt = tx.receipt; // the transaction receipt
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param amount - Quantity of the tokens you want to claim
   * @param checkERC20Allowance - Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer
   * @param claimData
   * @returns - The transaction receipt
   */
  to = buildTransactionFunction(
    async (
      destinationAddress: AddressOrEns,
      amount: Amount,
      options?: ClaimOptions,
    ) => {
      const quantity = await this.erc20.normalizeAmount(amount);
      return await this.conditions.getClaimTransaction(
        destinationAddress,
        quantity,
        options,
      );
    },
  );
}

/**
 * Mint Many ERC20 Tokens at once
 * @remarks Token batch minting functionality that handles unit parsing for you.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.token.mint.batch.to(walletAddress, [nftMetadata1, nftMetadata2, ...]);
 * ```
 * @public
 */
export class Erc20BatchMintable implements DetectableFeature {
  featureName = FEATURE_TOKEN_BATCH_MINTABLE.name;
  private contractWrapper: ContractWrapper<IMintableERC20 & IMulticall>;
  private erc20: Erc20;

  constructor(
    erc20: Erc20,
    contractWrapper: ContractWrapper<IMintableERC20 & IMulticall>,
  ) {
    this.erc20 = erc20;
    this.contractWrapper = contractWrapper;
  }

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
   * await contract.token.mint.batch(data);
   * ```
   */
  to = buildTransactionFunction(async (args: TokenMintInput[]) => {
    const encoded: string[] = [];
    for (const arg of args) {
      encoded.push(
        this.contractWrapper.readContract.interface.encodeFunctionData(
          "mintTo",
          [
            await resolveAddress(arg.toAddress),
            await this.erc20.normalizeAmount(arg.amount),
          ],
        ),
      );
    }

    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "multicall",
      args: [encoded],
    });
  });
}
