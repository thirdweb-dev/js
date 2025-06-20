import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import { deployViaAutoFactory } from "../../contract/deployment/deploy-via-autofactory.js";
import { getOrDeployInfraForPublishedContract } from "../../contract/deployment/utils/bootstrap.js";
import type { FileOrBufferOrString } from "../../storage/upload/types.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChainAndAccount } from "../../utils/types.js";
import { decimals } from "../erc20/read/decimals.js";

/**
 * @extension DEPLOY
 */
type VoteContractParams = {
  name: string;
  /**
   * The contract address for the ERC20 that will be used as voting power
   */
  tokenAddress: string;
  /**
   * The number of blocks after a proposal is created that voting on the proposal starts.
   * A block is a series of blockchain transactions and occurs every ~1 seconds.
   * Block time is different across EVM networks
   *
   * Defaults to 0 (zero)
   */
  initialVotingDelay?: number;
  /**
   * The number of blocks that voters have to vote on any new proposal.
   */
  initialVotingPeriod: number;
  /**
   * The minimum number of voting tokens a wallet needs in order to create proposals.
   * This amount that you have to enter is _not_ in wei. If you want users to have a least 0.5 ERC20 token to create proposals,
   * enter `"0.5"` or `0.5`. The deploy script will fetch the ERC20 token's decimals and do the unit conversion for you.
   */
  initialProposalThreshold: string | number;
  /**
   * The fraction of the total voting power that is required for a proposal to pass.
   * A value of 0 indicates that no voting power is sufficient,
   * whereas a value of 100 indicates that the entirety of voting power must vote for a proposal to pass.
   * `initialProposalThreshold` should be an integer or an integer-convertoble string. For example:
   * - 51 or "51" is a valid input
   * - 51.225 or "51.225" is an invalid input
   */
  minVoteQuorumRequiredPercent: number | string;
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
type DeployVoteContractOptions = Prettify<
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
 *    tokenAddress: "0x...",
 *    // user needs 0.5 <token> to create proposal
 *    initialProposalThreshold: "0.5",
 *    // vote expires 10 blocks later
 *    initialVotingPeriod: 10,
 *    // Requires 51% of users who voted, voted "For", for this proposal to pass
 *    minVoteQuorumRequiredPercent: 51,
 *  }
 * });
 * ```
 */
export async function deployVoteContract(options: DeployVoteContractOptions) {
  const { chain, client, account, params } = options;
  const { cloneFactoryContract, implementationContract } =
    await getOrDeployInfraForPublishedContract({
      account,
      chain,
      client,
      contractId: "VoteERC20",
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
    tokenAddress,
    initialProposalThreshold,
    minVoteQuorumRequiredPercent,
    initialVotingDelay,
    initialVotingPeriod,
    description,
    symbol,
    image,
    external_link,
    social_urls,
  } = params;

  // Validate initialVoteQuorumFraction
  const _num = Number(minVoteQuorumRequiredPercent);
  if (Number.isNaN(_num)) {
    throw new Error(
      `${minVoteQuorumRequiredPercent} is not a valid minVoteQuorumRequiredPercent`,
    );
  }
  if (_num < 0 || _num > 100) {
    throw new Error("minVoteQuorumRequiredPercent must be >= 0 and <= 100");
  }

  // Make sure if user is passing a float, it should only have 2 digit after the decimal point
  if (!Number.isInteger(_num)) {
    throw new Error(
      `${_num} is an invalid value. Only integer-like values accepted`,
    );
  }

  const initialVoteQuorumFraction = BigInt(_num);

  const tokenErc20Contract = getContract({
    address: tokenAddress,
    chain,
    client,
  });

  /**
   * A good side effect for checking for token decimals (instead of just taking in value in wei)
   * is that it validates the token address that user entered. In case they enter an invalid ERC20 contract address,
   * the extension will throw.
   */
  const _decimals = await decimals({ contract: tokenErc20Contract });
  if (!_decimals) {
    throw new Error(`Could not fetch decimals for contract: ${tokenAddress}`);
  }
  const [{ toUnits }, { upload }, { initialize }] = await Promise.all([
    import("../../utils/units.js"),
    import("../../storage/upload.js"),
    import("./__generated__/VoteERC20/write/initialize.js"),
  ]);
  const initialProposalThresholdInWei = toUnits(
    String(initialProposalThreshold),
    _decimals,
  );
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
    // Make sure the final value passed to `initialProposalThreshold` is in wei
    initialProposalThreshold: initialProposalThresholdInWei,
    initialVoteQuorumFraction,
    initialVotingDelay: BigInt(initialVotingDelay || 0),
    initialVotingPeriod: BigInt(initialVotingPeriod),
    name,
    token: tokenAddress,
    trustedForwarders: params.trustedForwarders || [],
  });
}
