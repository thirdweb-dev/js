import { ThirdwebSDKProvider, useSigner } from "@thirdweb-dev/react";
import {
  StorageSingleton,
  alchemyUrlMap,
} from "components/app-layouts/providers";
import { ComponentWithChildren } from "types/component-with-children";
import { SUPPORTED_CHAIN_ID } from "utils/network";
import { useProvider } from "wagmi";

export const CustomSDKContext: ComponentWithChildren<{
  desiredChainId?: SUPPORTED_CHAIN_ID;
}> = ({ desiredChainId, children }) => {
  const signer = useSigner();
  const provider = useProvider();
  return (
    <ThirdwebSDKProvider
      desiredChainId={desiredChainId}
      signer={signer}
      provider={provider}
      sdkOptions={{
        gasSettings: {
          maxPriceInGwei: 650,
        },
        readonlySettings: desiredChainId
          ? {
              chainId: desiredChainId,
              rpcUrl: alchemyUrlMap[desiredChainId],
            }
          : undefined,
      }}
      storageInterface={StorageSingleton}
    >
      {children}
    </ThirdwebSDKProvider>
  );
};
