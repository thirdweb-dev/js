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
import { thirdwebClient } from "lib/thirdweb-client";
import {
  getContract,
  prepareContractCall,
  sendAndConfirmTransaction,
} from "thirdweb";
import { polygon } from "thirdweb/chains";
import type { Account } from "thirdweb/wallets";

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
    polygon.id,
    getDashboardChainRpc(polygon.id, undefined),
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

const contractAddress = "0xcdAD8FA86e18538aC207872E8ff3536501431B73";
const registry = getContract({
  chain: polygon,
  client: thirdwebClient,
  address: contractAddress,
});
export async function addContractToMultiChainRegistry(
  contractData: AddContractInput,
  account: Account,
  gasOverride?: bigint,
) {
  const transaction = prepareContractCall({
    contract: registry,
    method: "function add(address, address, uint256, string)",
    params: [
      account.address,
      contractData.address,
      BigInt(contractData.chainId),
      contractData.metadataURI || "",
    ],
  });

  await sendAndConfirmTransaction({
    transaction: {
      ...transaction,
      gas: gasOverride || transaction.gas,
    },
    account,
    gasless: {
      experimentalChainlessSupport: true,
      provider: "engine",
      relayerUrl:
        "https://checkout.engine.thirdweb.com/relayer/0c2bdd3a-307f-4243-b6e5-5ba495222d2b",
      relayerForwarderAddress: "0x409d530a6961297ece29121dbee2c917c3398659",
    },
  });
}
