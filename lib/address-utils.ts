import { isEnsName } from "./ens";
import { PublicKey } from "@solana/web3.js";
import { utils } from "ethers";

export function isPossibleSolanaAddress(address?: string) {
  if (!address) {
    return false;
  }
  try {
    return new PublicKey(address).toBase58() === address;
  } catch (err) {
    return false;
  }
}

// if a string is a valid address or ens name
export function isPossibleEVMAddress(address?: string, ignoreEns?: boolean) {
  if (!address) {
    return false;
  }
  if (isEnsName(address) && !ignoreEns) {
    return true;
  }
  return utils.isAddress(address);
}
