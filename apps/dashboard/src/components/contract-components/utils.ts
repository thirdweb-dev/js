import { Polygon } from "@thirdweb-dev/chains";
import {
  type Abi,
  type AddContractInput,
  type FeatureName,
  type ValidContractInstance,
  detectFeatures as detectFeaturesFromSdk,
  isExtensionEnabled,
} from "@thirdweb-dev/sdk";
import type { Signer } from "ethers";
import { getDashboardChainRpc } from "lib/rpc";
import { getThirdwebSDK } from "lib/sdk";

export function detectFeatures<TContract extends ValidContractInstance | null>(
  contract: ValidContractInstance | null | undefined,
  features: FeatureName[],
  strategy: "any" | "all" = "any",
): contract is TContract {
  if (!contract) {
    return false;
  }
  if (!("abi" in contract)) {
    return false;
  }

  const extensions = detectFeaturesFromSdk(contract.abi as Abi);

  if (strategy === "any") {
    return features.some((feature) =>
      isExtensionEnabled(contract.abi as Abi, feature, extensions),
    );
  }

  return features.every((feature) =>
    isExtensionEnabled(contract.abi as Abi, feature, extensions),
  );
}

export function getGaslessPolygonSDK(signer?: Signer) {
  const polygonSDK = getThirdwebSDK(
    Polygon.chainId,
    getDashboardChainRpc(Polygon),
    {
      gasless: {
        engine: {
          relayerUrl:
            "https://checkout.engine.thirdweb.com/relayer/0c2bdd3a-307f-4243-b6e5-5ba495222d2b",
          relayerForwarderAddress: "0x409d530a6961297ece29121dbee2c917c3398659",
        },
        experimentalChainlessSupport: true,
      },
    },
    signer,
  );

  return polygonSDK;
}

// TODO - instead of util - create a hook for this to avoid requiring signer
export async function addContractToMultiChainRegistry(
  contractData: AddContractInput,
  signer?: Signer,
) {
  const gaslessPolygonSDK = getGaslessPolygonSDK(signer);
  await gaslessPolygonSDK.multiChainRegistry.addContract(contractData);
}
