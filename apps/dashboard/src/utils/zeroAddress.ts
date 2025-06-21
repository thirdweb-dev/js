import { isAddress, NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS } from "thirdweb";

export function isAddressZero(address: string): boolean {
  const lowerCaseAddress = (address || "").toLowerCase();
  return (
    isAddress(lowerCaseAddress) &&
    (lowerCaseAddress === ZERO_ADDRESS ||
      lowerCaseAddress === NATIVE_TOKEN_ADDRESS.toLowerCase())
  );
}
