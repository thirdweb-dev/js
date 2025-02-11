import type { Chain } from "thirdweb";

export async function getChain(chainId: number): Promise<Chain> {
  return {
    id: chainId,
  } as Chain;
}
