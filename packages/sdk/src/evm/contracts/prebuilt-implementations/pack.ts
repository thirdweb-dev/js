import type {
  IPackVRFDirect,
  Pack as PackContract,
} from "@thirdweb-dev/contracts-js";
import { PackUpdatedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/IPack";
import {
  ITokenBundle,
  PackCreatedEvent,
  PackOpenedEvent,
} from "@thirdweb-dev/contracts-js/dist/declarations/src/Pack";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  BigNumber,
  constants,
  utils,
  type BigNumberish,
  type CallOverrides,
} from "ethers";
import { QueryAllParams } from "../../../core/schema/QueryParams";
import { NFT } from "../../../core/schema/nft";
import { fetchCurrencyMetadata } from "../../common/currency/fetchCurrencyMetadata";
import { hasERC20Allowance } from "../../common/currency/hasERC20Allowance";
import { normalizePriceValue } from "../../common/currency/normalizePriceValue";
import { resolveAddress } from "../../common/ens/resolveAddress";
import { assertEnabled } from "../../common/feature-detection/assertEnabled";
import { detectContractFeature } from "../../common/feature-detection/detectContractFeature";
import { isTokenApprovedForTransfer } from "../../common/marketplace";
import { uploadOrExtractURI } from "../../common/nft";
import { getRoleHash } from "../../common/role";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_PACK_VRF } from "../../constants/thirdweb-features";
import { ContractAppURI } from "../../core/classes/contract-appuri";
import { ContractEncoder } from "../../core/classes/contract-encoder";
import { ContractEvents } from "../../core/classes/contract-events";
import { ContractInterceptor } from "../../core/classes/contract-interceptor";
import { ContractMetadata } from "../../core/classes/contract-metadata";
import { ContractOwner } from "../../core/classes/contract-owner";
import { ContractRoles } from "../../core/classes/contract-roles";
import { ContractRoyalty } from "../../core/classes/contract-royalty";
import { ContractWrapper } from "../../core/classes/contract-wrapper";
import { StandardErc1155 } from "../../core/classes/erc-1155-standard";
import { GasCostEstimator } from "../../core/classes/gas-cost-estimator";
import { PackVRF } from "../../core/classes/pack-vrf";
import { Transaction } from "../../core/classes/transactions";
import { NetworkInput, TransactionResultWithId } from "../../core/types";
import { Abi, AbiInput, AbiSchema } from "../../schema/contracts/custom";
import { PackContractSchema } from "../../schema/contracts/packs";
import { SDKOptions } from "../../schema/sdk-options";
import { Address } from "../../schema/shared/Address";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import {
  PackMetadataInput,
  PackMetadataInputSchema,
  PackRewards,
  PackRewardsOutput,
  PackRewardsOutputSchema,
} from "../../schema/tokens/pack";
import { PACK_CONTRACT_ROLES } from "../contractRoles";

/**
 * Create lootboxes of NFTs with rarity based open mechanics.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("{{chainName}}");
 * const contract = await sdk.getContract("{{contract_address}}", "pack");
 * ```
 *
 * @public
 */
export class Pack extends StandardErc1155<PackContract> {
  static contractRoles = PACK_CONTRACT_ROLES;

  public abi: Abi;
  public metadata: ContractMetadata<PackContract, typeof PackContractSchema>;
  public app: ContractAppURI<PackContract>;
  public roles: ContractRoles<
    PackContract,
    (typeof Pack.contractRoles)[number]
  >;
  public encoder: ContractEncoder<PackContract>;
  public events: ContractEvents<PackContract>;
  public estimator: GasCostEstimator<PackContract>;
  /**
   * Configure royalties
   * @remarks Set your own royalties for the entire contract or per pack
   * @example
   * ```javascript
   * // royalties on the whole contract
   * contract.royalties.setDefaultRoyaltyInfo({
   *   seller_fee_basis_points: 100, // 1%
   *   fee_recipient: "0x..."
   * });
   * // override royalty for a particular pack
   * contract.royalties.setTokenRoyaltyInfo(packId, {
   *   seller_fee_basis_points: 500, // 5%
   *   fee_recipient: "0x..."
   * });
   * ```
   */
  public royalties: ContractRoyalty<PackContract, typeof PackContractSchema>;
  /**
   * @internal
   */
  public interceptor: ContractInterceptor<PackContract>;

  public owner: ContractOwner<PackContract>;

  private _vrf?: PackVRF;

  /**
   * If enabled in the contract, use the Chainlink VRF functionality to open packs
   */
  get vrf(): PackVRF {
    return assertEnabled(this._vrf, FEATURE_PACK_VRF);
  }

  constructor(
    network: NetworkInput,
    address: string,
    storage: ThirdwebStorage,
    options: SDKOptions = {},
    abi: AbiInput,
    chainId: number,
    contractWrapper = new ContractWrapper<PackContract>(
      network,
      address,
      abi,
      options.gasless && "openzeppelin" in options.gasless
        ? {
            ...options,
            gasless: {
              ...options.gasless,
              openzeppelin: {
                ...options.gasless.openzeppelin,
                useEOAForwarder: true,
              },
            },
          }
        : options,
      storage,
    ),
  ) {
    super(contractWrapper, storage, chainId);
    this.abi = AbiSchema.parse(abi || []);
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      PackContractSchema,
      this.storage,
    );
    this.app = new ContractAppURI(
      this.contractWrapper,
      this.metadata,
      this.storage,
    );
    this.roles = new ContractRoles(this.contractWrapper, Pack.contractRoles);
    this.royalties = new ContractRoyalty(this.contractWrapper, this.metadata);
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.events = new ContractEvents(this.contractWrapper);
    this.interceptor = new ContractInterceptor(this.contractWrapper);
    this.owner = new ContractOwner(this.contractWrapper);
    this._vrf = this.detectVrf();
  }

  /**
   * @internal
   */
  onNetworkUpdated(network: NetworkInput): void {
    this.contractWrapper.updateSignerOrProvider(network);
    this._vrf?.onNetworkUpdated(network);
  }

  getAddress(): Address {
    return this.contractWrapper.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get a single Pack
   *
   * @remarks Get all the data associated with every pack in this contract.
   *
   * By default, returns the first 100 packs, use queryParams to fetch more.
   *
   * @example
   * ```javascript
   * const pack = await contract.get(0);
   * console.log(packs;
   * ```
   */
  public async get(tokenId: BigNumberish): Promise<NFT> {
    return this.erc1155.get(tokenId);
  }

  /**
   * Get All Packs
   *
   * @remarks Get all the data associated with every pack in this contract.
   *
   * By default, returns the first 100 packs, use queryParams to fetch more.
   *
   * @example
   * ```javascript
   * const packs = await contract.getAll();
   * console.log(packs;
   * ```
   * @param queryParams - optional filtering to only fetch a subset of results.
   * @returns The pack metadata for all packs queried.
   */
  public async getAll(queryParams?: QueryAllParams): Promise<NFT[]> {
    return this.erc1155.getAll(queryParams);
  }

  /**
   * Get Owned Packs
   *
   * @remarks Get all the data associated with the packs owned by a specific wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet to get the packs of
   * const address = "{{wallet_address}}";
   * const packss = await contract.getOwned(address);
   * ```
   *
   * @returns The pack metadata for all the owned packs in the contract.
   */
  public async getOwned(walletAddress?: AddressOrEns): Promise<NFT[]> {
    return this.erc1155.getOwned(walletAddress);
  }

  /**
   * Get the number of packs created
   * @returns the total number of packs minted in this contract
   * @public
   */
  public async getTotalCount(): Promise<BigNumber> {
    return this.erc1155.totalCount();
  }

  /**
   * Get whether users can transfer packs from this contract
   */
  public async isTransferRestricted(): Promise<boolean> {
    const anyoneCanTransfer = await this.contractWrapper.read("hasRole", [
      getRoleHash("transfer"),
      constants.AddressZero,
    ]);
    return !anyoneCanTransfer;
  }

  /**
   * Get Pack Contents
   * @remarks Get the rewards contained inside a pack.
   *
   * @param packId - The id of the pack to get the contents of.
   * @returns - The contents of the pack.
   *
   * @example
   * ```javascript
   * const packId = 0;
   * const contents = await contract.getPackContents(packId);
   * console.log(contents.erc20Rewards);
   * console.log(contents.erc721Rewards);
   * console.log(contents.erc1155Rewards);
   * ```
   */
  public async getPackContents(
    packId: BigNumberish,
  ): Promise<PackRewardsOutput> {
    const { contents, perUnitAmounts } = await this.contractWrapper.read(
      "getPackContents",
      [packId],
    );

    const erc20Rewards: PackRewardsOutput["erc20Rewards"] = [];
    const erc721Rewards: PackRewardsOutput["erc721Rewards"] = [];
    const erc1155Rewards: PackRewardsOutput["erc1155Rewards"] = [];

    for (let i = 0; i < contents.length; i++) {
      const reward = contents[i];
      const amount = perUnitAmounts[i];
      switch (reward.tokenType) {
        case 0: {
          const tokenMetadata = await fetchCurrencyMetadata(
            this.contractWrapper.getProvider(),
            reward.assetContract,
          );
          const quantityPerReward = utils.formatUnits(
            amount,
            tokenMetadata.decimals,
          );
          const totalRewards = utils.formatUnits(
            BigNumber.from(reward.totalAmount).div(amount),
            tokenMetadata.decimals,
          );
          erc20Rewards.push({
            contractAddress: reward.assetContract,
            quantityPerReward,
            totalRewards,
          });
          break;
        }
        case 1: {
          erc721Rewards.push({
            contractAddress: reward.assetContract,
            tokenId: reward.tokenId.toString(),
          });
          break;
        }
        case 2: {
          erc1155Rewards.push({
            contractAddress: reward.assetContract,
            tokenId: reward.tokenId.toString(),
            quantityPerReward: amount.toString(),
            totalRewards: BigNumber.from(reward.totalAmount)
              .div(amount)
              .toString(),
          });
          break;
        }
      }
    }

    return {
      erc20Rewards,
      erc721Rewards,
      erc1155Rewards,
    };
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Create Pack
   * @remarks Create a new pack with the given metadata and rewards and mint it to the connected wallet. See {@link Pack.createTo}
   *
   * @param metadataWithRewards - the metadata and rewards to include in the pack
   * @example
   * ```javascript
   * const pack = {
   *   // The metadata for the pack NFT itself
   *   packMetadata: {
   *     name: "My Pack",
   *     description: "This is a new pack",
   *     image: "ipfs://...",
   *   },
   *   // ERC20 rewards to be included in the pack
   *   erc20Rewards: [
   *     {
   *       contractAddress: "0x...",
   *       quantityPerReward: 5,
   *       quantity: 100,
   *       totalRewards: 20,
   *     }
   *   ],
   *   // ERC721 rewards to be included in the pack
   *   erc721Rewards: [
   *     {
   *       contractAddress: "0x...",
   *       tokenId: 0,
   *     }
   *   ],
   *   // ERC1155 rewards to be included in the pack
   *   erc1155Rewards: [
   *     {
   *       contractAddress: "0x...",
   *       tokenId: 0,
   *       quantityPerReward: 1,
   *       totalRewards: 100,
   *     }
   *   ],
   *   openStartTime: new Date(), // the date that packs can start to be opened, defaults to now
   *   rewardsPerPack: 1, // the number of rewards in each pack, defaults to 1
   * }
   *
   * const tx = await contract.create(pack);
   * ```
   */
  create = /* @__PURE__ */ buildTransactionFunction(
    async (metadataWithRewards: PackMetadataInput) => {
      const signerAddress = await this.contractWrapper.getSignerAddress();
      return this.createTo.prepare(signerAddress, metadataWithRewards);
    },
  );

  /**
   * Add Pack Contents
   * @remarks Add contents to an existing pack. See {@link Pack.addPackContents}
   *
   * @param packId - token Id of the pack to add contents to
   * @param packContents - the rewards to include in the pack
   * @example
   * ```javascript
   * const packContents = {
   *   // ERC20 rewards to be included in the pack
   *   erc20Rewards: [
   *     {
   *       contractAddress: "0x...",
   *       quantityPerReward: 5,
   *       quantity: 100,
   *       totalRewards: 20,
   *     }
   *   ],
   *   // ERC721 rewards to be included in the pack
   *   erc721Rewards: [
   *     {
   *       contractAddress: "0x...",
   *       tokenId: 0,
   *     }
   *   ],
   *   // ERC1155 rewards to be included in the pack
   *   erc1155Rewards: [
   *     {
   *       contractAddress: "0x...",
   *       tokenId: 0,
   *       quantityPerReward: 1,
   *       totalRewards: 100,
   *     }
   *   ],
   * }
   *
   * const tx = await contract.addPackContents(packId, packContents);
   * ```
   */
  addPackContents = /* @__PURE__ */ buildTransactionFunction(
    async (packId: BigNumberish, packContents: PackRewards) => {
      const signerAddress = await this.contractWrapper.getSignerAddress();
      const parsedContents = await PackRewardsOutputSchema.parseAsync(
        packContents,
      );
      const { contents, numOfRewardUnits } = await this.toPackContentArgs(
        parsedContents,
      );

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "addPackContents",
        args: [packId, contents, numOfRewardUnits, signerAddress],
        parse: (receipt) => {
          const event = this.contractWrapper.parseLogs<PackUpdatedEvent>(
            "PackUpdated",
            receipt?.logs,
          );
          if (event.length === 0) {
            throw new Error("PackUpdated event not found");
          }
          const id = event[0].args.packId;

          return {
            id: id,
            receipt,
            data: () => this.erc1155.get(id),
          };
        },
      });
    },
  );

  /**
   * Create Pack To Wallet
   * @remarks Create a new pack with the given metadata and rewards and mint it to the specified address.
   *
   * @param to - the address to mint the pack to
   * @param metadataWithRewards - the metadata and rewards to include in the pack
   *
   * @example
   * ```javascript
   * const pack = {
   *   // The metadata for the pack NFT itself
   *   packMetadata: {
   *     name: "My Pack",
   *     description: "This is a new pack",
   *     image: "ipfs://...",
   *   },
   *   // ERC20 rewards to be included in the pack
   *   erc20Rewards: [
   *     {
   *       contractAddress: "0x...",
   *       quantityPerReward: 5,
   *       quantity: 100,
   *       totalRewards: 20,
   *     }
   *   ],
   *   // ERC721 rewards to be included in the pack
   *   erc721Rewards: [
   *     {
   *       contractAddress: "0x...",
   *       tokenId: 0,
   *     }
   *   ],
   *   // ERC1155 rewards to be included in the pack
   *   erc1155Rewards: [
   *     {
   *       contractAddress: "0x...",
   *       tokenId: 0,
   *       quantityPerReward: 1,
   *       totalRewards: 100,
   *     }
   *   ],
   *   openStartTime: new Date(), // the date that packs can start to be opened, defaults to now
   *   rewardsPerPack: 1, // the number of rewards in each pack, defaults to 1
   * }
   *
   * const tx = await contract.createTo("0x...", pack);
   * ```
   */
  createTo = /* @__PURE__ */ buildTransactionFunction(
    async (
      to: AddressOrEns,
      metadataWithRewards: PackMetadataInput,
    ): Promise<Transaction<TransactionResultWithId<NFT>>> => {
      const uri = await uploadOrExtractURI(
        metadataWithRewards.packMetadata,
        this.storage,
      );

      const parsedMetadata = await PackMetadataInputSchema.parseAsync(
        metadataWithRewards,
      );
      const { erc20Rewards, erc721Rewards, erc1155Rewards } = parsedMetadata;
      const rewardsData: PackRewardsOutput = {
        erc20Rewards,
        erc721Rewards,
        erc1155Rewards,
      };
      const { contents, numOfRewardUnits } = await this.toPackContentArgs(
        rewardsData,
      );

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "createPack",
        args: [
          contents,
          numOfRewardUnits,
          uri,
          parsedMetadata.openStartTime,
          parsedMetadata.rewardsPerPack,
          await resolveAddress(to),
        ],
        parse: (receipt) => {
          const event = this.contractWrapper.parseLogs<PackCreatedEvent>(
            "PackCreated",
            receipt?.logs,
          );
          if (event.length === 0) {
            throw new Error("PackCreated event not found");
          }
          const packId = event[0].args.packId;

          return {
            id: packId,
            receipt,
            data: () => this.erc1155.get(packId),
          };
        },
      });
    },
  );

  /**
   * Open Pack
   *
   * @remarks - Open a pack to reveal the contained rewards. This will burn the specified pack and
   * the contained assets will be transferred to the opening users wallet.
   *
   * @param tokenId - the token ID of the pack you want to open
   * @param amount - the amount of packs you want to open
   *
   * @example
   * ```javascript
   * const tokenId = 0
   * const amount = 1
   * const tx = await contract.open(tokenId, amount);
   * ```
   */
  open = /* @__PURE__ */ buildTransactionFunction(
    async (
      tokenId: BigNumberish,
      amount: BigNumberish = 1,
      gasLimit = 500000,
    ): Promise<Transaction<Promise<PackRewards>>> => {
      if (this._vrf) {
        throw new Error(
          "This contract is using Chainlink VRF, use `contract.vrf.open()` or `contract.vrf.openAndClaim()` instead",
        );
      }

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "openPack",
        args: [tokenId, amount],
        overrides: {
          // Higher gas limit for opening packs
          gasLimit,
        },
        parse: async (receipt) => {
          const event = this.contractWrapper.parseLogs<PackOpenedEvent>(
            "PackOpened",
            receipt?.logs,
          );
          if (event.length === 0) {
            throw new Error("PackOpened event not found");
          }
          const rewards = event[0].args.rewardUnitsDistributed;

          const erc20Rewards: PackRewards["erc20Rewards"] = [];
          const erc721Rewards: PackRewards["erc721Rewards"] = [];
          const erc1155Rewards: PackRewards["erc1155Rewards"] = [];

          for (const reward of rewards) {
            switch (reward.tokenType) {
              case 0: {
                const tokenMetadata = await fetchCurrencyMetadata(
                  this.contractWrapper.getProvider(),
                  reward.assetContract,
                );
                erc20Rewards.push({
                  contractAddress: reward.assetContract,
                  quantityPerReward: utils
                    .formatUnits(reward.totalAmount, tokenMetadata.decimals)
                    .toString(),
                });
                break;
              }
              case 1: {
                erc721Rewards.push({
                  contractAddress: reward.assetContract,
                  tokenId: reward.tokenId.toString(),
                });
                break;
              }
              case 2: {
                erc1155Rewards.push({
                  contractAddress: reward.assetContract,
                  tokenId: reward.tokenId.toString(),
                  quantityPerReward: reward.totalAmount.toString(),
                });
                break;
              }
            }
          }

          return {
            erc20Rewards,
            erc721Rewards,
            erc1155Rewards,
          };
        },
      });
    },
  );

  /** *****************************
   * PRIVATE FUNCTIONS
   *******************************/

  private async toPackContentArgs(metadataWithRewards: PackRewardsOutput) {
    const contents: ITokenBundle.TokenStruct[] = [];
    const numOfRewardUnits: string[] = [];
    const { erc20Rewards, erc721Rewards, erc1155Rewards } = metadataWithRewards;

    const provider = this.contractWrapper.getProvider();
    const owner = await this.contractWrapper.getSignerAddress();

    for (const erc20 of erc20Rewards) {
      const normalizedQuantity = await normalizePriceValue(
        provider,
        erc20.quantityPerReward,
        erc20.contractAddress,
      );
      // Multiply the quantity of one reward by the number of rewards
      const totalQuantity = normalizedQuantity.mul(erc20.totalRewards);
      const hasAllowance = await hasERC20Allowance(
        this.contractWrapper,
        erc20.contractAddress,
        totalQuantity,
      );
      if (!hasAllowance) {
        throw new Error(
          `ERC20 token with contract address "${
            erc20.contractAddress
          }" does not have enough allowance to transfer.\n\nYou can set allowance to the multiwrap contract to transfer these tokens by running:\n\nawait sdk.getToken("${
            erc20.contractAddress
          }").setAllowance("${this.getAddress()}", ${totalQuantity});\n\n`,
        );
      }

      numOfRewardUnits.push(erc20.totalRewards);
      contents.push({
        assetContract: erc20.contractAddress,
        tokenType: 0,
        totalAmount: totalQuantity,
        tokenId: 0,
      });
    }

    for (const erc721 of erc721Rewards) {
      const isApproved = await isTokenApprovedForTransfer(
        this.contractWrapper.getProvider(),
        this.getAddress(),
        erc721.contractAddress,
        erc721.tokenId,
        owner,
      );

      if (!isApproved) {
        throw new Error(
          `ERC721 token "${erc721.tokenId}" with contract address "${
            erc721.contractAddress
          }" is not approved for transfer.\n\nYou can give approval the multiwrap contract to transfer this token by running:\n\nawait sdk.getNFTCollection("${
            erc721.contractAddress
          }").setApprovalForToken("${this.getAddress()}", ${
            erc721.tokenId
          });\n\n`,
        );
      }

      numOfRewardUnits.push("1");
      contents.push({
        assetContract: erc721.contractAddress,
        tokenType: 1,
        totalAmount: 1,
        tokenId: erc721.tokenId,
      });
    }

    for (const erc1155 of erc1155Rewards) {
      const isApproved = await isTokenApprovedForTransfer(
        this.contractWrapper.getProvider(),
        this.getAddress(),
        erc1155.contractAddress,
        erc1155.tokenId,
        owner,
      );

      if (!isApproved) {
        throw new Error(
          `ERC1155 token "${erc1155.tokenId}" with contract address "${
            erc1155.contractAddress
          }" is not approved for transfer.\n\nYou can give approval the multiwrap contract to transfer this token by running:\n\nawait sdk.getEdition("${
            erc1155.contractAddress
          }").setApprovalForAll("${this.getAddress()}", true);\n\n`,
        );
      }

      numOfRewardUnits.push(erc1155.totalRewards);
      contents.push({
        assetContract: erc1155.contractAddress,
        tokenType: 2,
        totalAmount: BigNumber.from(erc1155.quantityPerReward).mul(
          BigNumber.from(erc1155.totalRewards),
        ),
        tokenId: erc1155.tokenId,
      });
    }

    return {
      contents,
      numOfRewardUnits,
    };
  }

  /**
   * @internal
   */
  public async prepare<
    TMethod extends
      keyof PackContract["functions"] = keyof PackContract["functions"],
  >(
    method: string & TMethod,
    args: any[] & Parameters<PackContract["functions"][TMethod]>,
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
    TMethod extends
      keyof PackContract["functions"] = keyof PackContract["functions"],
  >(
    functionName: string & TMethod,
    args?: any[] & Parameters<PackContract["functions"][TMethod]>,
    overrides?: CallOverrides,
  ): Promise<ReturnType<PackContract["functions"][TMethod]>> {
    return this.contractWrapper.call(functionName, args, overrides);
  }

  private detectVrf() {
    if (
      detectContractFeature<IPackVRFDirect>(this.contractWrapper, "PackVRF")
    ) {
      return new PackVRF(
        this.contractWrapper.getSignerOrProvider(),
        this.contractWrapper.address,
        this.storage,
        this.contractWrapper.options,
        this.chainId,
      );
    }
    return undefined;
  }
}
