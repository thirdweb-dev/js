import {
  detectContractFeature,
  hasFunction,
  includesErrorMessage,
} from "../../common";
import {
  abstractContractModelToLegacy,
  abstractContractModelToNew,
  fetchSnapshotEntryForAddress,
  legacyContractModelToAbstract,
  newContractModelToAbstract,
  prepareClaim,
  processClaimConditionInputs,
  transformResultToClaimCondition,
  updateExistingClaimConditions,
} from "../../common/claim-conditions";
import { isNativeToken } from "../../common/currency";
import { resolveAddress } from "../../common/ens";
import { SnapshotFormatVersion } from "../../common/sharded-merkle-tree";
import { buildTransactionFunction } from "../../common/transactions";
import { isNode } from "../../common/utils";
import { ClaimEligibility } from "../../enums";
import {
  AbstractClaimConditionContractStruct,
  AddressOrEns,
  SnapshotEntryWithProof,
} from "../../schema";
import {
  ClaimCondition,
  ClaimConditionFetchOptions,
  ClaimConditionInput,
  ClaimConditionsForToken,
  ClaimOptions,
  ClaimVerification,
} from "../../types";
import {
  BaseClaimConditionERC1155,
  PrebuiltEditionDrop,
} from "../../types/eips";
import { ContractMetadata } from "./contract-metadata";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";
import type {
  ContractMetadata as ContractMetadataContract,
  Drop1155,
  DropERC1155_V2,
  DropSinglePhase1155,
  DropSinglePhase1155_V1,
  IDropSinglePhase,
  IDropSinglePhase_V1,
  IERC20,
} from "@thirdweb-dev/contracts-js";
import IERC20ABI from "@thirdweb-dev/contracts-js/dist/abis/IERC20.json";
import type { IDropClaimCondition_V2 } from "@thirdweb-dev/contracts-js/dist/declarations/src/DropERC20_V2";
import type { IClaimCondition } from "@thirdweb-dev/contracts-js/src/IDrop";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, constants, ethers, utils } from "ethers";
import deepEqual from "fast-deep-equal";

/**
 * Manages claim conditions for Edition Drop contracts
 * @public
 */
export class DropErc1155ClaimConditions<
  TContract extends PrebuiltEditionDrop | BaseClaimConditionERC1155,
> {
  private contractWrapper;
  private metadata;
  private storage: ThirdwebStorage;

  constructor(
    contractWrapper: ContractWrapper<TContract>,
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
   * @returns the claim condition metadata
   */
  public async getActive(
    tokenId: BigNumberish,
    options?: ClaimConditionFetchOptions,
  ): Promise<ClaimCondition> {
    const mc = await this.get(tokenId);
    const metadata = await this.metadata.get();
    return await transformResultToClaimCondition(
      mc,
      0,
      this.contractWrapper.getProvider(),
      metadata.merkle,
      this.storage,
      options?.withAllowList || false,
    );
  }

  private async get(
    tokenId: BigNumberish,
    conditionId?: BigNumberish,
  ): Promise<AbstractClaimConditionContractStruct> {
    if (this.isLegacySinglePhaseDrop(this.contractWrapper)) {
      const contractModel = await (
        this.contractWrapper.readContract as DropSinglePhase1155_V1
      ).claimCondition(tokenId);
      return legacyContractModelToAbstract(contractModel);
    } else if (this.isLegacyMultiPhaseDrop(this.contractWrapper)) {
      const id =
        conditionId !== undefined
          ? conditionId
          : await this.contractWrapper.readContract.getActiveClaimConditionId(
              tokenId,
            );
      const contractModel =
        (await this.contractWrapper.readContract.getClaimConditionById(
          tokenId,
          id,
        )) as IDropClaimCondition_V2.ClaimConditionStructOutput;
      return legacyContractModelToAbstract(contractModel);
    } else if (this.isNewSinglePhaseDrop(this.contractWrapper)) {
      const contractModel =
        (await this.contractWrapper.readContract.claimCondition(
          tokenId,
        )) as IClaimCondition.ClaimConditionStructOutput;
      return newContractModelToAbstract(contractModel);
    } else if (this.isNewMultiphaseDrop(this.contractWrapper)) {
      const id =
        conditionId !== undefined
          ? conditionId
          : await this.contractWrapper.readContract.getActiveClaimConditionId(
              tokenId,
            );
      const contractModel =
        (await this.contractWrapper.readContract.getClaimConditionById(
          tokenId,
          id,
        )) as IClaimCondition.ClaimConditionStruct;
      return newContractModelToAbstract(contractModel);
    } else {
      throw new Error("Contract does not support claim conditions");
    }
  }

  /**
   * Get all the claim conditions
   *
   * @returns the claim conditions metadata
   */
  public async getAll(
    tokenId: BigNumberish,
    options?: ClaimConditionFetchOptions,
  ): Promise<ClaimCondition[]> {
    if (
      this.isLegacyMultiPhaseDrop(this.contractWrapper) ||
      this.isNewMultiphaseDrop(this.contractWrapper)
    ) {
      const claimCondition =
        (await this.contractWrapper.readContract.claimCondition(tokenId)) as {
          currentStartId: BigNumber;
          count: BigNumber;
        };
      const startId = claimCondition.currentStartId.toNumber();
      const count = claimCondition.count.toNumber();
      const conditions: AbstractClaimConditionContractStruct[] = [];
      for (let i = startId; i < startId + count; i++) {
        conditions.push(await this.get(tokenId, i));
      }
      const metadata = await this.metadata.get();
      return Promise.all(
        conditions.map((c) =>
          transformResultToClaimCondition(
            c,
            0,
            this.contractWrapper.getProvider(),
            metadata.merkle,
            this.storage,
            options?.withAllowList || false,
          ),
        ),
      );
    } else {
      return [await this.getActive(tokenId, options)];
    }
  }

  /**
   * Can Claim
   *
   * @remarks Check if a particular NFT can currently be claimed by a given user.
   *
   * @example
   * ```javascript
   * // Quantity of tokens to check claimability of
   * const quantity = 1;
   * const canClaim = await contract.canClaim(quantity);
   * ```
   */
  public async canClaim(
    tokenId: BigNumberish,
    quantity: BigNumberish,
    addressToCheck?: AddressOrEns,
  ): Promise<boolean> {
    // TODO switch to use verifyClaim
    if (addressToCheck) {
      addressToCheck = await resolveAddress(addressToCheck);
    }

    return (
      (
        await this.getClaimIneligibilityReasons(
          tokenId,
          quantity,
          addressToCheck,
        )
      ).length === 0
    );
  }

  /**
   * For any claim conditions that a particular wallet is violating,
   * this function returns human-readable information about the
   * breaks in the condition that can be used to inform the user.
   *
   * @param tokenId - the token id to check
   * @param quantity - The desired quantity that would be claimed.
   * @param addressToCheck - The wallet address, defaults to the connected wallet.
   *
   */
  public async getClaimIneligibilityReasons(
    tokenId: BigNumberish,
    quantity: BigNumberish,
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

    const resolvedAddress = await resolveAddress(addressToCheck);

    try {
      claimCondition = await this.getActive(tokenId);
    } catch (err: any) {
      if (
        includesErrorMessage(err, "!CONDITION") ||
        includesErrorMessage(err, "no active mint condition")
      ) {
        reasons.push(ClaimEligibility.NoClaimConditionSet);
        return reasons;
      }
      reasons.push(ClaimEligibility.Unknown);
      return reasons;
    }

    if (claimCondition.availableSupply !== "unlimited") {
      if (BigNumber.from(claimCondition.availableSupply).lt(quantity)) {
        reasons.push(ClaimEligibility.NotEnoughSupply);
      }
    }

    // check for merkle root inclusion
    const merkleRootArray = ethers.utils.stripZeros(
      claimCondition.merkleRootHash,
    );
    const hasAllowList = merkleRootArray.length > 0;
    let allowListEntry: SnapshotEntryWithProof | null = null;
    if (hasAllowList) {
      allowListEntry = await this.getClaimerProofs(tokenId, resolvedAddress);
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
            tokenId,
            quantity,
            false,
            resolvedAddress,
          );

          let validMerkleProof;
          if (this.isLegacyMultiPhaseDrop(this.contractWrapper)) {
            activeConditionIndex =
              await this.contractWrapper.readContract.getActiveClaimConditionId(
                tokenId,
              );
            // legacy verifyClaimerMerkleProofs function
            [validMerkleProof] =
              await this.contractWrapper.readContract.verifyClaimMerkleProof(
                activeConditionIndex,
                resolvedAddress,
                tokenId,
                quantity,
                claimVerification.proofs,
                claimVerification.maxClaimable,
              );
            if (!validMerkleProof) {
              reasons.push(ClaimEligibility.AddressNotAllowed);
              return reasons;
            }
          } else if (this.isLegacySinglePhaseDrop(this.contractWrapper)) {
            [validMerkleProof] =
              await this.contractWrapper.readContract.verifyClaimMerkleProof(
                tokenId,
                resolvedAddress,
                quantity,
                {
                  proof: claimVerification.proofs,
                  maxQuantityInAllowlist: claimVerification.maxClaimable,
                },
              );
            if (!validMerkleProof) {
              reasons.push(ClaimEligibility.AddressNotAllowed);
              return reasons;
            }
          } else if (this.isNewSinglePhaseDrop(this.contractWrapper)) {
            await this.contractWrapper.readContract.verifyClaim(
              tokenId,
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
            );
            // TODO (cc) in new override format, anyone can claim (no allow list restriction)
            // TODO (cc) instead check if maxClaimablePerWallet is 0 and this address has no overrides
            // TODO (cc) meaning this address is not allowed to claim
            if (
              (claimCondition.maxClaimablePerWallet === "0" &&
                claimVerification.maxClaimable ===
                  ethers.constants.MaxUint256) ||
              claimVerification.maxClaimable === BigNumber.from(0)
            ) {
              reasons.push(ClaimEligibility.AddressNotAllowed);
              return reasons;
            }
          } else if (this.isNewMultiphaseDrop(this.contractWrapper)) {
            activeConditionIndex =
              await this.contractWrapper.readContract.getActiveClaimConditionId(
                tokenId,
              );
            await this.contractWrapper.readContract.verifyClaim(
              activeConditionIndex,
              resolvedAddress,
              tokenId,
              quantity,
              claimVerification.currencyAddress,
              claimVerification.price,
              {
                proof: claimVerification.proofs,
                quantityLimitPerWallet: claimVerification.maxClaimable,
                currency: claimVerification.currencyAddressInProof,
                pricePerToken: claimVerification.priceInProof,
              } as IDropSinglePhase.AllowlistProofStruct,
            );
            if (
              (claimCondition.maxClaimablePerWallet === "0" &&
                claimVerification.maxClaimable ===
                  ethers.constants.MaxUint256) ||
              claimVerification.maxClaimable === BigNumber.from(0)
            ) {
              reasons.push(ClaimEligibility.AddressNotAllowed);
              return reasons;
            }
          }
        } catch (e: any) {
          console.warn(
            "Merkle proof verification failed:",
            "reason" in e ? e.reason : e,
          );
          reasons.push(ClaimEligibility.AddressNotAllowed);
          return reasons;
        }
      }
    }

    if (
      this.isNewSinglePhaseDrop(this.contractWrapper) ||
      this.isNewMultiphaseDrop(this.contractWrapper)
    ) {
      if (!hasAllowList || (hasAllowList && !allowListEntry)) {
        if (claimCondition.maxClaimablePerWallet === "0") {
          reasons.push(ClaimEligibility.AddressNotAllowed);
          return reasons;
        }
      }
    }

    // check for claim timestamp between claims
    let [lastClaimedTimestamp, timestampForNextClaim] = [
      BigNumber.from(0),
      BigNumber.from(0),
    ];
    if (this.isLegacyMultiPhaseDrop(this.contractWrapper)) {
      activeConditionIndex =
        await this.contractWrapper.readContract.getActiveClaimConditionId(
          tokenId,
        );
      [lastClaimedTimestamp, timestampForNextClaim] =
        await this.contractWrapper.readContract.getClaimTimestamp(
          tokenId,
          activeConditionIndex,
          resolvedAddress,
        );
    } else if (this.isLegacySinglePhaseDrop(this.contractWrapper)) {
      [lastClaimedTimestamp, timestampForNextClaim] =
        await this.contractWrapper.readContract.getClaimTimestamp(
          tokenId,
          resolvedAddress,
        );
    }

    const now = BigNumber.from(Date.now()).div(1000);

    if (lastClaimedTimestamp.gt(0) && now.lt(timestampForNextClaim)) {
      // contract will return MaxUint256 if user has already claimed and cannot claim again
      if (timestampForNextClaim.eq(constants.MaxUint256)) {
        reasons.push(ClaimEligibility.AlreadyClaimed);
      } else {
        reasons.push(ClaimEligibility.WaitBeforeNextClaimTransaction);
      }
    }

    // if not within a browser conetext, check for wallet balance.
    // In browser context, let the wallet do that job
    if (claimCondition.price.gt(0) && isNode()) {
      const totalPrice = claimCondition.price.mul(quantity);
      const provider = this.contractWrapper.getProvider();
      if (isNativeToken(claimCondition.currencyAddress)) {
        const balance = await provider.getBalance(resolvedAddress);
        if (balance.lt(totalPrice)) {
          reasons.push(ClaimEligibility.NotEnoughTokens);
        }
      } else {
        const erc20 = new ContractWrapper<IERC20>(
          provider,
          claimCondition.currencyAddress,
          IERC20ABI,
          {},
        );

        const balance = await erc20.readContract.balanceOf(resolvedAddress);
        if (balance.lt(totalPrice)) {
          reasons.push(ClaimEligibility.NotEnoughTokens);
        }
      }
    }

    return reasons;
  }

  /**
   * Returns allow list information and merkle proofs for the given address.
   * @param tokenId - the token ID to check
   * @param claimerAddress - the claimer address
   * @param claimConditionId - optional the claim condition id to get the proofs for
   */
  public async getClaimerProofs(
    tokenId: BigNumberish,
    claimerAddress: AddressOrEns,
    claimConditionId?: BigNumberish,
  ): Promise<SnapshotEntryWithProof | null> {
    const claimCondition = await this.get(tokenId, claimConditionId);
    const merkleRoot = claimCondition.merkleRoot;
    const merkleRootArray = ethers.utils.stripZeros(merkleRoot);
    if (merkleRootArray.length > 0) {
      const metadata = await this.metadata.get();
      const resolvedAddress = await resolveAddress(claimerAddress);
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

  /** ***************************************
   * WRITE FUNCTIONS
   *****************************************/

  /**
   * Set claim conditions on a single NFT
   *
   * @remarks Sets the public mint conditions that need to be fulfilled by users to claim a particular NFT in this contract.
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
   * const tokenId = 0; // the id of the NFT to set claim conditions on
   * await dropContract.claimConditions.set(tokenId, claimConditions);
   * ```
   *
   * @param tokenId - The id of the NFT to set the claim conditions on
   * @param claimConditionInputs - The claim conditions
   * @param resetClaimEligibilityForAll - Whether to reset the state of who already claimed NFTs previously
   */
  set = buildTransactionFunction(
    async (
      tokenId: BigNumberish,
      claimConditionInputs: ClaimConditionInput[],
      resetClaimEligibilityForAll = false,
    ) => {
      return this.setBatch.prepare(
        [
          {
            tokenId,
            claimConditions: claimConditionInputs,
          },
        ],
        resetClaimEligibilityForAll,
      );
    },
  );

  /**
   * Set claim conditions on multiple NFTs at once
   *
   * @remarks Sets the claim conditions that need to be fulfilled by users to claim the given NFTs in this contract.
   *
   * @example
   * ```javascript
   * const claimConditionsForTokens = [
   *   {
   *     tokenId: 0,
   *     claimConditions: [{
   *       startTime: new Date(), // start the claim phase now
   *       maxClaimableSupply: 2, // limit how many mints for this tokenId
   *       price: 0.01, // price for this tokenId
   *       snapshot: ['0x...', '0x...'], // limit minting to only certain addresses
   *     }]
   *   },
   *   {
   *     tokenId: 1,
   *     claimConditions: [{
   *       startTime: new Date(),
   *       price: 0.08, // different price for this tokenId
   *     }]
   *   },
   * ];
   *
   * await dropContract.claimConditions.setBatch(claimConditionsForTokens);
   * ```
   *
   * @param claimConditionsForToken - The claim conditions for each NFT
   * @param resetClaimEligibilityForAll - Whether to reset the state of who already claimed NFTs previously
   */
  setBatch = buildTransactionFunction(
    async (
      claimConditionsForToken: ClaimConditionsForToken[],
      resetClaimEligibilityForAll = false,
    ) => {
      const merkleInfo: { [key: string]: string } = {};
      const processedClaimConditions = await Promise.all(
        claimConditionsForToken.map(async ({ tokenId, claimConditions }) => {
          // sanitize for single phase deletions
          let claimConditionsProcessed = claimConditions;
          if (this.isLegacySinglePhaseDrop(this.contractWrapper)) {
            resetClaimEligibilityForAll = true;
            if (claimConditions.length === 0) {
              claimConditionsProcessed = [
                {
                  startTime: new Date(0),
                  currencyAddress: ethers.constants.AddressZero,
                  price: 0,
                  maxClaimableSupply: 0,
                  maxClaimablePerWallet: 0,
                  waitInSeconds: 0,
                  merkleRootHash: utils.hexZeroPad([0], 32),
                  snapshot: [],
                },
              ];
            } else if (claimConditions.length > 1) {
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
                    "Set it to 0 to only allow addresses in the allowlist to claim the amount specified in the allowlist." +
                    "\n\nex:\n" +
                    "contract.claimConditions.set(tokenId, [{ snapshot: [{ address: '0x...', maxClaimable: 1 }], maxClaimablePerWallet: 0 }])",
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
              0,
              this.contractWrapper.getProvider(),
              this.storage,
              this.getSnapshotFormatVersion(),
            );

          snapshotInfos.forEach((s) => {
            merkleInfo[s.merkleRoot] = s.snapshotUri;
          });
          return {
            tokenId,
            sortedConditions,
          };
        }),
      );

      const metadata = await this.metadata.get();
      const encoded: string[] = [];

      // keep the old merkle roots from other tokenIds
      for (const key of Object.keys(metadata.merkle || {})) {
        merkleInfo[key] = metadata.merkle[key];
      }

      // upload new merkle roots to snapshot URIs if updated
      if (!deepEqual(metadata.merkle, merkleInfo)) {
        const mergedMetadata = await this.metadata.parseInputMetadata({
          ...metadata,
          merkle: merkleInfo,
        });
        // using internal method to just upload, avoids one contract call
        const contractURI = await this.metadata._parseAndUploadMetadata(
          mergedMetadata,
        );

        if (
          hasFunction<ContractMetadataContract>(
            "setContractURI",
            this.contractWrapper,
          )
        ) {
          encoded.push(
            this.contractWrapper.readContract.interface.encodeFunctionData(
              "setContractURI",
              [contractURI],
            ),
          );
        } else {
          throw new Error(
            "Setting a merkle root requires implementing ContractMetadata in your contract to support storing a merkle root.",
          );
        }
      }

      processedClaimConditions.forEach(({ tokenId, sortedConditions }) => {
        if (this.isLegacySinglePhaseDrop(this.contractWrapper)) {
          encoded.push(
            this.contractWrapper.readContract.interface.encodeFunctionData(
              "setClaimConditions",
              [
                tokenId,
                abstractContractModelToLegacy(sortedConditions[0]),
                resetClaimEligibilityForAll,
              ],
            ),
          );
        } else if (this.isLegacyMultiPhaseDrop(this.contractWrapper)) {
          encoded.push(
            this.contractWrapper.readContract.interface.encodeFunctionData(
              "setClaimConditions",
              [
                tokenId,
                sortedConditions.map(abstractContractModelToLegacy),
                resetClaimEligibilityForAll,
              ],
            ),
          );
        } else if (this.isNewSinglePhaseDrop(this.contractWrapper)) {
          encoded.push(
            this.contractWrapper.readContract.interface.encodeFunctionData(
              "setClaimConditions",
              [
                tokenId,
                abstractContractModelToNew(sortedConditions[0]),
                resetClaimEligibilityForAll,
              ],
            ),
          );
        } else if (this.isNewMultiphaseDrop(this.contractWrapper)) {
          encoded.push(
            this.contractWrapper.readContract.interface.encodeFunctionData(
              "setClaimConditions",
              [
                tokenId,
                sortedConditions.map(abstractContractModelToNew),
                resetClaimEligibilityForAll,
              ],
            ),
          );
        } else {
          throw new Error("Contract does not support claim conditions");
        }
      });

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "multicall",
        args: [encoded],
      });
    },
  );

  /**
   * Update a single claim condition with new data.
   * @param tokenId - the token id to update
   * @param index - the index of the claim condition to update, as given by the index from the result of `getAll()`
   * @param claimConditionInput - the new data to update, previous data will be retained
   */
  update = buildTransactionFunction(
    async (
      tokenId: BigNumberish,
      index: number,
      claimConditionInput: ClaimConditionInput,
    ) => {
      const existingConditions = await this.getAll(tokenId);
      const newConditionInputs = await updateExistingClaimConditions(
        index,
        claimConditionInput,
        existingConditions,
      );
      return await this.set.prepare(tokenId, newConditionInputs);
    },
  );

  /**
   * Returns proofs and the overrides required for the transaction.
   *
   * @returns - `overrides` and `proofs` as an object.
   */
  public async prepareClaim(
    tokenId: BigNumberish,
    quantity: BigNumberish,
    checkERC20Allowance: boolean,
    address?: AddressOrEns,
  ): Promise<ClaimVerification> {
    const addressToClaim = await resolveAddress(
      address ? address : await this.contractWrapper.getSignerAddress(),
    );
    return prepareClaim(
      addressToClaim,
      quantity,
      await this.getActive(tokenId),
      async () => (await this.metadata.get()).merkle,
      0,
      this.contractWrapper,
      this.storage,
      checkERC20Allowance,
      this.getSnapshotFormatVersion(),
    );
  }

  public async getClaimArguments(
    tokenId: BigNumberish,
    destinationAddress: AddressOrEns,
    quantity: BigNumberish,
    claimVerification: ClaimVerification,
  ): Promise<any[]> {
    const resolvedAddress = await resolveAddress(destinationAddress);
    if (this.isLegacyMultiPhaseDrop(this.contractWrapper)) {
      return [
        resolvedAddress,
        tokenId,
        quantity,
        claimVerification.currencyAddress,
        claimVerification.price,
        claimVerification.proofs,
        claimVerification.maxClaimable,
      ];
    } else if (this.isLegacySinglePhaseDrop(this.contractWrapper)) {
      return [
        resolvedAddress,
        tokenId,
        quantity,
        claimVerification.currencyAddress,
        claimVerification.price,
        {
          proof: claimVerification.proofs,
          maxQuantityInAllowlist: claimVerification.maxClaimable,
        } as IDropSinglePhase_V1.AllowlistProofStruct,
        ethers.utils.toUtf8Bytes(""),
      ];
    }
    return [
      resolvedAddress,
      tokenId,
      quantity,
      claimVerification.currencyAddress,
      claimVerification.price,
      {
        proof: claimVerification.proofs,
        quantityLimitPerWallet: claimVerification.maxClaimable,
        pricePerToken: claimVerification.priceInProof,
        currency: claimVerification.currencyAddressInProof,
      } as IDropSinglePhase.AllowlistProofStruct,
      ethers.utils.toUtf8Bytes(""),
    ];
  }

  /**
   * Construct a claim transaction without executing it.
   * This is useful for estimating the gas cost of a claim transaction, overriding transaction options and having fine grained control over the transaction execution.
   * @param destinationAddress - Address you want to send the token to
   * @param tokenId - Id of the token you want to claim
   * @param quantity - Quantity of the tokens you want to claim
   *
   * @deprecated Use `contract.erc1155.claim.prepare(...args)` instead
   */
  public async getClaimTransaction(
    destinationAddress: AddressOrEns,
    tokenId: BigNumberish,
    quantity: BigNumberish,
    options?: ClaimOptions,
  ): Promise<Transaction> {
    if (options?.pricePerToken) {
      throw new Error(
        "Price per token should be set via claim conditions by calling `contract.erc1155.claimConditions.set()`",
      );
    }
    const claimVerification = await this.prepareClaim(
      tokenId,
      quantity,
      options?.checkERC20Allowance || true,
    );
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "claim",
      args: await this.getClaimArguments(
        tokenId,
        destinationAddress,
        quantity,
        claimVerification,
      ),
      overrides: claimVerification.overrides,
    });
  }

  isNewSinglePhaseDrop(
    contractWrapper: ContractWrapper<any>,
  ): contractWrapper is ContractWrapper<DropSinglePhase1155> {
    return detectContractFeature<DropSinglePhase1155>(
      contractWrapper,
      "ERC1155ClaimConditionsV2",
    );
  }

  isNewMultiphaseDrop(
    contractWrapper: ContractWrapper<any>,
  ): contractWrapper is ContractWrapper<Drop1155> {
    return detectContractFeature<Drop1155>(
      contractWrapper,
      "ERC1155ClaimPhasesV2",
    );
  }

  isLegacySinglePhaseDrop(
    contractWrapper: ContractWrapper<any>,
  ): contractWrapper is ContractWrapper<DropSinglePhase1155_V1> {
    return detectContractFeature<DropSinglePhase1155_V1>(
      contractWrapper,
      "ERC1155ClaimConditionsV1",
    );
  }

  isLegacyMultiPhaseDrop(
    contractWrapper: ContractWrapper<any>,
  ): contractWrapper is ContractWrapper<DropERC1155_V2> {
    return detectContractFeature<DropERC1155_V2>(
      contractWrapper,
      "ERC1155ClaimPhasesV1",
    );
  }

  private getSnapshotFormatVersion(): SnapshotFormatVersion {
    return this.isLegacyMultiPhaseDrop(this.contractWrapper) ||
      this.isLegacySinglePhaseDrop(this.contractWrapper)
      ? SnapshotFormatVersion.V1
      : SnapshotFormatVersion.V2;
  }
}
