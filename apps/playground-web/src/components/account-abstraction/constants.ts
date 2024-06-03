import { getContract } from "thirdweb";
import { zkSyncSepolia } from "thirdweb/chains";
import { THIRDWEB_CLIENT } from "../../lib/client";

export const chain = zkSyncSepolia;
export const tokenDropAddress = "0xd64A548A82c190083707CBEFD26958E5e6551D18";
export const editionDropAddress = "0xd563ACBeD80e63B257B2524562BdD7Ec666eEE77";
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
