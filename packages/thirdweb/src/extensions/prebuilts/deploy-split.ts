import type { ThirdwebClient } from "../../client/client.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import { deployViaAutoFactory } from "../../contract/deployment/deploy-via-autofactory.js";
import { getOrDeployInfraForPublishedContract } from "../../contract/deployment/utils/bootstrap.js";
import type { FileOrBufferOrString } from "../../storage/upload/types.js";
import { upload } from "../../storage/upload.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChainAndAccount } from "../../utils/types.js";
import { initialize } from "./__generated__/Split/write/initialize.js";

/**
 * @extension DEPLOY
 */
export type SplitContractParams = {
  name: string;

  /**
   * An array of strings containing wallet addresses of the recipients
   * For example:
   * ```ts
   * ["0x...123", "0x...456"]
   * ```
   */
  payees: string[];
  /**
   * An array of bigints containing the shared percentages of each respective payees.
   * Must have the same length as `payees`
   * @example
   * ```ts
   * [
   *   5100n, // 51%
   *   4900n, // 49%
   * ]
   * ```
   */
  shares: bigint[];
  description?: string;
  image?: FileOrBufferOrString;
  external_link?: string;
  social_urls?: Record<string, string>;
  symbol?: string;
  contractURI?: string;
  defaultAdmin?: string;
  trustedForwarders?: string[];
};

/**
 * @extension DEPLOY
 */
export type DeploySplitContractOptions = Prettify<
  ClientAndChainAndAccount & {
    params: SplitContractParams;
  }
>;

/**
 * Deploys a thirdweb [`Split contract`](https://thirdweb.com/thirdweb.eth/Split)
 * On chains where the thirdweb infrastructure contracts are not deployed, this function will deploy them as well.
 * @param options - The deployment options.
 * @returns The deployed contract address.
 * @extension DEPLOY
 *
 * @example
 * ```ts
 * import { deploySplitContract } from "thirdweb/deploys";
 * const contractAddress = await deploySplitContract({
 *  chain,
 *  client,
 *  account,
 *  params: {
 *    name: "Split contract",
 *    payees: ["0x...123", "0x...456"],
 *    shares: [5100, 4900], // See type `SplitContractParams` for more context
 *  },
 * });
 * ```
 */
export async function deploySplitContract(options: DeploySplitContractOptions) {
  const { chain, client, account, params } = options;
  const { cloneFactoryContract, implementationContract } =
    await getOrDeployInfraForPublishedContract({
      account,
      chain,
      client,
      contractId: "Split",
    });
  const initializeTransaction = await getInitializeTransaction({
    accountAddress: account.address,
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

async function getInitializeTransaction(options: {
  client: ThirdwebClient;
  implementationContract: ThirdwebContract;
  params: SplitContractParams;
  accountAddress: string;
}) {
  const { client, implementationContract, params, accountAddress } = options;
  const {
    name,
    description,
    symbol,
    image,
    external_link,
    social_urls,
    payees,
    shares,
  } = params;
  const contractURI =
    params.contractURI ||
    (await upload({
      client,
      files: [
        {
          description,
          external_link,
          image,
          name,
          social_urls,
          symbol,
        },
      ],
    })) ||
    "";
  return initialize({
    contract: implementationContract,
    contractURI,
    defaultAdmin: params.defaultAdmin || accountAddress,
    payees,
    shares,
    trustedForwarders: params.trustedForwarders || [],
  });
}
