import type { ThirdwebClient } from "../../client/client.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import { deployViaAutoFactory } from "../../contract/deployment/deploy-via-autofactory.js";
import { getOrDeployInfraForPublishedContract } from "../../contract/deployment/utils/bootstrap.js";
import type { FileOrBufferOrString } from "../../storage/upload/types.js";
import { upload } from "../../storage/upload.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChainAndAccount } from "../../utils/types.js";
import { initialize as initLoyaltyCard } from "../erc721/__generated__/LoyaltyCard/write/initialize.js";
import { initialize as initDropERC721 } from "./__generated__/DropERC721/write/initialize.js";
import { initialize as initOpenEditionERC721 } from "./__generated__/OpenEditionERC721/write/initialize.js";
import { initialize as initTokenERC721 } from "./__generated__/TokenERC721/write/initialize.js";

/**
 * @extension DEPLOY
 */
export type ERC721ContractType =
  | "DropERC721"
  | "TokenERC721"
  | "OpenEditionERC721"
  | "LoyaltyCard";

/**
 * @extension DEPLOY
 */
export type ERC721ContractParams = {
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

/**
 * @extension DEPLOY
 */
export type DeployERC721ContractOptions = Prettify<
  ClientAndChainAndAccount & {
    type: ERC721ContractType;
    params: ERC721ContractParams;
  }
>;

/**
 * Deploys an thirdweb ERC721 contract of the given type.
 * On chains where the thirdweb infrastructure contracts are not deployed, this function will deploy them as well.
 * @param options - The deployment options.
 * @returns The deployed contract address.
 * @extension DEPLOY
 * @example
 * ```ts
 * import { deployERC721Contract } from "thirdweb/deploys";
 * const contractAddress = await deployERC721Contract({
 *  chain,
 *  client,
 *  account,
 *  type: "DropERC721",
 *  params: {
 *    name: "MyNFT",
 *    description: "My NFT contract",
 *    symbol: "NFT",
 * });
 * ```
 */
export async function deployERC721Contract(
  options: DeployERC721ContractOptions,
) {
  const { chain, client, account, type, params } = options;

  const { cloneFactoryContract, implementationContract } =
    await getOrDeployInfraForPublishedContract({
      account,
      chain,
      client,
      contractId: type,
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
  type: ERC721ContractType;
  params: ERC721ContractParams;
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
          fee_recipient: params.royaltyRecipient,
          image: params.image,
          name: params.name,
          seller_fee_basis_points: params.royaltyBps,
          social_urls: params.social_urls,
          symbol: params.symbol,
        },
      ],
    })) ||
    "";
  switch (type) {
    case "DropERC721":
      return initDropERC721({
        contract: implementationContract,
        contractURI,
        defaultAdmin: params.defaultAdmin || accountAddress,
        name: params.name || "",
        platformFeeBps: params.platformFeeBps || 0n,
        platformFeeRecipient: params.platformFeeRecipient || accountAddress,
        royaltyBps: params.royaltyBps || 0n,
        royaltyRecipient: params.royaltyRecipient || accountAddress,
        saleRecipient: params.saleRecipient || accountAddress,
        symbol: params.symbol || "",
        trustedForwarders: params.trustedForwarders || [],
      });
    case "TokenERC721":
      return initTokenERC721({
        contract: implementationContract,
        contractURI,
        defaultAdmin: params.defaultAdmin || accountAddress,
        name: params.name || "",
        platformFeeBps: params.platformFeeBps || 0n,
        platformFeeRecipient: params.platformFeeRecipient || accountAddress,
        royaltyBps: params.royaltyBps || 0n,
        royaltyRecipient: params.royaltyRecipient || accountAddress,
        saleRecipient: params.saleRecipient || accountAddress,
        symbol: params.symbol || "",
        trustedForwarders: params.trustedForwarders || [],
      });
    case "OpenEditionERC721":
      return initOpenEditionERC721({
        contract: implementationContract,
        contractURI,
        defaultAdmin: params.defaultAdmin || accountAddress,
        name: params.name || "",
        royaltyBps: params.royaltyBps || 0n,
        royaltyRecipient: params.royaltyRecipient || accountAddress,
        saleRecipient: params.saleRecipient || accountAddress,
        symbol: params.symbol || "",
        trustedForwarders: params.trustedForwarders || [],
      });
    case "LoyaltyCard":
      return initLoyaltyCard({
        contract: implementationContract,
        contractURI,
        defaultAdmin: params.defaultAdmin || accountAddress,
        name: params.name || "",
        platformFeeBps: params.platformFeeBps || 0n,
        platformFeeRecipient: params.platformFeeRecipient || accountAddress,
        royaltyBps: params.royaltyBps || 0n,
        royaltyRecipient: params.royaltyRecipient || accountAddress,
        saleRecipient: params.saleRecipient || accountAddress,
        symbol: params.symbol || "",
        trustedForwarders: params.trustedForwarders || [],
      });
  }
}
