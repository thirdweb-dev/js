import { prepareAutoFactoryDeployTransaction } from "../../contract/deployment/deploy-via-autofactory.js";
import { getDeployedCloneFactoryContract } from "../../contract/deployment/utils/clone-factory.js";
import { getDeployedInfraContract } from "../../contract/deployment/utils/infra.js";
import { parseEventLogs } from "../../event/actions/parse-logs.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import type { ClientAndChainAndAccount } from "../../utils/types.js";
import { proxyDeployedEvent } from "../thirdweb/__generated__/IContractFactory/events/ProxyDeployed.js";
import { initialize } from "./__generated__/DropERC721/write/initialize.js";

export type DeployNFTDropParams = {
  name: string;
  symbol?: string;
  contractURI?: string;
  defaultAdmin?: string;
  saleRecipient?: string;
  platformFeeBps?: bigint;
  platformFeeRecipient?: string;
  royaltyRecipient?: string;
  royaltyBps?: bigint;
  trustedForwarders?: string[];
};

/**
 * TODO docs
 * @internal
 */
export async function deployNFTDrop(
  options: ClientAndChainAndAccount & { params: DeployNFTDropParams },
) {
  const { chain, client, account, params } = options;
  const [cloneFactoryContract, implementationContract] = await Promise.all([
    getDeployedCloneFactoryContract({
      chain,
      client,
    }),
    getDeployedInfraContract({
      chain,
      client,
      contractId: "DropERC721",
      constructorParams: [],
    }),
  ]);

  if (!implementationContract || !cloneFactoryContract) {
    throw new Error(
      `Infrastructure contracts not deployed on chain ${options.chain.id}, please run bootstrapOnchainInfra().`,
    );
  }
  const initializeTransaction = initialize({
    contract: implementationContract,
    name: params.name || "",
    symbol: params.symbol || "",
    contractURI: params.contractURI || "",
    defaultAdmin: params.defaultAdmin || account.address,
    saleRecipient: params.saleRecipient || account.address,
    platformFeeBps: params.platformFeeBps || 0n,
    platformFeeRecipient: params.platformFeeRecipient || account.address,
    royaltyRecipient: params.royaltyRecipient || account.address,
    royaltyBps: params.royaltyBps || 0n,
    trustedForwarders: params.trustedForwarders || [],
  });

  const tx = prepareAutoFactoryDeployTransaction({
    chain,
    client,
    cloneFactoryContract,
    initializeTransaction,
  });
  const receipt = await sendAndConfirmTransaction({
    transaction: tx,
    account,
  });
  const decodedEvent = parseEventLogs({
    events: [proxyDeployedEvent()],
    logs: receipt.logs,
  });
  return decodedEvent[0]?.args.proxy;
}
