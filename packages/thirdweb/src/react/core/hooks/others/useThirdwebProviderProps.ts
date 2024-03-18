import { useContext } from "react";
import { ThirdwebProviderContext } from "../../providers/thirdweb-provider-ctx.js";

/**
 * Get the props passed to the ThirdwebProvider.
 * @example
 * ```tsx
 * const props = useThirdwebProviderProps();
 * ```
 * @returns The props passed to the ThirdwebProvider
 */
export function useThirdwebProviderProps() {
  const props = useContext(ThirdwebProviderContext);
  if (!props) {
    throw new Error(
      "useThirdwebProviderProps must be used within a <ThirdwebProvider>",
    );
  }
  return props;
}
