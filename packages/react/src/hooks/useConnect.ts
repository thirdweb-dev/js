import { useConnect as useWagmiConnect } from "wagmi";

/**
 * for now just re-exported
 * @internal
 */
export function useConnect() {
  return useWagmiConnect();
}
