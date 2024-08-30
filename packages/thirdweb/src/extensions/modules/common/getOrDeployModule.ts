import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getOrDeployInfraContract } from "../../../contract/deployment/utils/bootstrap.js";
import { getDeployedInfraContract } from "../../../contract/deployment/utils/infra.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";

export const getOrDeployModule = async (options: {
  client: ThirdwebClient;
  chain: Chain;
  account: Account;
  contractId: string;
  publisher?: string;
  constructorParams?: unknown[];
}) => {
  const { client, chain, account, contractId, publisher, constructorParams } =
    options;
  const contract = await getOrDeployInfraContract({
    client,
    chain,
    account,
    contractId,
    publisher,
    constructorParams: constructorParams ?? [],
  });
  return contract;
};

export const getDeployedModule = (options: {
  client: ThirdwebClient;
  chain: Chain;
  contractId: string;
  publisher?: string;
  constructorParams?: unknown[];
}) => {
  const { client, chain, contractId, publisher, constructorParams } = options;
  return getDeployedInfraContract({
    client,
    chain,
    contractId,
    publisher,
    constructorParams: constructorParams ?? [],
  });
};
