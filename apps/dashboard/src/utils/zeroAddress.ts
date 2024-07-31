import { NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS, isAddress } from "thirdweb";

export function isAddressZero(address: string): boolean {
  const lowerCaseAddress = (address || "").toLowerCase();
  return (
    isAddress(lowerCaseAddress) &&
    (lowerCaseAddress === ZERO_ADDRESS ||
      lowerCaseAddress === NATIVE_TOKEN_ADDRESS.toLowerCase())
  );
}
