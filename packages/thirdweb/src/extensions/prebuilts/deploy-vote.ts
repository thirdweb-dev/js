import type { ThirdwebClient } from "../../client/client.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import { deployViaAutoFactory } from "../../contract/deployment/deploy-via-autofactory.js";
import { getOrDeployInfraForPublishedContract } from "../../contract/deployment/utils/bootstrap.js";
import { upload } from "../../storage/upload.js";
import type { FileOrBufferOrString } from "../../storage/upload/types.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChainAndAccount } from "../../utils/types.js";
import { initialize } from "./__generated__/VoteERC20/write/initialize.js";

/**
 * @extension PREBUILT
 */
export type VoteContractParams = {
  name: string;
  /**
   * The contract address for the ERC20 that will be used as voting power
   */
  token: string;
  /**
   * The number of blocks after a proposal is created that voting on the proposal starts.
   * A block is a series of blockchain transactions and occurs every ~1 seconds.
   * Block time is different across EVM networks
   *
   * Defaults to 0 (zero)
   */
  initialVotingDelay?: bigint;
  /**
   * The number of blocks that voters have to vote on any new proposal.
   */
  initialVotingPeriod: bigint;
  /**
   * The minimum number of voting tokens a wallet needs in order to create proposals.
   */
  initialProposalThreshold: bigint;
  /**
   * The fraction of the total voting power that is required for a proposal to pass.
   * A value of 0 indicates that no voting power is sufficient,
   * whereas a value of 100 indicates that the entirety of voting power must vote for a proposal to pass.
   */
  initialVoteQuorumFraction: bigint;
  // === irrelevant === //
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
export type DeployVoteContractOptions = Prettify<
  ClientAndChainAndAccount & {
    params: VoteContractParams;
  }
>;

/**
 * Deploys a thirdweb [`VoteERC20 contract`](https://thirdweb.com/thirdweb.eth/VoteERC20)
 * On chains where the thirdweb infrastructure contracts are not deployed, this function will deploy them as well.
 * @param options - The deployment options.
 * @returns The deployed contract address.
 * @extension DEPLOY
 *
 * @example
 * ```ts
 * import { deployVoteContract } from "thirdweb/deploys";
 * const contractAddress = await deployVoteContract({
 *  chain,
 *  client,
 *  account,
 *  params: {
 *    token: "0x...",
 *    initialProposalThreshold: 1n, // user needs 1 <token> to vote
 *    initialVotingPeriod: 10n, // vote expires 10 blocks later
 *    initialVoteQuorumFraction: 12n,
 *  }
 * });
 * ```
 */
export async function deployVoteContract(options: DeployVoteContractOptions) {
  const { chain, client, account, params } = options;
  const { cloneFactoryContract, implementationContract } =
    await getOrDeployInfraForPublishedContract({
      chain,
      client,
      account,
      contractId: "VoteERC20",
      constructorParams: [],
    });
  const initializeTransaction = await getInitializeTransaction({
    client,
    implementationContract,
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
  params: VoteContractParams;
  accountAddress: string;
}) {
  const { client, implementationContract, params } = options;
  const {
    name,
    token,
    initialProposalThreshold,
    initialVoteQuorumFraction,
    initialVotingDelay,
    initialVotingPeriod,
    description,
    symbol,
    image,
    external_link,
    social_urls,
  } = params;
  const contractURI =
    params.contractURI ||
    (await upload({
      client,
      files: [
        {
          name,
          description,
          symbol,
          image,
          external_link,
          social_urls,
        },
      ],
    })) ||
    "";
  return initialize({
    contract: implementationContract,
    name,
    token,
    initialProposalThreshold,
    initialVoteQuorumFraction,
    initialVotingDelay: initialVotingDelay || 0n,
    initialVotingPeriod,
    contractURI,
    trustedForwarders: params.trustedForwarders || [],
  });
}
