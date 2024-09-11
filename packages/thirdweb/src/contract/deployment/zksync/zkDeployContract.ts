import type { Abi } from "abitype";
import { encodeDeployData } from "viem/zksync";
import { parseEventLogs } from "../../../event/actions/parse-logs.js";
import { contractDeployedEvent } from "../../../extensions/zksync/__generated__/ContractDeployer/events/ContractDeployed.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { prepareTransaction } from "../../../transaction/prepare-transaction.js";
import { normalizeFunctionParams } from "../../../utils/abi/normalizeFunctionParams.js";
import { CONTRACT_DEPLOYER_ADDRESS } from "../../../utils/any-evm/zksync/constants.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import type { ClientAndChainAndAccount } from "../../../utils/types.js";

/**
 * @internal
 */
export async function zkDeployContract(
  options: ClientAndChainAndAccount & {
    abi: Abi;
    bytecode: Hex;
    params?: Record<string, unknown>;
  },
) {
  const data = encodeDeployData({
    abi: options.abi,
    bytecode: options.bytecode,
    deploymentType: "create",
    args: normalizeFunctionParams(
      options.abi.find((abi) => abi.type === "constructor"),
      options.params,
    ),
  });

  const receipt = await sendAndConfirmTransaction({
    account: options.account,
    transaction: prepareTransaction({
      chain: options.chain,
      client: options.client,
      to: CONTRACT_DEPLOYER_ADDRESS,
      data,
      eip712: {
        factoryDeps: [options.bytecode],
        // TODO (zksync): allow passing in a paymaster
      },
    }),
  });

  const events = parseEventLogs({
    logs: receipt.logs,
    events: [contractDeployedEvent()],
  });

  const contractAddress = events[0]?.args.contractAddress;
  if (!contractAddress) {
    throw new Error("Contract creation failed");
  }
  return contractAddress;
}
