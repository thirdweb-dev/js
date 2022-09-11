import { FEATURE_PLATFORM_FEE } from "../../constants/thirdweb-features";
import { CommonPlatformFeeSchema } from "../../schema";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResult } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { IPlatformFee } from "@thirdweb-dev/contracts-js";
import { z } from "zod";

/**
 * Handle platform fees and recipients
 * @remarks Configure platform fees for a contract, which can be applied on certain paid transactions
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * const feeInfo = await contract.platformFee.get();
 * await contract.platformFee.set({
 *   platform_fee_basis_points: 100, // 1% fee
 *   platform_fee_recipient: "0x..." // the fee recipient
 * })
 * ```
 * @public
 */
export class ContractPlatformFee<TContract extends IPlatformFee>
  implements DetectableFeature
{
  featureName = FEATURE_PLATFORM_FEE.name;
  private contractWrapper;

  constructor(contractWrapper: ContractWrapper<TContract>) {
    this.contractWrapper = contractWrapper;
  }

  /**
   * Get the platform fee recipient and basis points
   *  * @example
   * ```javascript
   * const feeInfo = await contract.platformFee.get();
   * ```
   * @twfeature PlatformFee
   */
  public async get() {
    const [platformFeeRecipient, platformFeeBps] =
      await this.contractWrapper.readContract.getPlatformFeeInfo();
    return CommonPlatformFeeSchema.parse({
      platform_fee_recipient: platformFeeRecipient,
      platform_fee_basis_points: platformFeeBps,
    });
  }

  /**
   * Set the platform fee recipient and basis points
   * @param platformFeeInfo - the platform fee information
   * ```javascript
   * await contract.platformFee.set({
   *   platform_fee_basis_points: 100, // 1% fee
   *   platform_fee_recipient: "0x..." // the fee recipient
   * })
   * ```
   * @twfeature PlatformFee
   */
  public async set(
    platformFeeInfo: z.input<typeof CommonPlatformFeeSchema>,
  ): Promise<TransactionResult> {
    const parsed = CommonPlatformFeeSchema.parse(platformFeeInfo);
    return {
      receipt: await this.contractWrapper.sendTransaction(
        "setPlatformFeeInfo",
        [parsed.platform_fee_recipient, parsed.platform_fee_basis_points],
      ),
    };
  }
}
