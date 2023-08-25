import type { IPlatformFee } from "@thirdweb-dev/contracts-js";
import { z } from "zod";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_PLATFORM_FEE } from "../../constants/thirdweb-features";
import { CommonPlatformFeeSchema } from "../../schema/contracts/common";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";

/**
 * Handle platform fees and recipients
 * @remarks Configure platform fees for a contract, which can be applied on certain paid transactions
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * const feeInfo = await contract.platformFees.get();
 * await contract.platformFees.set({
 *   platform_fee_basis_points: 100, // 1% fee
 *   platform_fee_recipient: "0x..." // the fee recipient
 * })
 * ```
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- TO BE REMOVED IN V4
export class ContractPlatformFee<TContract extends IPlatformFee>
  implements DetectableFeature
{
  featureName = FEATURE_PLATFORM_FEE.name;
  private contractWrapper;

  constructor(contractWrapper: ContractWrapper<IPlatformFee>) {
    this.contractWrapper = contractWrapper;
  }

  /**
   * Get the platform fee recipient and basis points
   *
   * @example
   * ```javascript
   * const feeInfo = await contract.platformFees.get();
   * console.log(feeInfo.platform_fee_recipient);
   * console.log(feeInfo.platform_fee_basis_points);
   * ```
   * @twfeature PlatformFee
   */
  public async get() {
    const [platformFeeRecipient, platformFeeBps] =
      await this.contractWrapper.read("getPlatformFeeInfo", []);
    return CommonPlatformFeeSchema.parseAsync({
      platform_fee_recipient: platformFeeRecipient,
      platform_fee_basis_points: platformFeeBps,
    });
  }

  /**
   * Set the platform fee recipient and basis points
   *
   * @example
   * ```javascript
   * await contract.platformFees.set({
   *   platform_fee_basis_points: 100, // 1% fee
   *   platform_fee_recipient: "0x..." // the fee recipient
   * })
   * ```
   *
   * @param platformFeeInfo - the platform fee information
   * @twfeature PlatformFee
   */
  set = /* @__PURE__ */ buildTransactionFunction(
    async (
      platformFeeInfo: z.input<typeof CommonPlatformFeeSchema>,
    ): Promise<Transaction> => {
      const parsed = await CommonPlatformFeeSchema.parseAsync(platformFeeInfo);

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper as ContractWrapper<IPlatformFee>,
        method: "setPlatformFeeInfo",
        args: [parsed.platform_fee_recipient, parsed.platform_fee_basis_points],
      });
    },
  );
}
