import { constants, utils } from "ethers";

export const OtherAddressZero = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export function isAddressZero(address: string): boolean {
  const lowerCaseAddress = (address || "").toLowerCase();
  return (
    utils.isAddress(lowerCaseAddress) &&
    (lowerCaseAddress === constants.AddressZero ||
      lowerCaseAddress === OtherAddressZero)
  );
}
