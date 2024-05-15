import { constants } from "ethers";

/**
 * In the past we default `platform_fee_recipient` and `primary_sale_recipient` to AddressZero.
 * However due to a recent change in our smart contract extensions (PrimarySale & PlatformFee), AddressZero is no longer an accepted value for those fields.
 * So now we set the default value to the signer address.
 * https://github.com/thirdweb-dev/contracts/pull/530
 *
 * @param signerAddress - The address of the contract deployer
 * @param recipient - The address that will receive the platform fees and/or sale fees
 * @returns `signerAddress` if the `recipient` is AddressZero, otherwise returns `recipient`
 * @internal
 */
export function overrideRecipientAddress(
  signerAddress: string,
  recipient: string,
): string {
  if (recipient === constants.AddressZero) {
    return signerAddress;
  }
  return recipient;
}
