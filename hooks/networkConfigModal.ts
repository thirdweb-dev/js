import {
  EditChainContext,
  SetEditChainContext,
  SetIsNetworkConfigModalOpenCtx,
  isNetworkConfigModalOpenCtx,
} from "contexts/configured-chains";
import { useContext } from "react";
import invariant from "tiny-invariant";

export const useIsNetworkConfigModalOpen = () => {
  return useContext(isNetworkConfigModalOpenCtx);
};

export const useSetIsNetworkConfigModalOpen = () => {
  const context = useContext(SetIsNetworkConfigModalOpenCtx);

  invariant(
    context,
    "useSetIsNetworkConfigModalOpen must be used within a SetOpenNetworkConfigModalContext.Provider",
  );
  return context;
};

export const useEditChain = () => {
  return useContext(EditChainContext);
};

export const useSetEditChain = () => {
  const context = useContext(SetEditChainContext);
  invariant(
    context,
    "useSetEditChain must be used within a SetEditChainContext.Provider",
  );
  return context;
};
