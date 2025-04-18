import {
  type AlchemySupportedChainId,
  alchemySupportedChainIds,
} from "./types";

export function isAlchemySupported(
  chainId: number,
): chainId is AlchemySupportedChainId {
  return alchemySupportedChainIds.includes(chainId.toString());
}
