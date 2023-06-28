import type { Chain } from "@thirdweb-dev/chains";
import { createClient } from "../client";

export function getBlockNumber({ chain }: { chain: Chain }) {
  return createClient(chain).getBlockNumber();
}
