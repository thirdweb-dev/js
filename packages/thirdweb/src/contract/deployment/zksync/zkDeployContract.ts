import type { Abi } from "abitype";
import { encodeDeployData } from "viem/zksync";
import { parseEventLogs } from "../../../event/actions/parse-logs.js";
import { contractDeployedEvent } from "../../../extensions/zksync/__generated__/ContractDeployer/events/ContractDeployed.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { prepareTransaction } from "../../../transaction/prepare-transaction.js";
import { normalizeFunctionParams } from "../../../utils/abi/normalizeFunctionParams.js";
import { CONTRACT_DEPLOYER_ADDRESS } from "../../../utils/any-evm/zksync/constants.js";
import { ensureBytecodePrefix } from "../../../utils/bytecode/prefix.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import type { ClientAndChainAndAccount } from "../../../utils/types.js";
import { zkDeployContractDeterministic } from "./zkDeployDeterministic.js";

/**
 * @internal
 */
export async function zkDeployContract(
  options: ClientAndChainAndAccount & {
    abi: Abi;
    bytecode: Hex;
    params?: Record<string, unknown>;
    salt?: string;
    deploymentType?: "create" | "create2";
  },
) {
  const bytecode = ensureBytecodePrefix(options.bytecode);

  if (options.salt !== undefined) {
    // if a salt is provided, use the deterministic deployer
    return zkDeployContractDeterministic(options);
  }

  const data = encodeDeployData({
    abi: options.abi,
    args: normalizeFunctionParams(
      options.abi.find((abi) => abi.type === "constructor"),
      options.params,
    ),
    bytecode,
    deploymentType: options.deploymentType ?? "create",
  });

  const receipt = await sendAndConfirmTransaction({
    account: options.account,
    transaction: prepareTransaction({
      chain: options.chain,
      client: options.client,
      data,
      eip712: {
        factoryDeps: [bytecode],
        // TODO (zksync): allow passing in a paymaster
      },
      to: CONTRACT_DEPLOYER_ADDRESS,
    }),
  });

  const events = parseEventLogs({
    events: [contractDeployedEvent()],
    logs: receipt.logs,
  });

  const contractAddress = events[0]?.args.contractAddress;

  if (!contractAddress) {
    throw new Error("Contract creation failed");
  }
  return contractAddress;
}
