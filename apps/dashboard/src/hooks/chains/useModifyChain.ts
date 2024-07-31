import {
  ModifyChainContext,
  RemoveChainModification,
} from "contexts/configured-chains";
import { useContext } from "react";
import invariant from "tiny-invariant";

export function useModifyChain() {
  const context = useContext(ModifyChainContext);
  invariant(context, "useModifyChain must be used within ModifyChainContext");
  return context;
}

export function useRemoveChainModification() {
  const context = useContext(RemoveChainModification);
  invariant(
    context,
    "useRemoveChainModification must be used within ModifyChainContext",
  );
  return context;
}
