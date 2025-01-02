import { MULTICHAIN_REGISTRY_CONTRACT } from "constants/contracts";
import {
  DASHBOARD_ENGINE_RELAYER_URL,
  DASHBOARD_FORWARDER_ADDRESS,
} from "constants/misc";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import type { Account } from "thirdweb/wallets";

type ContractInput = {
  address: string;
  chainId: number;
};

type AddContractInput = ContractInput & {
  metadataURI?: string;
};

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
