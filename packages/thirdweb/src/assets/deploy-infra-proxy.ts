import type { Hex } from "viem";
import type { ThirdwebContract } from "../contract/contract.js";
import { parseEventLogs } from "../event/actions/parse-logs.js";
import { assetInfraDeployedEvent } from "../extensions/assets/__generated__/AssetInfraDeployer/events/AssetInfraDeployed.js";
import { deployInfraProxyDeterministic } from "../extensions/assets/__generated__/AssetInfraDeployer/write/deployInfraProxyDeterministic.js";
import { sendAndConfirmTransaction } from "../transaction/actions/send-and-confirm-transaction.js";
import { keccakId } from "../utils/any-evm/keccak-id.js";
import type { ClientAndChainAndAccount } from "../utils/types.js";
import { DEFAULT_SALT } from "./constants.js";

export async function deployInfraProxy(
  options: ClientAndChainAndAccount & {
    assetFactory: ThirdwebContract;
    implementationAddress: string;
    initData: Hex;
    extraData: Hex;
  },
) {
  const transaction = deployInfraProxyDeterministic({
    contract: options.assetFactory,
    implementation: options.implementationAddress,
    data: options.initData,
    extraData: options.extraData,
    salt: keccakId(DEFAULT_SALT),
  });

  const receipt = await sendAndConfirmTransaction({
    transaction,
    account: options.account,
  });
  const proxyEvent = assetInfraDeployedEvent();
  const decodedEvent = parseEventLogs({
    events: [proxyEvent],
    logs: receipt.logs,
  });

  if (decodedEvent.length === 0 || !decodedEvent[0]) {
    throw new Error(
      `No AssetInfraDeployed event found in transaction: ${receipt.transactionHash}`,
    );
  }

  return decodedEvent[0]?.args.proxy;
}
