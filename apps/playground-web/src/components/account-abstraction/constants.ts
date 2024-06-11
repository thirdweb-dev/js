import { getContract } from "thirdweb";
import { zkSyncSepolia } from "thirdweb/chains";
import { THIRDWEB_CLIENT } from "../../lib/client";

export const chain = zkSyncSepolia;
export const editionDropAddress = "0xd563ACBeD80e63B257B2524562BdD7Ec666eEE77";
export const editionDropTokenId = 0n;

export const editionDropContract = getContract({
  address: editionDropAddress,
  chain,
  client: THIRDWEB_CLIENT,
});
