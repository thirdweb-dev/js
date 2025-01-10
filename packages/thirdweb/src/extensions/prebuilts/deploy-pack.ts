import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import { deployViaAutoFactory } from "../../contract/deployment/deploy-via-autofactory.js";
import {
  getOrDeployInfraContract,
  getOrDeployInfraForPublishedContract,
} from "../../contract/deployment/utils/bootstrap.js";
import { upload } from "../../storage/upload.js";
import type { FileOrBufferOrString } from "../../storage/upload/types.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChainAndAccount } from "../../utils/types.js";
import { initialize } from "./__generated__/Pack/write/initialize.js";

/**
 * @extension DEPLOY
 */
export type PackContractParams = {
  /**
   * Name of the Pack contract
   */
  name: string;
  /**
   * Defaults to the deployer's address
   */
  royaltyRecipient?: string;
  /**
   * Defaults to 0 (zero)
   */
  royaltyBps?: number | string;

  description?: string;
  image?: FileOrBufferOrString;
  external_link?: string;
  social_urls?: Record<string, string>;
  /**
   * Defaults to an empty string ("")
   */
  symbol?: string;
  contractURI?: string;
  /**
   * Defaults to the deployer's address
   */
  defaultAdmin?: string;
  trustedForwarders?: string[];
};

/**
 * @extension DEPLOY
 */
export type DeployPackContractOptions = Prettify<
  ClientAndChainAndAccount & {
    params: PackContractParams;
  }
>;

/**
 * Deploy a thirdweb Pack contract
 * @param options params for deploying [`Pack contract`](https://thirdweb.com/thirdweb.eth/Pack)
 * @returns
 *
 * @example
 * ```ts
 * import { deployPackContract } from "thirdweb/extensions/deploy";
 *
 * const packAddress = await deployPackContract({
 *   account,
 *   client,
 *   chain,
 *   params: {
 *     name: "Pack contract name",
 *     symbol: "PACK1155",
 *   },
 * });
 * ```
 * @extension DEPLOY
 */
export async function deployPackContract(options: DeployPackContractOptions) {
  const { chain, client, account, params } = options;
  const [WETH, forwarder] = await Promise.all([
    getOrDeployInfraContract({
      chain,
      client,
      account,
      contractId: "WETH9",
    }),
    getOrDeployInfraContract({
      chain,
      client,
      account,
      contractId: "ForwarderEOAOnly",
    }),
  ]);
  const { cloneFactoryContract, implementationContract } =
    await getOrDeployInfraForPublishedContract({
      chain,
      client,
      account,
      contractId: "Pack",
      constructorParams: {
        nativeTokenWrapper: WETH.address,
        trustedForwarder: forwarder.address,
      },
    });
  const initializeTransaction = await getInitializeTransaction({
    client,
    implementationContract,
    params,
    accountAddress: account.address,
    chain,
  });

  return deployViaAutoFactory({
    client,
    chain,
    account,
    cloneFactoryContract,
    initializeTransaction,
  });
}

/**
 * @internal
 */
async function getInitializeTransaction(options: {
  client: ThirdwebClient;
  implementationContract: ThirdwebContract;
  params: PackContractParams;
  accountAddress: string;
  chain: Chain;
}) {
  const { params, implementationContract, accountAddress, client } = options;
  const contractURI =
    params.contractURI ||
    (await upload({
      client,
      files: [
        {
          name: params.name,
          description: params.description,
          symbol: params.symbol || "",
          image: params.image,
          external_link: params.external_link,
          social_urls: params.social_urls,
        },
      ],
    })) ||
    "";
  let royaltyBps = 0n;
  if (params.royaltyBps) {
    const numberVal = Number(params.royaltyBps);
    if (Number.isNaN(numberVal)) {
      throw new Error("royaltyBps: Invalid royaltyBps value");
    }
    if (numberVal < 0 || numberVal > 100) {
      throw new Error("royaltyBps: should be between 0 and 100");
    }
    // If is a float, make sure it only has 2 digit after the decimal point
    if (numberVal % 1 !== 0 && !/^\d+(\.\d{1,2})?$/.test(String(numberVal))) {
      throw new Error("royaltyBps: Maximum 2 decimal places allowed.");
    }
    royaltyBps = BigInt(numberVal * 100); // 21.12 -> 2112n
  }
  return initialize({
    contract: implementationContract,
    name: params.name,
    symbol: params.symbol || "",
    defaultAdmin: params.defaultAdmin || accountAddress,
    royaltyRecipient: params.royaltyRecipient || accountAddress,
    contractURI,
    trustedForwarders: params.trustedForwarders || [],
    royaltyBps,
  });
}
