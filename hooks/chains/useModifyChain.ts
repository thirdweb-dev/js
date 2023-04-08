import { ModifyChainContext } from "contexts/configured-chains";
import { useContext } from "react";
import invariant from "tiny-invariant";

export function useModifyChain() {
  const context = useContext(ModifyChainContext);
  invariant(context, "useModifyChain must be used within ModifyChainContext");
  return context;
}
