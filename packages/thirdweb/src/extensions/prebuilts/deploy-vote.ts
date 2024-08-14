import type { Chain } from "src/chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { deployViaAutoFactory } from "../../contract/deployment/deploy-via-autofactory.js";
import { getOrDeployInfraForPublishedContract } from "../../contract/deployment/utils/bootstrap.js";
import type { FileOrBufferOrString } from "../../storage/upload/types.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChainAndAccount } from "../../utils/types.js";
import { decimals } from "../erc20/read/decimals.js";

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
   * This amount that you have to enter is _not_ in wei. If you want users to have a least 0.5 ERC20 token to create proposals,
   * enter `"0.5"`. The deploy script will fetch the ERC20 token's decimals and do the unit conversion for you.
   */
  initialProposalThreshold: string;
  /**
   * The fraction of the total voting power that is required for a proposal to pass.
   * A value of 0 indicates that no voting power is sufficient,
   * whereas a value of 100 indicates that the entirety of voting power must vote for a proposal to pass.
   */
  initialVoteQuorumFraction: bigint;
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
 *    initialProposalThreshold: "0.5", // user needs 0.5 <token> to vote
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

async function getInitializeTransaction(options: {
  client: ThirdwebClient;
  implementationContract: ThirdwebContract;
  params: VoteContractParams;
  accountAddress: string;
  chain: Chain;
}) {
  const { client, implementationContract, params, chain } = options;
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
  const tokenErc20Contract = getContract({
    address: token,
    client,
    chain,
  });

  /**
   * A good side effect for checking for token decimals (instead of just taking in value in wei)
   * is that it validates the token address that user entered. In case they enter an invalid ERC20 contract address,
   * the extension will throw.
   */
  const _decimals = await decimals({ contract: tokenErc20Contract });
  if (!_decimals) {
    throw new Error(`Could not fetch decimals for contract: ${token}`);
  }
  const [{ toUnits }, { upload }, { initialize }] = await Promise.all([
    import("../../utils/units.js"),
    import("../../storage/upload.js"),
    import("./__generated__/VoteERC20/write/initialize.js"),
  ]);
  const initialProposalThresholdInWei = toUnits(
    initialProposalThreshold,
    _decimals,
  );
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
    // Make sure the final value passed to `initialProposalThreshold` is in wei
    initialProposalThreshold: initialProposalThresholdInWei,
    initialVoteQuorumFraction,
    initialVotingDelay: initialVotingDelay || 0n,
    initialVotingPeriod,
    contractURI,
    trustedForwarders: params.trustedForwarders || [],
  });
}
