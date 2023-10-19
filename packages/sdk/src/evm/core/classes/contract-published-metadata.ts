import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BaseContract } from "ethers";
import { extractEventsFromAbi } from "../../common/feature-detection/extractEventsFromAbi";
import { extractFunctionsFromAbi } from "../../common/feature-detection/extractFunctionsFromAbi";
import { fetchContractMetadataFromAddress } from "../../common/metadata-resolver";
import {
  AbiEvent,
  AbiFunction,
  AbiSchema,
  ContractSource,
  PublishedMetadata,
} from "../../schema/contracts/custom";
import { ContractWrapper } from "./contract-wrapper";
import { fetchSourceFilesFromMetadata } from "../../common";

/**
 * Handles publish metadata for a contract
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- TO BE REMOVED IN V4
export class ContractPublishedMetadata<TContract extends BaseContract> {
  private contractWrapper;
  private storage: ThirdwebStorage;

  private _cachedMetadata: PublishedMetadata | undefined;

  constructor(
    contractWrapper: ContractWrapper<BaseContract>,
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
      this.contractWrapper.address,
      this.contractWrapper.getProvider(),
      this.storage,
      this.contractWrapper.options,
    );
    return this._cachedMetadata;
  }

  /**
   * @public
   */
  public async extractSources(): Promise<ContractSource[]> {
    const publishedMetadata = await this.get();
    return fetchSourceFilesFromMetadata(publishedMetadata, this.storage);
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
