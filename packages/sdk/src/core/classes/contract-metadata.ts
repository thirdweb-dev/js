import {
  detectContractFeature,
  fetchContractMetadataFromAddress,
  hasFunction,
} from "../../common";
import { FEATURE_METADATA } from "../../constants/thirdweb-features";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResult } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { IContractMetadata, IERC20Metadata } from "@thirdweb-dev/contracts-js";
import { IStorage } from "@thirdweb-dev/storage";
import { BaseContract } from "ethers";
import { z } from "zod";

/**
 * @internal
 */
export interface IGenericSchemaType {
  deploy: z.AnyZodObject;
  input: z.AnyZodObject;
  output: z.AnyZodObject;
}

/**
 * Handles metadata for a Contract
 * @remarks Read and update metadata for this contract
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * const metadata = await contract.metadata.get();
 * await contract.metadata.set({
 *   name: "My Contract",
 *   description: "My contract description"
 * })
 * ```
 * @public
 */
export class ContractMetadata<
  TContract extends BaseContract,
  TSchema extends IGenericSchemaType,
> implements DetectableFeature
{
  featureName = FEATURE_METADATA.name;
  private contractWrapper;
  private schema;
  private storage;

  constructor(
    contractWrapper: ContractWrapper<TContract>,
    schema: TSchema,
    storage: IStorage,
  ) {
    this.contractWrapper = contractWrapper;
    this.schema = schema;
    this.storage = storage;
  }
  /**
   * @internal
   */
  public parseOutputMetadata(metadata: any): z.output<TSchema["output"]> {
    return this.schema.output.parse(metadata);
  }

  /**
   * @internal
   */
  public parseInputMetadata(metadata: any): z.input<TSchema["input"]> {
    return this.schema.input.parse(metadata);
  }
  /**
   * Get the metadata of a contract
   * @remarks Get the metadata of a contract
   * @example
   * ```javascript
   * const metadata = await contract.metadata.get();
   * ```
   * @public
   * @returns the metadata of the given contract
   */
  public async get() {
    let data;
    if (this.supportsContractMetadata(this.contractWrapper)) {
      const uri = await this.contractWrapper.readContract.contractURI();
      if (uri && uri.includes("://")) {
        data = await this.storage.get(uri);
      }
    }

    if (!data) {
      try {
        // try fetching metadata from bytecode and / or contract itself
        let contractName: string | undefined;
        try {
          if (hasFunction<IERC20Metadata>("name", this.contractWrapper)) {
            contractName = await this.contractWrapper.readContract.name();
          }
        } catch (err) {
          // no-op
        }
        const publishedMetadata = await fetchContractMetadataFromAddress(
          this.contractWrapper.readContract.address,
          this.contractWrapper.getProvider(),
          this.storage,
        );
        data = {
          name: contractName || publishedMetadata.name,
          description: publishedMetadata.info.title,
        };
      } catch (e) {
        throw new Error("Could not fetch contract metadata");
      }
    }

    return this.parseOutputMetadata(data);
  }
  /**
   * Set the metadata of a contract
   * @remarks OVERWRITE the metadata of a contract
   * @example
   * ```javascript
   * await contract.metadata.set({
   *  name: "My Contract",
   *  description: "My contract description"
   * })
   * ```
   * @public
   * @param metadata - the metadata to set
   * @returns
   */
  public async set(metadata: z.input<TSchema["input"]>) {
    const uri = await this._parseAndUploadMetadata(metadata);

    const wrapper = this.contractWrapper;
    if (this.supportsContractMetadata(wrapper)) {
      const receipt = await wrapper.sendTransaction("setContractURI", [uri]);
      return { receipt, data: this.get } as TransactionResult<
        z.output<TSchema["output"]>
      >;
    } else {
      throw new Error("Contract does not support updating contract metadata");
    }
  }

  /**
   * Update the metadata of a contract
   * @remarks Update the metadata of a contract
   * @example
   * ```javascript
   * await contract.metadata.update({
   *   name: "My Contract",
   *   description: "My contract description"
   * })
   * ```
   * @public
   * @param metadata - the metadata to update
   * */
  public async update(metadata: Partial<z.input<TSchema["input"]>>) {
    return await this.set({
      ...(await this.get()),
      ...metadata,
    });
  }

  /**
   *
   * @internal
   * @param metadata - the metadata to set
   * @returns
   */
  public async _parseAndUploadMetadata(metadata: z.input<TSchema["input"]>) {
    const parsedMetadata = this.parseInputMetadata(metadata);
    return this.storage.uploadMetadata(parsedMetadata);
  }

  private supportsContractMetadata(
    contractWrapper: ContractWrapper<any>,
  ): contractWrapper is ContractWrapper<IContractMetadata> {
    return detectContractFeature<IContractMetadata>(
      contractWrapper,
      "ContractMetadata",
    );
  }
}
