import { ThirdwebSDKProvider, useSigner } from "@thirdweb-dev/react";
import { ChainId, SDKOptions, SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import {
  StorageSingleton,
  alchemyUrlMap,
} from "components/app-layouts/providers";
import { ComponentWithChildren } from "types/component-with-children";
import { useProvider } from "wagmi";

export const CustomSDKContext: ComponentWithChildren<{
  desiredChainId?: SUPPORTED_CHAIN_ID | -1;
  options?: SDKOptions;
}> = ({ desiredChainId, options, children }) => {
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
        ...options,
      }}
      storageInterface={StorageSingleton}
    >
      {children}
    </ThirdwebSDKProvider>
  );
};

export const PublisherSDKContext: ComponentWithChildren = ({ children }) => (
  <CustomSDKContext
    desiredChainId={ChainId.Polygon}
    options={{
      gasless: {
        openzeppelin: {
          relayerUrl:
            "https://api.defender.openzeppelin.com/autotasks/a94b58a0-dc78-4df7-bd4e-e123d165d5ad/runs/webhook/7d6a1834-dd33-4b7b-8af4-b6b4719a0b97/J1a6Dwmk2cMZGs1b4273tj",
        },
      },
    }}
  >
    {children}
  </CustomSDKContext>
);
