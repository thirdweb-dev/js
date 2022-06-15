import { ThirdwebSDKProvider, useSigner } from "@thirdweb-dev/react";
import { SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import {
  StorageSingleton,
  alchemyUrlMap,
} from "components/app-layouts/providers";
import { ComponentWithChildren } from "types/component-with-children";
import { useProvider } from "wagmi";

export const CustomSDKContext: ComponentWithChildren<{
  desiredChainId?: SUPPORTED_CHAIN_ID | -1;
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
        readonlySettings:
          desiredChainId && desiredChainId !== -1
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
