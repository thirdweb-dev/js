import {
  type MoralisSupportedChainId,
  moralisSupportedChainIds,
} from "./types";

export function isMoralisSupported(
  chainId: number,
): chainId is MoralisSupportedChainId {
  return moralisSupportedChainIds.includes(chainId.toString());
}
