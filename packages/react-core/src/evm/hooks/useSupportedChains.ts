import { useContext } from "react";
import invariant from "tiny-invariant";
import { ThirdwebConfigContext } from "../contexts/thirdweb-config";

export function useSupportedChains() {
  const context = useContext(ThirdwebConfigContext);
  invariant(
    context,
    "useSupportedChains() hook must be used within a <ThirdwebProvider/>",
  );
  return context.chains;
}
