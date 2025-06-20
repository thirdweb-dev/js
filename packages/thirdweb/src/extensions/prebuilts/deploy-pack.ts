import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import { deployViaAutoFactory } from "../../contract/deployment/deploy-via-autofactory.js";
import {
  getOrDeployInfraContract,
  getOrDeployInfraForPublishedContract,
} from "../../contract/deployment/utils/bootstrap.js";
import type { FileOrBufferOrString } from "../../storage/upload/types.js";
import { upload } from "../../storage/upload.js";
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
 * @deprecated [Pack contract is incompatible with Pectra update. Support for this contract is being removed in next release.]
 *
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
      account,
      chain,
      client,
      contractId: "WETH9",
    }),
    getOrDeployInfraContract({
      account,
      chain,
      client,
      contractId: "ForwarderEOAOnly",
    }),
  ]);
  const { cloneFactoryContract, implementationContract } =
    await getOrDeployInfraForPublishedContract({
      account,
      chain,
      client,
      constructorParams: {
        nativeTokenWrapper: WETH.address,
        trustedForwarder: forwarder.address,
      },
      contractId: "Pack",
    });
  const initializeTransaction = await getInitializeTransaction({
    accountAddress: account.address,
    chain,
    client,
    implementationContract,
    params,
  });

  return deployViaAutoFactory({
    account,
    chain,
    client,
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
          description: params.description,
          external_link: params.external_link,
          image: params.image,
          name: params.name,
          social_urls: params.social_urls,
          symbol: params.symbol || "",
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
    contractURI,
    defaultAdmin: params.defaultAdmin || accountAddress,
    name: params.name,
    royaltyBps,
    royaltyRecipient: params.royaltyRecipient || accountAddress,
    symbol: params.symbol || "",
    trustedForwarders: params.trustedForwarders || [],
  });
}
