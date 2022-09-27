import { getRoleHash } from "../../common";
import { TransactionTask } from "../../core/classes/TransactionTask";
import { ContractEncoder } from "../../core/classes/contract-encoder";
import { ContractEvents } from "../../core/classes/contract-events";
import { ContractInterceptor } from "../../core/classes/contract-interceptor";
import { ContractMetadata } from "../../core/classes/contract-metadata";
import { ContractPlatformFee } from "../../core/classes/contract-platform-fee";
import { ContractRoles } from "../../core/classes/contract-roles";
import { ContractRoyalty } from "../../core/classes/contract-royalty";
import { ContractPrimarySale } from "../../core/classes/contract-sales";
import { ContractWrapper } from "../../core/classes/contract-wrapper";
import { DropErc1155ClaimConditions } from "../../core/classes/drop-erc1155-claim-conditions";
import { DropErc1155History } from "../../core/classes/drop-erc1155-history";
import { Erc1155 } from "../../core/classes/erc-1155";
import { StandardErc1155 } from "../../core/classes/erc-1155-standard";
import { GasCostEstimator } from "../../core/classes/gas-cost-estimator";
import {
  NetworkOrSignerOrProvider,
  TransactionResult,
  TransactionResultWithId,
} from "../../core/types";
import { PaperCheckout } from "../../integrations/paper-xyz";
import { EditionMetadata, EditionMetadataOwner } from "../../schema";
import { DropErc1155ContractSchema } from "../../schema/contracts/drop-erc1155";
import { SDKOptions } from "../../schema/sdk-options";
import { NFTMetadata, NFTMetadataOrUri } from "../../schema/tokens/common";
import { QueryAllParams, UploadProgressEvent } from "../../types";
import type { DropERC1155 } from "@thirdweb-dev/contracts-js";
import type ABI from "@thirdweb-dev/contracts-js/dist/abis/DropERC1155.json";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, CallOverrides, constants } from "ethers";

/**
 * Setup a collection of NFTs with a customizable number of each NFT that are minted as users claim them.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("{{chainName}}");
 * const contract = sdk.getEditionDrop("{{contract_address}}");
 * ```
 *
 * @public
 */
export class EditionDrop extends StandardErc1155<DropERC1155> {
  private static contractRoles = ["admin", "minter", "transfer"] as const;

  public abi: typeof ABI;
  public sales: ContractPrimarySale<DropERC1155>;
  public platformFees: ContractPlatformFee<DropERC1155>;
  public encoder: ContractEncoder<DropERC1155>;
  public estimator: GasCostEstimator<DropERC1155>;
  public events: ContractEvents<DropERC1155>;
  public metadata: ContractMetadata<
    DropERC1155,
    typeof DropErc1155ContractSchema
  >;
  public roles: ContractRoles<
    DropERC1155,
    typeof EditionDrop.contractRoles[number]
  >;
  /**
   * Configure royalties
   * @remarks Set your own royalties for the entire contract or per token
   * @example
   * ```javascript
   * // royalties on the whole contract
   * contract.royalties.setDefaultRoyaltyInfo({
   *   seller_fee_basis_points: 100, // 1%
   *   fee_recipient: "0x..."
   * });
   * // override royalty for a particular token
   * contract.royalties.setTokenRoyaltyInfo(tokenId, {
   *   seller_fee_basis_points: 500, // 5%
   *   fee_recipient: "0x..."
   * });
   * ```
   */
  public royalties: ContractRoyalty<
    DropERC1155,
    typeof DropErc1155ContractSchema
  >;
  /**
   * Configure claim conditions for each NFT
   * @remarks Define who can claim each NFT in the edition, when and how many.
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
   *
   * const tokenId = 0; // the id of the NFT to set claim conditions on
   * await contract.claimConditions.set(tokenId, claimConditions);
   * ```
   */
  public claimConditions: DropErc1155ClaimConditions<DropERC1155>;

  /**
   * Checkout
   * @remarks Create a FIAT currency checkout for your NFT drop.
   */
  public checkout: PaperCheckout<DropERC1155>;

  public history: DropErc1155History;
  public interceptor: ContractInterceptor<DropERC1155>;
  public erc1155: Erc1155<DropERC1155>;

  constructor(
    network: NetworkOrSignerOrProvider,
    address: string,
    storage: ThirdwebStorage,
    options: SDKOptions = {},
    abi: typeof ABI,
    contractWrapper = new ContractWrapper<DropERC1155>(
      network,
      address,
      abi,
      options,
    ),
  ) {
    super(contractWrapper, storage);
    this.abi = abi;
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      DropErc1155ContractSchema,
      this.storage,
    );
    this.roles = new ContractRoles(
      this.contractWrapper,
      EditionDrop.contractRoles,
    );
    this.royalties = new ContractRoyalty(this.contractWrapper, this.metadata);
    this.sales = new ContractPrimarySale(this.contractWrapper);
    this.claimConditions = new DropErc1155ClaimConditions(
      this.contractWrapper,
      this.metadata,
      this.storage,
    );
    this.events = new ContractEvents(this.contractWrapper);
    this.history = new DropErc1155History(this.events);
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.platformFees = new ContractPlatformFee(this.contractWrapper);
    this.interceptor = new ContractInterceptor(this.contractWrapper);
    this.erc1155 = new Erc1155(this.contractWrapper, this.storage);
    this.checkout = new PaperCheckout(this.contractWrapper);
  }

  /**
   * @internal
   */
  onNetworkUpdated(network: NetworkOrSignerOrProvider): void {
    this.contractWrapper.updateSignerOrProvider(network);
  }

  getAddress(): string {
    return this.contractWrapper.readContract.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  // TODO getAllClaimerAddresses() - should be done via an indexer

  /**
   * Get All Minted NFTs
   *
   * @remarks Get all the data associated with every NFT in this contract.
   *
   * By default, returns the first 100 NFTs, use queryParams to fetch more.
   *
   * @example
   * ```javascript
   * const nfts = await contract.getAll();
   * ```
   * @param queryParams - optional filtering to only fetch a subset of results.
   * @returns The NFT metadata for all NFTs queried.
   */
  public async getAll(
    queryParams?: QueryAllParams,
  ): Promise<EditionMetadata[]> {
    return this.erc1155.getAll(queryParams);
  }

  /**
   * Get Owned NFTs
   *
   * @remarks Get all the data associated with the NFTs owned by a specific wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet to get the NFTs of
   * const address = "{{wallet_address}}";
   * const nfts = await contract.getOwned(address);
   * ```
   *
   * @returns The NFT metadata for all NFTs in the contract.
   */
  public async getOwned(
    walletAddress?: string,
  ): Promise<EditionMetadataOwner[]> {
    return this.erc1155.getOwned(walletAddress);
  }

  /**
   * Get the number of NFTs minted
   * @returns the total number of NFTs minted in this contract
   * @public
   */
  public async getTotalCount(): Promise<BigNumber> {
    return this.erc1155.totalCount();
  }

  /**
   * Get whether users can transfer NFTs from this contract
   */
  public async isTransferRestricted(): Promise<boolean> {
    const anyoneCanTransfer = await this.contractWrapper.readContract.hasRole(
      getRoleHash("transfer"),
      constants.AddressZero,
    );
    return !anyoneCanTransfer;
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Create a batch of NFTs to be claimed in the future
   *
   * @remarks Create batch allows you to create a batch of many NFTs in one transaction.
   *
   * @example
   * ```javascript
   * // Custom metadata of the NFTs to create
   * const metadatas = [{
   *   name: "Cool NFT",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * }, {
   *   name: "Cool NFT",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"),
   * }];
   *
   * const results = await contract.createBatch(metadatas); // uploads and creates the NFTs on chain
   * const firstTokenId = results[0].id; // token id of the first created NFT
   * const firstNFT = await results[0].data(); // (optional) fetch details of the first created NFT
   * ```
   *
   * @param metadatas - The metadata to include in the batch.
   * @param options - optional upload progress callback
   */
  public async createBatch(
    metadatas: NFTMetadataOrUri[],
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    },
  ): Promise<TransactionResultWithId<NFTMetadata>[]> {
    return this.erc1155.lazyMint(metadatas, options);
  }

  /**
   * Construct a claim transaction without executing it.
   * This is useful for estimating the gas cost of a claim transaction, overriding transaction options and having fine grained control over the transaction execution.
   * @param destinationAddress - Address you want to send the token to
   * @param tokenId - Id of the token you want to claim
   * @param quantity - Quantity of the tokens you want to claim
   * @param checkERC20Allowance - Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer
   * @param claimData - Optional claim verification data (e.g. price, allowlist proof, etc...)
   */
  public async getClaimTransaction(
    destinationAddress: string,
    tokenId: BigNumberish,
    quantity: BigNumberish,
    checkERC20Allowance = true, // TODO split up allowance checks
  ): Promise<TransactionTask> {
    return this.erc1155.getClaimTransaction(
      destinationAddress,
      tokenId,
      quantity,
      { checkERC20Allowance },
    );
  }

  /**
   * Claim NFTs to a specific Wallet
   *
   * @remarks Let the specified wallet claim NFTs.
   *
   * @example
   * ```javascript
   * const address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs
   * const tokenId = 0; // the id of the NFT you want to claim
   * const quantity = 1; // how many NFTs you want to claim
   *
   * const tx = await contract.claimTo(address, tokenId, quantity);
   * const receipt = tx.receipt; // the transaction receipt
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param tokenId - Id of the token you want to claim
   * @param quantity - Quantity of the tokens you want to claim
   * @param checkERC20Allowance - Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer
   * @param proofs - Array of proofs
   *
   * @returns - Receipt for the transaction
   */
  public async claimTo(
    destinationAddress: string,
    tokenId: BigNumberish,
    quantity: BigNumberish,
    checkERC20Allowance = true,
  ): Promise<TransactionResult> {
    return this.erc1155.claimTo(destinationAddress, tokenId, quantity, {
      checkERC20Allowance,
    });
  }

  /**
   * Claim a token to the connected wallet
   *
   * @remarks See {@link EditionDrop.claimTo}
   *
   * @param tokenId - Id of the token you want to claim
   * @param quantity - Quantity of the tokens you want to claim
   * @param checkERC20Allowance - Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer
   * @param proofs - Array of proofs
   *
   * @returns - Receipt for the transaction
   */
  public async claim(
    tokenId: BigNumberish,
    quantity: BigNumberish,
    checkERC20Allowance = true,
  ): Promise<TransactionResult> {
    const address = await this.contractWrapper.getSignerAddress();
    return this.claimTo(address, tokenId, quantity, checkERC20Allowance);
  }

  /**
   * Burn a specified amount of a NFT
   *
   * @param tokenId - the token Id to burn
   * @param amount - amount to burn
   *
   * @example
   * ```javascript
   * const result = await contract.burnTokens(tokenId, amount);
   * ```
   */
  public async burnTokens(
    tokenId: BigNumberish,
    amount: BigNumberish,
  ): Promise<TransactionResult> {
    return this.erc1155.burn(tokenId, amount);
  }

  /**
   * @internal
   */
  public async call(
    functionName: string,
    ...args: unknown[] | [...unknown[], CallOverrides]
  ): Promise<any> {
    return this.contractWrapper.call(functionName, ...args);
  }
}
