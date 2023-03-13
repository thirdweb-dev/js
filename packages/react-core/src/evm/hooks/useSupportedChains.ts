import { useThirdwebConfigContext } from "../contexts/thirdweb-config";

export function useSupportedChains() {
  return useThirdwebConfigContext().chains;
}
