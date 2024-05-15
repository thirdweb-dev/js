import type { ThirdwebClient } from "../../client/client.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import { deployViaAutoFactory } from "../../contract/deployment/deploy-via-autofactory.js";
import { getOrDeployInfraForPublishedContract } from "../../contract/deployment/utils/bootstrap.js";
import { upload } from "../../storage/upload.js";
import type { FileOrBufferOrString } from "../../storage/upload/types.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChainAndAccount } from "../../utils/types.js";
import { initialize as initDropERC1155 } from "./__generated__/DropERC1155/write/initialize.js";
import { initialize as initTokenERC1155 } from "./__generated__/TokenERC1155/write/initialize.js";

export type ERC1155ContractType = "DropERC1155" | "TokenERC1155";

export type ERC1155ContractParams = {
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
  royaltyRecipient?: string;
  royaltyBps?: bigint;
  trustedForwarders?: string[];
};

export type DeployERC1155ContractOptions = Prettify<
  ClientAndChainAndAccount & {
    type: ERC1155ContractType;
    params: ERC1155ContractParams;
  }
>;

/**
 * Deploys an thirdweb ERC1155 contract of the given type.
 * On chains where the thirdweb infrastructure contracts are not deployed, this function will deploy them as well.
 * @param options - The deployment options.
 * @returns The deployed contract address.
 * @extension DEPLOY
 * @example
 * ```ts
 * import { deployERC1155Contract } from "thirdweb/deploys";
 * const contractAddress = await deployERC1155Contract({
 *  chain,
 *  client,
 *  account,
 *  type: "DropERC1155",
 *  params: {
 *    name: "MyEdition",
 *    description: "My edition contract",
 *    symbol: "ME",
 * });
 * ```
 */
export async function deployERC1155Contract(
  options: DeployERC1155ContractOptions,
) {
  const { chain, client, account, type, params } = options;
  const { cloneFactoryContract, implementationContract } =
    await getOrDeployInfraForPublishedContract({
      chain,
      client,
      account,
      contractId: type,
      constructorParams: [],
    });
  const initializeTransaction = await getInitializeTransaction({
    client,
    implementationContract,
    type,
    params,
    accountAddress: account.address,
  });

  return deployViaAutoFactory({
    client,
    chain,
    account,
    cloneFactoryContract,
    initializeTransaction,
  });
}

async function getInitializeTransaction(options: {
  client: ThirdwebClient;
  implementationContract: ThirdwebContract;
  type: ERC1155ContractType;
  params: ERC1155ContractParams;
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
          name: params.name,
          description: params.description,
          symbol: params.symbol,
          image: params.image,
          external_link: params.external_link,
          social_urls: params.social_urls,
          seller_fee_basis_points: params.royaltyBps,
          fee_recipient: params.royaltyRecipient,
        },
      ],
    })) ||
    "";
  switch (type) {
    case "DropERC1155":
      return initDropERC1155({
        contract: implementationContract,
        name: params.name || "",
        symbol: params.symbol || "",
        contractURI,
        defaultAdmin: params.defaultAdmin || accountAddress,
        saleRecipient: params.saleRecipient || accountAddress,
        platformFeeBps: params.platformFeeBps || 0n,
        platformFeeRecipient: params.platformFeeRecipient || accountAddress,
        royaltyRecipient: params.royaltyRecipient || accountAddress,
        royaltyBps: params.royaltyBps || 0n,
        trustedForwarders: params.trustedForwarders || [],
      });
    case "TokenERC1155":
      return initTokenERC1155({
        contract: implementationContract,
        name: params.name || "",
        symbol: params.symbol || "",
        contractURI,
        defaultAdmin: params.defaultAdmin || accountAddress,
        primarySaleRecipient: params.saleRecipient || accountAddress,
        platformFeeBps: params.platformFeeBps || 0n,
        platformFeeRecipient: params.platformFeeRecipient || accountAddress,
        royaltyRecipient: params.royaltyRecipient || accountAddress,
        royaltyBps: params.royaltyBps || 0n,
        trustedForwarders: params.trustedForwarders || [],
      });
  }
}
