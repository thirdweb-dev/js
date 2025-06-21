import type { ThirdwebClient } from "../../client/client.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import { deployViaAutoFactory } from "../../contract/deployment/deploy-via-autofactory.js";
import { getOrDeployInfraForPublishedContract } from "../../contract/deployment/utils/bootstrap.js";
import type { FileOrBufferOrString } from "../../storage/upload/types.js";
import { upload } from "../../storage/upload.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChainAndAccount } from "../../utils/types.js";
import { initialize as initDropERC20 } from "./__generated__/DropERC20/write/initialize.js";
import { initialize as initTokenERC20 } from "./__generated__/TokenERC20/write/initialize.js";

export type ERC20ContractType = "DropERC20" | "TokenERC20";

/**
 * @extension DEPLOY
 */
export type ERC20ContractParams = {
  name: string;
  description?: string;
  image?: FileOrBufferOrString;
  external_link?: string;
  social_urls?: Record<string, string>;
  symbol?: string;
  contractURI?: string;
  defaultAdmin?: string;
  saleRecipient?: string;
  platformFeeBps?: bigint;
  platformFeeRecipient?: string;
  trustedForwarders?: string[];
};

/**
 * @extension DEPLOY
 */
export type DeployERC20ContractOptions = Prettify<
  ClientAndChainAndAccount & {
    type: ERC20ContractType;
    params: ERC20ContractParams;
    publisher?: string;
  }
>;

/**
 * Deploys an thirdweb ERC20 contract of the given type.
 * On chains where the thirdweb infrastructure contracts are not deployed, this function will deploy them as well.
 * @param options - The deployment options.
 * @returns The deployed contract address.
 * @extension DEPLOY
 * @example
 * ```ts
 * import { deployERC20Contract } from "thirdweb/deploys";
 * const contractAddress = await deployERC20Contract({
 *  chain,
 *  client,
 *  account,
 *  type: "TokenERC20",
 *  params: {
 *    name: "MyToken",
 *    description: "My Token contract",
 *    symbol: "MT",
 * });
 * ```
 */
export async function deployERC20Contract(options: DeployERC20ContractOptions) {
  const { chain, client, account, type, params, publisher } = options;
  const { cloneFactoryContract, implementationContract } =
    await getOrDeployInfraForPublishedContract({
      account,
      chain,
      client,
      contractId: type,
      publisher,
    });
  const initializeTransaction = await getInitializeTransaction({
    accountAddress: account.address,
    client,
    implementationContract,
    params,
    type,
  });

  return deployViaAutoFactory({
    account,
    chain,
    client,
    cloneFactoryContract,
    initializeTransaction,
  });
}

async function getInitializeTransaction(options: {
  client: ThirdwebClient;
  implementationContract: ThirdwebContract;
  type: ERC20ContractType;
  params: ERC20ContractParams;
  accountAddress: string;
}) {
  const { client, implementationContract, type, params, accountAddress } =
    options;
  const contractURI =
    options.params.contractURI ||
    (await upload({
      client,
      files: [
        {
          description: params.description,
          external_link: params.external_link,
          image: params.image,
          name: params.name,
          social_urls: params.social_urls,
          symbol: params.symbol,
        },
      ],
    })) ||
    "";
  switch (type) {
    case "DropERC20":
      return initDropERC20({
        contract: implementationContract,
        contractURI,
        defaultAdmin: params.defaultAdmin || accountAddress,
        name: params.name || "",
        platformFeeBps: params.platformFeeBps || 0n,
        platformFeeRecipient: params.platformFeeRecipient || accountAddress,
        saleRecipient: params.saleRecipient || accountAddress,
        symbol: params.symbol || "",
        trustedForwarders: params.trustedForwarders || [],
      });
    case "TokenERC20":
      return initTokenERC20({
        contract: implementationContract,
        contractURI,
        defaultAdmin: params.defaultAdmin || accountAddress,
        name: params.name || "",
        platformFeeBps: params.platformFeeBps || 0n,
        platformFeeRecipient: params.platformFeeRecipient || accountAddress,
        primarySaleRecipient: params.saleRecipient || accountAddress,
        symbol: params.symbol || "",
        trustedForwarders: params.trustedForwarders || [],
      });
  }
}
