import { useContext } from "react";
import invariant from "tiny-invariant";
import { ThirdwebConfigContext } from "../contexts/thirdweb-config";

/**
 * Hook to get the `supportedChains` which returns the array passed to the `supportedChains` prop of the `ThirdwebProvider` or the default supported chains if not specified.
 *
 * If `activeChain` is set in the `ThirdwebProvider` then it is also added to the `supportedChains` array
 *
 * @others
 */
export function useSupportedChains() {
  const context = useContext(ThirdwebConfigContext);
  invariant(
    context,
    "useSupportedChains() hook must be used within a <ThirdwebProvider/>",
  );
  return context.chains;
}
