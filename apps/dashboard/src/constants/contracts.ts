import { getThirdwebClient } from "@/constants/thirdweb.server";
import { getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";

/**
 * Putting this here solely for the purpose of getting rid of sdk v4
 */
export type ContractType =
  | "split"
  | "custom"
  | "edition-drop"
  | "edition"
  | "marketplace"
  | "marketplace-v3"
  | "multiwrap"
  | "nft-collection"
  | "nft-drop"
  | "pack"
  | "signature-drop"
  | "token-drop"
  | "token"
  | "vote";

export const MULTICHAIN_REGISTRY_CONTRACT = getContract({
  chain: polygon,
  client: getThirdwebClient(),
  address: "0xcdAD8FA86e18538aC207872E8ff3536501431B73",
});
