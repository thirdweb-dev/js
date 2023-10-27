import type { IERC20, VoteERC20 } from "@thirdweb-dev/contracts-js";
import ERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC20.json";
import { ProposalCreatedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/VoteERC20";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  BigNumber,
  Contract,
  utils,
  type BigNumberish,
  type CallOverrides,
} from "ethers";
import { fetchCurrencyMetadata } from "../../common/currency/fetchCurrencyMetadata";
import { fetchCurrencyValue } from "../../common/currency/fetchCurrencyValue";
import { resolveAddress } from "../../common/ens/resolveAddress";
import { buildTransactionFunction } from "../../common/transactions";
import { ContractAppURI } from "../../core/classes/contract-appuri";
import { ContractEncoder } from "../../core/classes/contract-encoder";
import { ContractEvents } from "../../core/classes/contract-events";
import { ContractInterceptor } from "../../core/classes/contract-interceptor";
import { ContractMetadata } from "../../core/classes/contract-metadata";
import { ContractWrapper } from "../../core/classes/contract-wrapper";
import { GasCostEstimator } from "../../core/classes/gas-cost-estimator";
import { Transaction } from "../../core/classes/transactions";
import { UpdateableNetwork } from "../../core/interfaces/contract";
import { NetworkInput, TransactionResultWithId } from "../../core/types";
import { Abi, AbiInput, AbiSchema } from "../../schema/contracts/custom";
import { VoteContractSchema } from "../../schema/contracts/vote";
import { SDKOptions } from "../../schema/sdk-options";
import { Address } from "../../schema/shared/Address";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { CurrencyValue } from "../../types/currency";
import {
  Proposal,
  ProposalExecutable,
  ProposalVote,
  VoteSettings,
} from "../../types/vote";
import { VoteType } from "../../enums/vote/Vote";

/**
 * Create a decentralized organization for token holders to vote on proposals.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("{{chainName}}");
 * const contract = await sdk.getContract("{{contract_address}}", "vote");
 * ```
 *
 * @public
 */
export class Vote implements UpdateableNetwork {
  private contractWrapper: ContractWrapper<VoteERC20>;
  private storage: ThirdwebStorage;

  public abi: Abi;
  public metadata: ContractMetadata<VoteERC20, typeof VoteContractSchema>;
  public app: ContractAppURI<VoteERC20>;
  public encoder: ContractEncoder<VoteERC20>;
  public estimator: GasCostEstimator<VoteERC20>;
  public events: ContractEvents<VoteERC20>;
  /**
   * @internal
   */
  public interceptor: ContractInterceptor<VoteERC20>;

  private _chainId: number;
  get chainId() {
    return this._chainId;
  }

  constructor(
    network: NetworkInput,
    address: string,
    storage: ThirdwebStorage,
    options: SDKOptions = {},
    abi: AbiInput,
    chainId: number,
    contractWrapper = new ContractWrapper<VoteERC20>(
      network,
      address,
      abi,
      options,
      storage,
    ),
  ) {
    this._chainId = chainId;
    this.abi = AbiSchema.parse(abi || []);
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      VoteContractSchema,
      this.storage,
    );

    this.app = new ContractAppURI(
      this.contractWrapper,
      this.metadata,
      this.storage,
    );
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.events = new ContractEvents(this.contractWrapper);
    this.interceptor = new ContractInterceptor(this.contractWrapper);
  }

  onNetworkUpdated(network: NetworkInput) {
    this.contractWrapper.updateSignerOrProvider(network);
  }

  getAddress(): Address {
    return this.contractWrapper.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get a proposal by id.
   *
   * @param proposalId - The proposal id to get.
   * @returns - The proposal.
   */
  public async get(proposalId: BigNumberish): Promise<Proposal> {
    const all = await this.getAll();
    const proposals = all.filter((p) =>
      p.proposalId.eq(BigNumber.from(proposalId)),
    );
    if (proposals.length === 0) {
      throw new Error("proposal not found");
    }
    return proposals[0];
  }

  /**
   * Get All Proposals
   *
   * @remarks Get all the proposals in this contract.
   *
   * @example
   * ```javascript
   * const proposals = await contract.getAll();
   * console.log(proposals);
   * ```
   *
   * @returns - All the proposals in the contract.
   */
  public async getAll(): Promise<Proposal[]> {
    const _proposals =
      (await this.contractWrapper.read("getAllProposals", [])) ?? [];
    const _items = await Promise.all(
      _proposals.map((item) =>
        Promise.all([
          this.contractWrapper.read("state", [item.proposalId]),
          this.getProposalVotes(item.proposalId),
        ]),
      ),
    );
    return _items.map(([state, votes], index) => {
      const data = _proposals[index];
      return {
        proposalId: data.proposalId,
        proposer: data.proposer,
        description: data.description,
        startBlock: data.startBlock,
        endBlock: data.endBlock,
        state: state,
        votes: votes,
        executions: data[3].map((c, i) => ({
          toAddress: data.targets[i],
          nativeTokenValue: c,
          transactionData: data.calldatas[i],
        })),
      };
    });
  }

  /**
   * Get the votes for a specific proposal
   * @param proposalId - the proposalId
   */
  public async getProposalVotes(
    proposalId: BigNumber,
  ): Promise<ProposalVote[]> {
    const votes = await this.contractWrapper.read("proposalVotes", [
      proposalId,
    ]);
    return [
      {
        type: VoteType.Against,
        label: "Against",
        count: votes.againstVotes,
      },
      {
        type: VoteType.For,
        label: "For",
        count: votes.forVotes,
      },
      {
        type: VoteType.Abstain,
        label: "Abstain",
        count: votes.abstainVotes,
      },
    ];
  }

  /**
   * Check If Wallet Voted
   *
   * @remarks Check if a specified wallet has voted a specific proposal
   *
   * @example
   * ```javascript
   * // The proposal ID of the proposal you want to check
   * const proposalId = "0";
   * // The address of the wallet you want to check to see if they voted
   * const address = "{{wallet_address}}";
   *
   * await contract.hasVoted(proposalId, address);
   * ```
   *
   * @param proposalId - The unique identifier of a proposal .
   * @param account - (optional) wallet account address. Defaults to connected signer.
   * @returns - True if the account has already voted on the proposal.
   */
  public async hasVoted(
    proposalId: string,
    account?: AddressOrEns,
  ): Promise<boolean> {
    if (!account) {
      account = await this.contractWrapper.getSignerAddress();
    }
    return this.contractWrapper.read("hasVoted", [
      proposalId,
      await resolveAddress(account),
    ]);
  }

  /**
   * Can Execute
   *
   * @remarks Check if a proposal can be executed (if the proposal has succeeded).
   *
   * @example
   * ```javascript
   * // The proposal ID of the proposal you want to check
   * const proposalId = "0";
   * const canExecute = await contract.canExecute(proposalId);
   * console.log(canExecute);
   * ```
   *
   * @param proposalId - The proposal ID to check.
   * @returns - True if the proposal can be executed, false otherwise.
   */
  public async canExecute(proposalId: string): Promise<boolean> {
    await this.ensureExists(proposalId);

    const proposal = await this.get(proposalId);
    const tos = proposal.executions.map((p) => p.toAddress);
    const values = proposal.executions.map((p) => p.nativeTokenValue);
    const datas = proposal.executions.map((p) => p.transactionData);
    const descriptionHash = utils.id(proposal.description);
    try {
      await this.contractWrapper
        .callStatic()
        .execute(tos, values, datas, descriptionHash);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Check the balance of the project wallet in the native token of the chain
   *
   * @returns - The balance of the project in the native token of the chain
   */
  public async balance(): Promise<CurrencyValue> {
    const balance = await this.contractWrapper
      .getProvider()
      .getBalance(this.contractWrapper.address);
    return {
      name: "",
      symbol: "",
      decimals: 18,
      value: balance,
      displayValue: utils.formatUnits(balance, 18),
    };
  }

  /**
   * Check the balance of the project wallet in a particular
   * ERC20 token contract
   *
   * @returns - The balance of the project in the native token of the chain
   */
  public async balanceOfToken(
    tokenAddress: AddressOrEns,
  ): Promise<CurrencyValue> {
    const erc20 = new Contract(
      await resolveAddress(tokenAddress),
      ERC20Abi,
      this.contractWrapper.getProvider(),
    ) as IERC20;
    return await fetchCurrencyValue(
      this.contractWrapper.getProvider(),
      tokenAddress,
      await erc20.balanceOf(this.contractWrapper.address),
    );
  }

  /**
   * Find a proposal by its id.
   *
   * @internal
   * @param proposalId - Proposal to check for
   */
  private async ensureExists(proposalId: string): Promise<void> {
    try {
      await this.contractWrapper.read("state", [proposalId]);
    } catch (e) {
      throw Error(`Proposal ${proposalId} not found`);
    }
  }

  /**
   * Get the Vote contract configuration
   */
  public async settings(): Promise<VoteSettings> {
    const [
      votingDelay,
      votingPeriod,
      votingTokenAddress,
      votingQuorumFraction,
      proposalTokenThreshold,
    ] = await Promise.all([
      this.contractWrapper.read("votingDelay", []),
      this.contractWrapper.read("votingPeriod", []),
      this.contractWrapper.read("token", []),
      this.contractWrapper.read("quorumNumerator" as "quorumNumerator()", []),
      this.contractWrapper.read("proposalThreshold", []),
    ]);
    const votingTokenMetadata = await fetchCurrencyMetadata(
      this.contractWrapper.getProvider(),
      votingTokenAddress,
    );
    return {
      votingDelay: votingDelay.toString(),
      votingPeriod: votingPeriod.toString(),
      votingTokenAddress,
      votingTokenMetadata,
      votingQuorumFraction: votingQuorumFraction.toString(),
      proposalTokenThreshold: proposalTokenThreshold.toString(),
    };
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Create Proposal
   *
   * @remarks Create a new proposal for token holders to vote on.
   *
   * @example
   * ```javascript
   * // The description of the proposal you want to pass
   * const description = "This is a great proposal - vote for it!"
   * // You can (optionally) pass in contract calls that will get executed when the proposal is executed.
   * const executions = [
   *   {
   *     // The contract you want to make a call to
   *     toAddress: "0x...",
   *     // The amount of the native currency to send in this transaction
   *     nativeTokenValue: 0,
   *     // Transaction data that will be executed when the proposal is executed
   *     // This is an example transfer transaction with a token contract (which you would need to set up in code)
   *     transactionData: tokenContract.encoder.encode(
   *       "transfer", [
   *         fromAddress,
   *         amount,
   *       ]
   *     ),
   *   }
   * ]
   *
   * const proposal = await contract.propose(description, executions);
   * ```
   *
   * @param description - The description of the proposal.
   * @param executions - A set of executable transactions that will be run if the proposal is passed and executed.
   * @returns - The id of the created proposal and the transaction receipt.
   */
  propose = /* @__PURE__ */ buildTransactionFunction(
    async (
      description: string,
      executions?: ProposalExecutable[],
    ): Promise<Transaction<TransactionResultWithId>> => {
      if (!executions) {
        executions = [
          {
            toAddress: this.contractWrapper.address,
            nativeTokenValue: 0,
            transactionData: "0x",
          },
        ];
      }
      const tos = executions.map((p) => p.toAddress);
      const values = executions.map((p) => p.nativeTokenValue);
      const datas = executions.map((p) => p.transactionData);

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "propose",
        args: [tos, values, datas, description],
        parse: (receipt) => {
          const event = this.contractWrapper.parseLogs<ProposalCreatedEvent>(
            "ProposalCreated",
            receipt?.logs,
          );
          return {
            id: event[0].args.proposalId,
            receipt,
          };
        },
      });
    },
  );

  /**
   * Vote
   *
   * @remarks Vote on an active proposal
   *
   * @example
   * ```javascript
   * // The proposal ID of the proposal you want to vote on
   * const proposalId = "0";
   * // The vote type you want to cast, can be VoteType.Against, VoteType.For, or VoteType.Abstain
   * const voteType = VoteType.For;
   * // The (optional) reason for the vote
   * const reason = "I like this proposal!";
   *
   * await contract.vote(proposalId, voteType, reason);
   * ```
   * @param proposalId - The proposal to cast a vote on.
   * @param voteType - The position the voter is taking on their vote.
   * @param reason - (optional) The reason for the vote.
   */
  vote = /* @__PURE__ */ buildTransactionFunction(
    async (proposalId: string, voteType: VoteType, reason = "") => {
      await this.ensureExists(proposalId);
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "castVoteWithReason",
        args: [proposalId, voteType, reason],
      });
    },
  );

  /**
   * Execute Proposal
   *
   * @remarks Execute the related transactions for a proposal if the proposal succeeded.
   *
   * @example
   * ```javascript
   * // The proposal ID of the proposal you want to execute
   * const proposalId = "0"
   * await contract.execute(proposalId);
   * ```
   *
   * @param proposalId - The proposal id to execute.
   */
  execute = /* @__PURE__ */ buildTransactionFunction(
    async (proposalId: string) => {
      await this.ensureExists(proposalId);

      const proposal = await this.get(proposalId);
      const tos = proposal.executions.map((p) => p.toAddress);
      const values = proposal.executions.map((p) => p.nativeTokenValue);
      const datas = proposal.executions.map((p) => p.transactionData);
      const descriptionHash = utils.id(proposal.description);

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "execute",
        args: [tos, values, datas, descriptionHash],
      });
    },
  );

  /**
   * @internal
   */
  public async prepare<
    TMethod extends keyof VoteERC20["functions"] = keyof VoteERC20["functions"],
  >(
    method: string & TMethod,
    args: any[] & Parameters<VoteERC20["functions"][TMethod]>,
    overrides?: CallOverrides,
  ) {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method,
      args,
      overrides,
    });
  }

  /**
   * @internal
   */
  public async call<
    TMethod extends keyof VoteERC20["functions"] = keyof VoteERC20["functions"],
  >(
    functionName: string & TMethod,
    args?: Parameters<VoteERC20["functions"][TMethod]>,
    overrides?: CallOverrides,
  ): Promise<ReturnType<VoteERC20["functions"][TMethod]>> {
    return this.contractWrapper.call(functionName, args, overrides);
  }
}
