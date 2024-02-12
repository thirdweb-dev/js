import { Polygon } from "@thirdweb-dev/chains";
import { FeatureName } from "@thirdweb-dev/sdk/dist/declarations/src/evm/constants/contract-features";
import {
  Abi,
  AddContractInput,
  ValidContractInstance,
  isExtensionEnabled,
  detectFeatures as detectFeaturesFromSdk,
} from "@thirdweb-dev/sdk";
import { Signer } from "ethers";
import { getDashboardChainRpc } from "lib/rpc";
import { getEVMThirdwebSDK } from "lib/sdk";

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
  const polygonSDK = getEVMThirdwebSDK(
    Polygon.chainId,
    getDashboardChainRpc(Polygon),
    {
      gasless: {
        openzeppelin: {
          relayerUrl:
            "https://api.defender.openzeppelin.com/autotasks/dad61716-3624-46c9-874f-0e73f15f04d5/runs/webhook/7d6a1834-dd33-4b7b-8af4-b6b4719a0b97/FdHMqyF3p6MGHw6K2nkLsv",
          relayerForwarderAddress: "0x409D530A6961297ECE29121dbEE2c917c3398659",
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
