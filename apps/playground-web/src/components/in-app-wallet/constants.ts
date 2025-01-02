import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { THIRDWEB_CLIENT } from "../../lib/client";

export const chain = baseSepolia;
export const tokenDropAddress = "0xd64A548A82c190083707CBEFD26958E5e6551D18";
export const editionDropAddress = "0x638263e3eAa3917a53630e61B1fBa685308024fa";
export const editionDropTokenId = 0n;

export const editionDropContract = getContract({
  address: editionDropAddress,
  chain,
  client: THIRDWEB_CLIENT,
});

export const tokenDropContract = getContract({
  address: tokenDropAddress,
  chain,
  client: THIRDWEB_CLIENT,
});
