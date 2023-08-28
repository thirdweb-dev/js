import type {
  ContractMetadata as ContractMetadataContract,
  IMulticall,
  IRoyalty,
} from "@thirdweb-dev/contracts-js";
import { BigNumberish } from "ethers";
import { z } from "zod";
import { hasFunction } from "../../common/feature-detection/hasFunction";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_ROYALTY } from "../../constants/thirdweb-features";
import { CommonRoyaltySchema } from "../../schema/contracts/common";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResult } from "../types";
import { ContractEncoder } from "./contract-encoder";
import { ContractMetadata, IGenericSchemaType } from "./contract-metadata";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";

/**
 * Handle contract royalties
 * @remarks Configure royalties for an entire contract or a particular token.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * const royaltyInfo = await contract.royalties.getDefaultRoyaltyInfo();
 * await contract.roles.setTokenRoyaltyInfo(tokenId, {
 *   seller_fee_basis_points: 100, // 1% royalty fee
 *   fee_recipient: "0x...", // the fee recipient
 * });
 * ```
 * @public
 */
export class ContractRoyalty<
  TContract extends IRoyalty,
  TSchema extends IGenericSchemaType,
> implements DetectableFeature
{
  featureName = FEATURE_ROYALTY.name;
  private contractWrapper;
  private metadata;

  constructor(
    contractWrapper: ContractWrapper<IRoyalty>,
    metadata: ContractMetadata<TContract, TSchema>,
  ) {
    this.contractWrapper = contractWrapper;
    this.metadata = metadata;
  }

  /**
   * Get the royalty recipient and fee
   * @returns - The royalty recipient and BPS
   * @example
   * ```javascript
   * const royaltyInfo = await contract.royalties.getDefaultRoyaltyInfo();
   * console.log(royaltyInfo.fee_recipient);
   * console.log(royaltyInfo.seller_fee_basis_points);
   * ```
   * @public
   * @twfeature Royalty
   */
  public async getDefaultRoyaltyInfo() {
    const [royaltyRecipient, royaltyBps] = await this.contractWrapper.read(
      "getDefaultRoyaltyInfo",
      [],
    );
    // parse it on the way out to make sure we default things if they are not set
    return CommonRoyaltySchema.parseAsync({
      fee_recipient: royaltyRecipient,
      seller_fee_basis_points: royaltyBps,
    });
  }

  /**
   * Get the royalty recipient and fee of a particular token
   * @returns - The royalty recipient and BPS
   * @example
   * ```javascript
   * const royaltyInfo = await contract.royalties.getDefaultRoyaltyInfo();
   * console.log(royaltyInfo.fee_recipient);
   * console.log(royaltyInfo.seller_fee_basis_points);
   * ```
   * @public
   * @twfeature Royalty
   */
  public async getTokenRoyaltyInfo(tokenId: BigNumberish) {
    const [royaltyRecipient, royaltyBps] = await this.contractWrapper.read(
      "getRoyaltyInfoForToken",
      [tokenId],
    );
    return CommonRoyaltySchema.parseAsync({
      fee_recipient: royaltyRecipient,
      seller_fee_basis_points: royaltyBps,
    });
  }

  /**
   * Set the royalty recipient and fee
   * @param royaltyData - the royalty recipient and fee
   *  @example
   * ```javascript
   * await contract.roles.setDefaultRoyaltyInfo({
   *   seller_fee_basis_points: 100, // 1% royalty fee
   *   fee_recipient: "0x...", // the fee recipient
   * });
   * ```
   * @public
   * @twfeature Royalty
   */
  setDefaultRoyaltyInfo = /* @__PURE__ */ buildTransactionFunction(
    async (
      royaltyData: z.input<typeof CommonRoyaltySchema>,
    ): Promise<
      Transaction<TransactionResult<z.output<typeof CommonRoyaltySchema>>>
    > => {
      // read the metadata from the contract
      const oldMetadata = await this.metadata.get();

      // update the metadata with the new royalty data
      // if one of the keys is "undefined" it will be ignored (which is the desired behavior)
      const mergedMetadata = await this.metadata.parseInputMetadata({
        ...oldMetadata,
        ...royaltyData,
      });

      // why not use this.metadata.set()? - because that would end up sending it's own separate transaction to `setContractURI`
      // but we want to send both the `setRoyaltyInfo` and `setContractURI` in one transaction!
      const contractURI = await this.metadata._parseAndUploadMetadata(
        mergedMetadata,
      );

      if (
        hasFunction<ContractMetadataContract>(
          "setContractURI",
          this.contractWrapper,
        )
      ) {
        const contractEncoder = new ContractEncoder(this.contractWrapper);
        // encode both the functions we want to send
        const encoded = [
          contractEncoder.encode("setDefaultRoyaltyInfo", [
            mergedMetadata.fee_recipient,
            mergedMetadata.seller_fee_basis_points,
          ]),
          contractEncoder.encode("setContractURI", [contractURI]),
        ];
        // actually send the transaction and return the receipt + a way to get the new royalty info

        return Transaction.fromContractWrapper({
          contractWrapper: this
            .contractWrapper as unknown as ContractWrapper<IMulticall>,
          method: "multicall",
          args: [encoded],
          parse: (receipt) => ({
            receipt,
            data: () => this.getDefaultRoyaltyInfo(),
          }),
        });
      } else {
        throw new Error(
          "Updating royalties requires implementing ContractMetadata in your contract to support marketplaces like OpenSea.",
        );
      }
    },
  );

  /**
   * Set the royalty recipient and fee for a particular token
   * @param tokenId - the token id
   * @param royaltyData - the royalty recipient and fee
   * @example
   * ```javascript
   * const tokenId = 0;
   * await contract.roles.setTokenRoyaltyInfo(tokenId, {
   *   seller_fee_basis_points: 100, // 1% royalty fee
   *   fee_recipient: "0x...", // the fee recipient
   * });
   * ```
   * @public
   * @twfeature Royalty
   */
  setTokenRoyaltyInfo = /* @__PURE__ */ buildTransactionFunction(
    async (
      tokenId: BigNumberish,
      royaltyData: z.input<typeof CommonRoyaltySchema>,
    ) => {
      const parsedRoyaltyData = CommonRoyaltySchema.parse(royaltyData);
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setRoyaltyInfoForToken",
        args: [
          tokenId,
          parsedRoyaltyData.fee_recipient,
          parsedRoyaltyData.seller_fee_basis_points,
        ],
        parse: (receipt) => ({
          receipt,
          data: () => this.getDefaultRoyaltyInfo(),
        }),
      });
    },
  );
}
