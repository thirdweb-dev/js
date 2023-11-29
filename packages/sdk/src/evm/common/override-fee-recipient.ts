import { constants } from "ethers";

/**
 * In the past we default `platform_fee_recipient` and `primary_sale_recipient` to AddressZero.
 * However due to a recent change in our smart contract extensions (PrimarySale & PlatformFee), AddressZero is no longer an accepted value for those fields.
 * So now we're set the default value to the signer address.
 * @reference https://github.com/thirdweb-dev/contracts/pull/530
 * @param signerAddress The address of the contract deployer
 * @param fee_recipient The address that will receive the platform fees and/or sale fees
 * @returns `signerAddress` if the `fee_recipient` is AddressZero, otherwise returns `fee_recipient`
 * @internal
 */
export function overrideFeeRecipient(
  signerAddress: string,
  fee_recipient: string,
): string {
  if (fee_recipient === constants.AddressZero) return signerAddress;
  return fee_recipient;
}
