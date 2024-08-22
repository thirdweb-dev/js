import {
  type Abi,
  type AddContractInput,
  type FeatureName,
  type ValidContractInstance,
  detectFeatures as detectFeaturesFromSdk,
  isExtensionEnabled,
} from "@thirdweb-dev/sdk";
import { MULTICHAIN_REGISTRY_CONTRACT } from "constants/contracts";
import {
  DASHBOARD_ENGINE_RELAYER_URL,
  DASHBOARD_FORWARDER_ADDRESS,
} from "constants/misc";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
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

export async function addContractToMultiChainRegistry(
  contractData: AddContractInput,
  account: Account,
  gasOverride?: bigint,
) {
  const transaction = prepareContractCall({
    contract: MULTICHAIN_REGISTRY_CONTRACT,
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
      relayerUrl: DASHBOARD_ENGINE_RELAYER_URL,
      relayerForwarderAddress: DASHBOARD_FORWARDER_ADDRESS,
    },
  });
}
