import type {
  ContractMetadata as ContractMetadataContract,
  Drop,
  DropERC20_V2,
  DropERC721_V3,
  DropSinglePhase,
  DropSinglePhase_V1,
  IDropSinglePhase_V1,
  IERC20,
  IERC20Metadata,
  Multicall,
} from "@thirdweb-dev/contracts-js";
import type { IDropSinglePhase } from "@thirdweb-dev/contracts-js/src/DropSinglePhase";
import type { IClaimCondition } from "@thirdweb-dev/contracts-js/src/IDrop";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, constants, utils, type BigNumberish } from "ethers";
import deepEqual from "fast-deep-equal";
import { AmountSchema } from "../../../core/schema/shared";
import { abstractContractModelToLegacy } from "../../common/claim-conditions/abstractContractModelToLegacy";
import { abstractContractModelToNew } from "../../common/claim-conditions/abstractContractModelToNew";
import { convertQuantityToBigNumber } from "../../common/claim-conditions/convertQuantityToBigNumber";
import { fetchSnapshotEntryForAddress } from "../../common/claim-conditions/fetchSnapshotEntryForAddress";
import { legacyContractModelToAbstract } from "../../common/claim-conditions/legacyContractModelToAbstract";
import { newContractModelToAbstract } from "../../common/claim-conditions/newContractModelToAbstract";
import { prepareClaim } from "../../common/claim-conditions/prepareClaim";
import { processClaimConditionInputs } from "../../common/claim-conditions/processClaimConditionInputs";
import { transformResultToClaimCondition } from "../../common/claim-conditions/transformResultToClaimCondition";
import { updateExistingClaimConditions } from "../../common/claim-conditions/updateExistingClaimConditions";
import { isNativeToken } from "../../common/currency/isNativeToken";
import { resolveAddress } from "../../common/ens/resolveAddress";
import { includesErrorMessage } from "../../common/error";
import { detectContractFeature } from "../../common/feature-detection/detectContractFeature";
import { hasFunction } from "../../common/feature-detection/hasFunction";
import { SnapshotFormatVersion } from "../../common/sharded-merkle-tree";
import { buildTransactionFunction } from "../../common/transactions";
import { isNode } from "../../common/utils";
import { AbstractClaimConditionContractStruct } from "../../schema/contracts/common/claim-conditions";
import { SnapshotEntryWithProof } from "../../schema/contracts/common/snapshots";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import type {
  ClaimCondition,
  ClaimConditionFetchOptions,
  ClaimConditionInput,
  ClaimOptions,
  ClaimVerification,
} from "../../types/claim-conditions/claim-conditions";
import type { Amount } from "../../types/currency";
import {
  BaseClaimConditionERC721,
  BaseDropERC20,
  PrebuiltNFTDrop,
  PrebuiltTokenDrop,
} from "../../types/eips";
import { ContractEncoder } from "./contract-encoder";
import { ContractMetadata } from "./contract-metadata";
import { ContractWrapper } from "./internal/contract-wrapper";
import { Transaction } from "./transactions";
import { ClaimEligibility } from "../../enums/ClaimEligibility";

/**
 * Manages claim conditions for NFT Drop contracts
 * @erc721
 * @public
 */
export class DropClaimConditions<
  TContract extends
    | PrebuiltNFTDrop
    | PrebuiltTokenDrop
    | BaseClaimConditionERC721
    | BaseDropERC20,
> {
  private contractWrapper;
  private metadata;
  private storage: ThirdwebStorage;

  constructor(
    contractWrapper: ContractWrapper<
      | PrebuiltNFTDrop
      | PrebuiltTokenDrop
      | BaseClaimConditionERC721
      | BaseDropERC20
    >,
    metadata: ContractMetadata<TContract, any>,
    storage: ThirdwebStorage,
  ) {
    this.storage = storage;
    this.contractWrapper = contractWrapper;
    this.metadata = metadata;
  }

  /** ***************************************
   * READ FUNCTIONS
   *****************************************/

  /**
   * Get the currently active claim condition
   *
   * @returns The claim condition metadata
   */
  public async getActive(
    options?: ClaimConditionFetchOptions,
  ): Promise<ClaimCondition> {
    const [cc, metadata, tokenDecimals] = await Promise.all([
      this.get(),
      this.metadata.get(),
      this.getTokenDecimals(),
    ]);
    return await transformResultToClaimCondition(
      cc,
      tokenDecimals,
      this.contractWrapper.getProvider(),
      metadata.merkle || {},
      this.storage,
      options?.withAllowList || false,
    );
  }

  private async get(
    conditionId?: BigNumberish,
  ): Promise<AbstractClaimConditionContractStruct> {
    if (this.isLegacySinglePhaseDrop(this.contractWrapper)) {
      const contractModel = await this.contractWrapper.read(
        "claimCondition",
        [],
      );
      return legacyContractModelToAbstract(contractModel);
    } else if (this.isLegacyMultiPhaseDrop(this.contractWrapper)) {
      const id =
        conditionId !== undefined
          ? conditionId
          : await this.contractWrapper.read("getActiveClaimConditionId", []);
      const contractModel = await this.contractWrapper.read(
        "getClaimConditionById",
        [id],
      );
      return legacyContractModelToAbstract(contractModel);
    } else if (this.isNewSinglePhaseDrop(this.contractWrapper)) {
      const contractModel: IClaimCondition.ClaimConditionStructOutput =
        await this.contractWrapper.read("claimCondition", []);
      return newContractModelToAbstract(contractModel);
    } else if (this.isNewMultiphaseDrop(this.contractWrapper)) {
      const id =
        conditionId !== undefined
          ? conditionId
          : await this.contractWrapper.read("getActiveClaimConditionId", []);
      const contractModel: IClaimCondition.ClaimConditionStruct =
        await this.contractWrapper.read("getClaimConditionById", [id]);
      return newContractModelToAbstract(contractModel);
    } else {
      throw new Error("Contract does not support claim conditions");
    }
  }

  /**
   * Get all the claim conditions
   *
   * @returns The claim conditions metadata
   */
  public async getAll(
    options?: ClaimConditionFetchOptions,
  ): Promise<ClaimCondition[]> {
    if (
      this.isLegacyMultiPhaseDrop(this.contractWrapper) ||
      this.isNewMultiphaseDrop(this.contractWrapper)
    ) {
      const [currentStartId, countBn] = await this.contractWrapper.read(
        "claimCondition",
        [],
      );
      const startId = currentStartId.toNumber();
      const count = countBn.toNumber();
      const conditions: Promise<AbstractClaimConditionContractStruct>[] = [];
      for (let i = startId; i < startId + count; i++) {
        conditions.push(this.get(i));
      }
      const [metadata, decimals, ...fetchedConditions] = await Promise.all([
        this.metadata.get(),
        this.getTokenDecimals(),
        ...conditions,
      ]);
      return Promise.all(
        fetchedConditions.map((c) =>
          transformResultToClaimCondition(
            c,
            decimals,
            this.contractWrapper.getProvider(),
            metadata.merkle,
            this.storage,
            options?.withAllowList || false,
          ),
        ),
      );
    } else {
      return [await this.getActive(options)];
    }
  }

  /**
   * Can Claim
   *
   * @remarks Check if the drop can currently be claimed.
   *
   * @example
   * ```javascript
   * // Quantity of tokens to check claimability of
   * const quantity = 1;
   * const canClaim = await contract.canClaim(quantity);
   * ```
   */
  public async canClaim(
    quantity: Amount,
    addressToCheck?: AddressOrEns,
  ): Promise<boolean> {
    // TODO switch to use verifyClaim
    if (addressToCheck) {
      addressToCheck = await resolveAddress(addressToCheck);
    }

    return (
      (await this.getClaimIneligibilityReasons(quantity, addressToCheck))
        .length === 0
    );
  }

  /**
   * For any claim conditions that a particular wallet is violating,
   * this function returns human readable information about the
   * breaks in the condition that can be used to inform the user.
   *
   * @param quantity - The desired quantity that would be claimed.
   * @param addressToCheck - The wallet address, defaults to the connected wallet.
   *
   */
  public async getClaimIneligibilityReasons(
    quantity: Amount,
    addressToCheck?: AddressOrEns,
  ): Promise<ClaimEligibility[]> {
    const reasons: ClaimEligibility[] = [];
    let activeConditionIndex: BigNumber;
    let claimCondition: ClaimCondition;

    if (addressToCheck === undefined) {
      try {
        addressToCheck = await this.contractWrapper.getSignerAddress();
      } catch (err) {
        console.warn("failed to get signer address", err);
      }
    }

    // if we have been unable to get a signer address, we can't check eligibility, so return a NoWallet error reason
    if (!addressToCheck) {
      return [ClaimEligibility.NoWallet];
    }

    const [resolvedAddress, decimals] = await Promise.all([
      resolveAddress(addressToCheck),
      this.getTokenDecimals(),
    ]);

    const quantityWithDecimals = utils.parseUnits(
      AmountSchema.parse(quantity),
      decimals,
    );

    try {
      claimCondition = await this.getActive();
    } catch (err: any) {
      if (
        includesErrorMessage(err, "!CONDITION") ||
        includesErrorMessage(err, "no active mint condition")
      ) {
        reasons.push(ClaimEligibility.NoClaimConditionSet);
        return reasons;
      }
      console.warn("failed to get active claim condition", err);
      reasons.push(ClaimEligibility.Unknown);
      return reasons;
    }

    if (claimCondition.availableSupply !== "unlimited") {
      const supplyWithDecimals = utils.parseUnits(
        claimCondition.availableSupply,
        decimals,
      );

      if (supplyWithDecimals.lt(quantityWithDecimals)) {
        reasons.push(ClaimEligibility.NotEnoughSupply);
        return reasons;
      }
    }

    // check for merkle root inclusion
    const merkleRootArray = utils.stripZeros(claimCondition.merkleRootHash);
    const hasAllowList = merkleRootArray.length > 0;
    let allowListEntry: SnapshotEntryWithProof | null = null;
    if (hasAllowList) {
      allowListEntry = await this.getClaimerProofs(resolvedAddress);
      if (
        !allowListEntry &&
        (this.isLegacySinglePhaseDrop(this.contractWrapper) ||
          this.isLegacyMultiPhaseDrop(this.contractWrapper))
      ) {
        // exclusive allowlist behavior
        reasons.push(ClaimEligibility.AddressNotAllowed);
        return reasons;
      }

      if (allowListEntry) {
        try {
          const claimVerification = await this.prepareClaim(
            quantity,
            false,
            decimals,
            resolvedAddress,
          );

          let validMerkleProof;
          if (this.isLegacyMultiPhaseDrop(this.contractWrapper)) {
            activeConditionIndex = await this.contractWrapper.read(
              "getActiveClaimConditionId",
              [],
            );
            // legacy verifyClaimerMerkleProofs function
            [validMerkleProof] = await this.contractWrapper.read(
              "verifyClaimMerkleProof",
              [
                activeConditionIndex,
                resolvedAddress,
                quantity,
                claimVerification.proofs,
                claimVerification.maxClaimable,
              ],
            );
            if (!validMerkleProof) {
              reasons.push(ClaimEligibility.AddressNotAllowed);
              return reasons;
            }
          } else if (this.isLegacySinglePhaseDrop(this.contractWrapper)) {
            [validMerkleProof] = await this.contractWrapper.read(
              "verifyClaimMerkleProof",
              [
                resolvedAddress,
                quantity,
                {
                  proof: claimVerification.proofs,
                  maxQuantityInAllowlist: claimVerification.maxClaimable,
                },
              ],
            );
            if (!validMerkleProof) {
              reasons.push(ClaimEligibility.AddressNotAllowed);
              return reasons;
            }
          } else if (this.isNewSinglePhaseDrop(this.contractWrapper)) {
            await this.contractWrapper.read("verifyClaim", [
              resolvedAddress,
              quantity,
              claimVerification.currencyAddress,
              claimVerification.price,
              {
                proof: claimVerification.proofs,
                quantityLimitPerWallet: claimVerification.maxClaimable,
                currency: claimVerification.currencyAddressInProof,
                pricePerToken: claimVerification.priceInProof,
              } as IDropSinglePhase.AllowlistProofStruct,
            ]);
          } else if (this.isNewMultiphaseDrop(this.contractWrapper)) {
            activeConditionIndex = await this.contractWrapper.read(
              "getActiveClaimConditionId",
              [],
            );
            await this.contractWrapper.read("verifyClaim", [
              activeConditionIndex,
              resolvedAddress,
              quantity,
              claimVerification.currencyAddress,
              claimVerification.price,
              {
                proof: claimVerification.proofs,
                quantityLimitPerWallet: claimVerification.maxClaimable,
                currency: claimVerification.currencyAddressInProof,
                pricePerToken: claimVerification.priceInProof,
              } as IDropSinglePhase.AllowlistProofStruct,
            ]);
          }
        } catch (e: any) {
          console.warn(
            "Merkle proof verification failed:",
            "reason" in e ? e.reason : e,
          );
          const reason = (e as any).reason;
          switch (reason) {
            case "!Qty":
              reasons.push(ClaimEligibility.OverMaxClaimablePerWallet);
              break;
            case "!PriceOrCurrency":
              reasons.push(ClaimEligibility.WrongPriceOrCurrency);
              break;
            case "!MaxSupply":
              reasons.push(ClaimEligibility.NotEnoughSupply);
              break;
            case "cant claim yet":
              reasons.push(ClaimEligibility.ClaimPhaseNotStarted);
              break;
            default: {
              reasons.push(ClaimEligibility.AddressNotAllowed);
              break;
            }
          }
          return reasons;
        }
      }
    }

    if (
      this.isNewSinglePhaseDrop(this.contractWrapper) ||
      this.isNewMultiphaseDrop(this.contractWrapper)
    ) {
      let claimedSupply = BigNumber.from(0);
      let maxClaimable = convertQuantityToBigNumber(
        claimCondition.maxClaimablePerWallet,
        decimals,
      );

      try {
        claimedSupply = await this.getSupplyClaimedByWallet(resolvedAddress);
      } catch (e) {
        // no-op
      }

      if (allowListEntry) {
        maxClaimable = convertQuantityToBigNumber(
          allowListEntry.maxClaimable,
          decimals,
        );
      }

      if (
        maxClaimable.gt(0) &&
        maxClaimable.lt(claimedSupply.add(quantityWithDecimals))
      ) {
        reasons.push(ClaimEligibility.OverMaxClaimablePerWallet);
        return reasons;
      }

      // if there is no allowlist, or if there is an allowlist and the address is not in it
      // if maxClaimable is 0, we consider it as the address is not allowed
      if (!hasAllowList || (hasAllowList && !allowListEntry)) {
        if (maxClaimable.lte(claimedSupply) || maxClaimable.eq(0)) {
          reasons.push(ClaimEligibility.AddressNotAllowed);
          return reasons;
        }
      }
    }

    // check for claim timestamp between claims (ONLY FOR LEGACY)
    if (
      this.isLegacySinglePhaseDrop(this.contractWrapper) ||
      this.isLegacyMultiPhaseDrop(this.contractWrapper)
    ) {
      let [lastClaimedTimestamp, timestampForNextClaim] = [
        BigNumber.from(0),
        BigNumber.from(0),
      ];
      if (this.isLegacyMultiPhaseDrop(this.contractWrapper)) {
        activeConditionIndex = await this.contractWrapper.read(
          "getActiveClaimConditionId",
          [],
        );
        [lastClaimedTimestamp, timestampForNextClaim] =
          await this.contractWrapper.read("getClaimTimestamp", [
            activeConditionIndex,
            resolvedAddress,
          ]);
      } else if (this.isLegacySinglePhaseDrop(this.contractWrapper)) {
        // check for claim timestamp between claims
        [lastClaimedTimestamp, timestampForNextClaim] =
          await this.contractWrapper.read("getClaimTimestamp", [
            resolvedAddress,
          ]);
      }

      const now = BigNumber.from(Date.now()).div(1000);
      if (lastClaimedTimestamp.gt(0) && now.lt(timestampForNextClaim)) {
        // contract will return MaxUint256 if user has already claimed and cannot claim again
        if (timestampForNextClaim.eq(constants.MaxUint256)) {
          reasons.push(ClaimEligibility.AlreadyClaimed);
        } else {
          reasons.push(ClaimEligibility.WaitBeforeNextClaimTransaction);
        }
        return reasons;
      }
    }

    // if not within a browser context, check for wallet balance.
    // In browser context, let the wallet do that job
    if (claimCondition.price.gt(0) && isNode()) {
      const totalPrice = claimCondition.price.mul(BigNumber.from(quantity));
      const provider = this.contractWrapper.getProvider();
      if (isNativeToken(claimCondition.currencyAddress)) {
        const balance = await provider.getBalance(resolvedAddress);
        if (balance.lt(totalPrice)) {
          reasons.push(ClaimEligibility.NotEnoughTokens);
        }
      } else {
        const ERC20Abi = (
          await import("@thirdweb-dev/contracts-js/dist/abis/IERC20.json")
        ).default;
        const erc20 = new ContractWrapper<IERC20>(
          provider,
          claimCondition.currencyAddress,
          ERC20Abi,
          {},
          this.storage,
        );
        const balance = await erc20.read("balanceOf", [resolvedAddress]);
        if (balance.lt(totalPrice)) {
          reasons.push(ClaimEligibility.NotEnoughTokens);
        }
      }
    }

    return reasons;
  }

  /**
   * Returns allow list information and merkle proofs for the given address.
   * @param claimerAddress - the claimer address
   * @param claimConditionId - optional the claim condition id to get the proofs for
   */
  public async getClaimerProofs(
    claimerAddress: AddressOrEns,
    claimConditionId?: BigNumberish,
  ): Promise<SnapshotEntryWithProof | null> {
    const claimCondition = await this.get(claimConditionId);
    const merkleRoot = claimCondition.merkleRoot;
    const merkleRootArray = utils.stripZeros(merkleRoot);
    if (merkleRootArray.length > 0) {
      const [metadata, resolvedAddress] = await Promise.all([
        this.metadata.get(),
        resolveAddress(claimerAddress),
      ]);
      return await fetchSnapshotEntryForAddress(
        resolvedAddress,
        merkleRoot.toString(),
        metadata.merkle,
        this.contractWrapper.getProvider(),
        this.storage,
        this.getSnapshotFormatVersion(),
      );
    } else {
      return null;
    }
  }

  /**
   * Get the total supply claimed by a specific wallet
   * @param walletAddress - the wallet address to check
   * @returns The total supply claimed
   */
  public async getSupplyClaimedByWallet(
    walletAddress: AddressOrEns,
  ): Promise<BigNumber> {
    const resolvedAddress = await resolveAddress(walletAddress);
    if (this.isNewSinglePhaseDrop(this.contractWrapper)) {
      return await this.contractWrapper.read("getSupplyClaimedByWallet", [
        resolvedAddress,
      ]);
    }

    if (this.isNewMultiphaseDrop(this.contractWrapper)) {
      const activeClaimConditionId = await this.contractWrapper.read(
        "getActiveClaimConditionId",
        [],
      );
      return await this.contractWrapper.read("getSupplyClaimedByWallet", [
        activeClaimConditionId,
        resolvedAddress,
      ]);
    }
    throw new Error(
      "This contract does not support the getSupplyClaimedByWallet function",
    );
  }

  /** ***************************************
   * WRITE FUNCTIONS
   *****************************************/

  /**
   * Set public mint conditions
   *
   * @remarks Sets the public mint conditions that need to be fullfiled by users to claim NFTs.
   *
   * @example
   * ```javascript
   * const presaleStartTime = new Date();
   * const publicSaleStartTime = new Date(Date.now() + 60 * 60 * 24 * 1000);
   *
   * // Optionally specify addresses that can claim
   * const snapshots = ['0x...', '0x...']
   *
   * // Or alternatively, you can pass snapshots with the max number of NFTs each address can claim
   * // const snapshots = [{ address: '0x...', maxClaimable: 1 }, { address: '0x...', maxClaimable: 2 }]
   *
   * const claimConditions = [
   *   {
   *     startTime: presaleStartTime, // start the presale now
   *     maxClaimableSupply: 2, // limit how many mints for this presale
   *     price: 0.01, // presale price
   *     snapshot: snapshots, // limit minting to only certain addresses
   *   },
   *   {
   *     startTime: publicSaleStartTime, // 24h after presale, start public sale
   *     price: 0.08, // public sale price
   *   }
   * ]);
   *
   * await dropContract.claimConditions.set(claimConditions);
   * ```
   *
   * @param claimConditionInputs - The claim conditions
   * @param resetClaimEligibilityForAll - Whether to reset the state of who already claimed NFTs previously
   */
  set = /* @__PURE__ */ buildTransactionFunction(
    async (
      claimConditionInputs: ClaimConditionInput[],
      resetClaimEligibilityForAll = false,
    ): Promise<Transaction> => {
      let claimConditionsProcessed = claimConditionInputs;
      if (
        this.isLegacySinglePhaseDrop(this.contractWrapper) ||
        this.isNewSinglePhaseDrop(this.contractWrapper)
      ) {
        resetClaimEligibilityForAll = true;
        if (claimConditionInputs.length === 0) {
          claimConditionsProcessed = [
            {
              startTime: new Date(0),
              currencyAddress: constants.AddressZero,
              price: 0,
              maxClaimableSupply: 0,
              maxClaimablePerWallet: 0,
              waitInSeconds: 0,
              merkleRootHash: utils.hexZeroPad([0], 32),
              snapshot: [],
            },
          ];
        } else if (claimConditionInputs.length > 1) {
          throw new Error(
            "Single phase drop contract cannot have multiple claim conditions, only one is allowed",
          );
        }
      }

      // if using new snapshot format, make sure that maxClaimablePerWallet is set if allowlist is set as well
      if (
        this.isNewSinglePhaseDrop(this.contractWrapper) ||
        this.isNewMultiphaseDrop(this.contractWrapper)
      ) {
        claimConditionsProcessed.forEach((cc) => {
          if (
            cc.snapshot &&
            cc.snapshot.length > 0 &&
            (cc.maxClaimablePerWallet === undefined ||
              cc.maxClaimablePerWallet === "unlimited")
          ) {
            throw new Error(
              "maxClaimablePerWallet must be set to a specific value when an allowlist is set.\n" +
                "Example: Set it to 0 to only allow addresses in the allowlist to claim the amount specified in the allowlist.\n" +
                "contract.claimConditions.set([{ snapshot: [{ address: '0x...', maxClaimable: 1 }], maxClaimablePerWallet: 0 }])",
            );
          }
          if (
            cc.snapshot &&
            cc.snapshot.length > 0 &&
            cc.maxClaimablePerWallet?.toString() === "0" &&
            cc.snapshot
              .map((s) => {
                if (typeof s === "string") {
                  return 0;
                } else {
                  return Number(s.maxClaimable?.toString() || 0);
                }
              })
              .reduce((acc, current) => {
                return acc + current;
              }, 0) === 0
          ) {
            throw new Error(
              "maxClaimablePerWallet is set to 0, and all addresses in the allowlist have max claimable 0. This means that no one can claim.",
            );
          }
        });
      }

      // process inputs
      const { snapshotInfos, sortedConditions } =
        await processClaimConditionInputs(
          claimConditionsProcessed,
          await this.getTokenDecimals(),
          this.contractWrapper.getProvider(),
          this.storage,
          this.getSnapshotFormatVersion(),
        );

      const merkleInfo: { [key: string]: string } = {};
      snapshotInfos.forEach((s) => {
        merkleInfo[s.merkleRoot] = s.snapshotUri;
      });
      const metadata = await this.metadata.get();
      const encoded: string[] = [];

      // upload new merkle roots to snapshot URIs if updated
      if (!deepEqual(metadata.merkle, merkleInfo)) {
        const mergedMetadata = await this.metadata.parseInputMetadata({
          ...metadata,
          merkle: merkleInfo,
        });
        // using internal method to just upload, avoids one contract call
        const contractURI =
          await this.metadata._parseAndUploadMetadata(mergedMetadata);

        // TODO (cc) we could write the merkle tree info on the claim condition metadata instead
        // TODO (cc) but we still need to maintain the behavior here for older contracts
        if (
          hasFunction<ContractMetadataContract>(
            "setContractURI",
            this.contractWrapper,
          )
        ) {
          const contractEncoder = new ContractEncoder(this.contractWrapper);
          encoded.push(contractEncoder.encode("setContractURI", [contractURI]));
        } else {
          throw new Error(
            "Setting a merkle root requires implementing ContractMetadata in your contract to support storing a merkle root.",
          );
        }
      }

      const cw = this.contractWrapper;
      const baseContractEncoder = new ContractEncoder(cw);
      if (this.isLegacySinglePhaseDrop(cw)) {
        const contractEncoderLegacy = new ContractEncoder(cw);
        encoded.push(
          contractEncoderLegacy.encode("setClaimConditions", [
            abstractContractModelToLegacy(sortedConditions[0]),
            resetClaimEligibilityForAll,
          ]),
        );
      } else if (this.isLegacyMultiPhaseDrop(cw)) {
        encoded.push(
          baseContractEncoder.encode("setClaimConditions", [
            sortedConditions.map(abstractContractModelToLegacy),
            resetClaimEligibilityForAll,
          ]),
        );
      } else if (this.isNewSinglePhaseDrop(cw)) {
        encoded.push(
          baseContractEncoder.encode("setClaimConditions", [
            abstractContractModelToNew(sortedConditions[0]),
            resetClaimEligibilityForAll,
          ]),
        );
      } else if (this.isNewMultiphaseDrop(cw)) {
        encoded.push(
          baseContractEncoder.encode("setClaimConditions", [
            sortedConditions.map(abstractContractModelToNew),
            resetClaimEligibilityForAll,
          ]),
        );
      } else {
        throw new Error("Contract does not support claim conditions");
      }

      if (hasFunction<Multicall>("multicall", this.contractWrapper)) {
        return Transaction.fromContractWrapper({
          contractWrapper: this.contractWrapper,
          method: "multicall",
          args: [encoded],
        });
      }
      throw new Error("Contract does not support multicall");
    },
  );

  /**
   * Update a single claim condition with new data.
   *
   * @param index - the index of the claim condition to update, as given by the index from the result of `getAll()`
   * @param claimConditionInput - the new data to update, previous data will be retained
   */
  update = /* @__PURE__ */ buildTransactionFunction(
    async (
      index: number,
      claimConditionInput: ClaimConditionInput,
    ): Promise<Transaction> => {
      const existingConditions = await this.getAll();
      const newConditionInputs = await updateExistingClaimConditions(
        index,
        claimConditionInput,
        existingConditions,
      );
      return await this.set.prepare(newConditionInputs);
    },
  );

  /** ***************************************
   * PRIVATE FUNCTIONS
   *****************************************/

  private async getTokenDecimals(): Promise<number> {
    if (detectContractFeature<IERC20Metadata>(this.contractWrapper, "ERC20")) {
      return this.contractWrapper.read("decimals", []);
    } else {
      return Promise.resolve(0);
    }
  }

  /**
   * Returns proofs and the overrides required for the transaction.
   *
   * @returns  `overrides` and `proofs` as an object.
   * @internal
   */
  public async prepareClaim(
    quantity: BigNumberish,
    checkERC20Allowance: boolean,
    decimals = 0,
    address?: string,
  ): Promise<ClaimVerification> {
    const [addressToClaim, activeClaimConditions] = await Promise.all([
      address ? address : this.contractWrapper.getSignerAddress(),
      this.getActive(),
    ]);
    return prepareClaim(
      addressToClaim,
      quantity,
      activeClaimConditions,
      async () => (await this.metadata.get()).merkle,
      decimals,
      this.contractWrapper,
      this.storage,
      checkERC20Allowance,
      this.getSnapshotFormatVersion(),
    );
  }

  public async getClaimArguments(
    destinationAddress: AddressOrEns,
    quantity: BigNumberish,
    claimVerification: ClaimVerification,
  ): Promise<any[]> {
    const resolvedAddress = await resolveAddress(destinationAddress);
    if (this.isLegacyMultiPhaseDrop(this.contractWrapper)) {
      return [
        resolvedAddress,
        quantity,
        claimVerification.currencyAddress,
        claimVerification.price,
        claimVerification.proofs,
        claimVerification.maxClaimable,
      ];
    } else if (this.isLegacySinglePhaseDrop(this.contractWrapper)) {
      return [
        resolvedAddress,
        quantity,
        claimVerification.currencyAddress,
        claimVerification.price,
        {
          proof: claimVerification.proofs,
          maxQuantityInAllowlist: claimVerification.maxClaimable,
        } as IDropSinglePhase_V1.AllowlistProofStruct,
        utils.toUtf8Bytes(""),
      ];
    }
    return [
      resolvedAddress,
      quantity,
      claimVerification.currencyAddress,
      claimVerification.price,
      {
        proof: claimVerification.proofs,
        quantityLimitPerWallet: claimVerification.maxClaimable,
        pricePerToken: claimVerification.priceInProof,
        currency: claimVerification.currencyAddressInProof,
      } as IDropSinglePhase.AllowlistProofStruct,
      utils.toUtf8Bytes(""),
    ];
  }

  /**
   * Construct a claim transaction without executing it.
   * This is useful for estimating the gas cost of a claim transaction, overriding transaction options and having fine grained control over the transaction execution.
   * @param destinationAddress - The address to claim to
   * @param quantity - The quantity to claim
   * @param options - Options to override the claim transaction
   *
   * @deprecated Use `contract.erc721.claim.prepare(...args)` instead
   */
  public async getClaimTransaction(
    destinationAddress: AddressOrEns,
    quantity: BigNumberish,
    options?: ClaimOptions,
  ): Promise<Transaction> {
    // TODO: Transaction Sequence Pattern
    if (options?.pricePerToken) {
      throw new Error(
        "Price per token is be set via claim conditions by calling `contract.erc721.claimConditions.set()`",
      );
    }
    const claimVerification = await this.prepareClaim(
      quantity,
      options?.checkERC20Allowance === undefined
        ? true
        : options.checkERC20Allowance,
      await this.getTokenDecimals(),
    );

    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "claim",
      args: (await this.getClaimArguments(
        destinationAddress,
        quantity,
        claimVerification,
      )) as Parameters<
        ContractWrapper<BaseClaimConditionERC721>["readContract"]["functions"]["claim"]
      >,
      overrides: claimVerification.overrides,
    });
  }

  private isNewSinglePhaseDrop(
    contractWrapper: ContractWrapper<any>,
  ): contractWrapper is ContractWrapper<DropSinglePhase> {
    return (
      detectContractFeature<DropSinglePhase>(
        contractWrapper,
        "ERC721ClaimConditionsV2",
      ) ||
      detectContractFeature<DropSinglePhase>(
        contractWrapper,
        "ERC20ClaimConditionsV2",
      )
    );
  }

  private isNewMultiphaseDrop(
    contractWrapper: ContractWrapper<any>,
  ): contractWrapper is ContractWrapper<Drop> {
    return (
      detectContractFeature<Drop>(contractWrapper, "ERC721ClaimPhasesV2") ||
      detectContractFeature<Drop>(contractWrapper, "ERC20ClaimPhasesV2")
    );
  }

  private isLegacySinglePhaseDrop(
    contractWrapper: ContractWrapper<any>,
  ): contractWrapper is ContractWrapper<DropSinglePhase_V1> {
    return (
      detectContractFeature<DropSinglePhase_V1>(
        contractWrapper,
        "ERC721ClaimConditionsV1",
      ) ||
      detectContractFeature<DropSinglePhase_V1>(
        contractWrapper,
        "ERC20ClaimConditionsV1",
      )
    );
  }

  private isLegacyMultiPhaseDrop(
    contractWrapper: ContractWrapper<any>,
  ): contractWrapper is ContractWrapper<DropERC721_V3 | DropERC20_V2> {
    return (
      detectContractFeature<DropERC721_V3 | DropERC20_V2>(
        contractWrapper,
        "ERC721ClaimPhasesV1",
      ) ||
      detectContractFeature<DropERC721_V3 | DropERC20_V2>(
        contractWrapper,
        "ERC20ClaimPhasesV1",
      )
    );
  }

  private getSnapshotFormatVersion(): SnapshotFormatVersion {
    return this.isLegacyMultiPhaseDrop(this.contractWrapper) ||
      this.isLegacySinglePhaseDrop(this.contractWrapper)
      ? SnapshotFormatVersion.V1
      : SnapshotFormatVersion.V2;
  }
}
