import {
  extractEventsFromAbi,
  extractFunctionsFromAbi,
  fetchContractMetadataFromAddress,
} from "../../common";
import {
  AbiEvent,
  AbiFunction,
  AbiSchema,
  PublishedMetadata,
} from "../../schema/contracts/custom";
import { ContractWrapper } from "./contract-wrapper";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BaseContract } from "ethers";

/**
 * Handles publish metadata for a contract
 * @internal
 */
export class ContractPublishedMetadata<TContract extends BaseContract> {
  private contractWrapper;
  private storage: ThirdwebStorage;

  private _cachedMetadata: PublishedMetadata | undefined;

  constructor(
    contractWrapper: ContractWrapper<TContract>,
    storage: ThirdwebStorage,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
  }

  /**
   * Get the published metadata for this contract
   * @public
   */
  public async get(): Promise<PublishedMetadata> {
    if (this._cachedMetadata) {
      return this._cachedMetadata;
    }
    this._cachedMetadata = await fetchContractMetadataFromAddress(
      this.contractWrapper.readContract.address,
      this.contractWrapper.getProvider(),
      this.storage,
    );
    return this._cachedMetadata;
  }

  /**
   * @public
   */
  public async extractFunctions(): Promise<AbiFunction[]> {
    let publishedMetadata;
    try {
      publishedMetadata = await this.get();
    } catch (e) {
      // ignore for built-in contracts
    }
    // to construct a contract we already **have** to have the abi on the contract wrapper, so there is no reason to look fetch it again (means this function can become synchronous as well!)
    return extractFunctionsFromAbi(
      AbiSchema.parse(this.contractWrapper.abi),
      publishedMetadata?.metadata,
    );
  }

  /**
   * @public
   */
  public async extractEvents(): Promise<AbiEvent[]> {
    let publishedMetadata;
    try {
      publishedMetadata = await this.get();
    } catch (e) {
      // ignore for built-in contracts
    }
    // to construct a contract we already **have** to have the abi on the contract wrapper, so there is no reason to look fetch it again (means this function can become synchronous as well!)
    return extractEventsFromAbi(
      AbiSchema.parse(this.contractWrapper.abi),
      publishedMetadata?.metadata,
    );
  }
}
