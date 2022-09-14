import { includesErrorMessage } from "../../common";
import {
  getClaimerProofs,
  prepareClaim,
  processClaimConditionInputs,
  transformResultToClaimCondition,
  updateExistingClaimConditions,
} from "../../common/claim-conditions";
import { isNativeToken } from "../../common/currency";
import { hasFunction } from "../../common/feature-detection";
import { isNode } from "../../common/utils";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/index";
import { ClaimEligibility } from "../../enums";
import {
  ClaimCondition,
  ClaimConditionInput,
  ClaimConditionsForToken,
  ClaimVerification,
} from "../../types";
import { BaseClaimConditionERC1155 } from "../../types/eips";
import { TransactionResult } from "../index";
import { ContractMetadata } from "./contract-metadata";
import { ContractWrapper } from "./contract-wrapper";
import type {
  ContractMetadata as ContractMetadataContract,
  DropERC1155,
  DropSinglePhase1155,
  IERC20,
} from "@thirdweb-dev/contracts-js";
import IERC20ABI from "@thirdweb-dev/contracts-js/dist/abis/IERC20.json";
import { IDropClaimCondition } from "@thirdweb-dev/contracts-js/dist/declarations/src/DropERC1155";
import { IStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, constants, ethers, utils } from "ethers";
import deepEqual from "fast-deep-equal";

/**
 * Manages claim conditions for Edition Drop contracts
 * @public
 */
export class DropErc1155ClaimConditions<
  TContract extends DropERC1155 | BaseClaimConditionERC1155,
> {
  private contractWrapper;
  private metadata;
  private storage: IStorage;

  constructor(
    contractWrapper: ContractWrapper<TContract>,
    metadata: ContractMetadata<TContract, any>,
    storage: IStorage,
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
  public async getActive(tokenId: BigNumberish): Promise<ClaimCondition> {
    const mc = await this.get(tokenId);
    const metadata = await this.metadata.get();
    return await transformResultToClaimCondition(
      mc,
      0,
      this.contractWrapper.getProvider(),
      metadata.merkle,
      this.storage,
    );
  }

  private async get(
    tokenId: BigNumberish,
  ): Promise<IDropClaimCondition.ClaimConditionStructOutput> {
    if (this.isSinglePhaseDropContract(this.contractWrapper)) {
      return (await this.contractWrapper.readContract.claimCondition(
        tokenId,
      )) as IDropClaimCondition.ClaimConditionStructOutput;
    } else if (this.isMultiPhaseDropContract(this.contractWrapper)) {
      const id =
        await this.contractWrapper.readContract.getActiveClaimConditionId(
          tokenId,
        );
      return await this.contractWrapper.readContract.getClaimConditionById(
        tokenId,
        id,
      );
    } else {
      throw new Error("Contract does not support claim conditions");
    }
  }

  /**
   * Get all the claim conditions
   *
   * @returns the claim conditions metadata
   */
  public async getAll(tokenId: BigNumberish): Promise<ClaimCondition[]> {
    if (this.isMultiPhaseDropContract(this.contractWrapper)) {
      const claimCondition =
        (await this.contractWrapper.readContract.claimCondition(tokenId)) as {
          currentStartId: BigNumber;
          count: BigNumber;
        };
      const startId = claimCondition.currentStartId.toNumber();
      const count = claimCondition.count.toNumber();
      const conditions: IDropClaimCondition.ClaimConditionStructOutput[] = [];
      for (let i = startId; i < startId + count; i++) {
        conditions.push(
          await this.contractWrapper.readContract.getClaimConditionById(
            tokenId,
            i,
          ),
        );
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
          ),
        ),
      );
    } else {
      return [await this.getActive(tokenId)];
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
    addressToCheck?: string,
  ): Promise<boolean> {
    // TODO switch to use verifyClaim
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
    addressToCheck?: string,
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
    if (merkleRootArray.length > 0) {
      const merkleLower = claimCondition.merkleRootHash.toString();
      const metadata = await this.metadata.get();
      const proofs = await getClaimerProofs(
        addressToCheck,
        merkleLower,
        0,
        metadata.merkle,
        this.storage,
      );
      try {
        let validMerkleProof;
        if (this.isMultiPhaseDropContract(this.contractWrapper)) {
          activeConditionIndex =
            await this.contractWrapper.readContract.getActiveClaimConditionId(
              tokenId,
            );
          [validMerkleProof] =
            await this.contractWrapper.readContract.verifyClaimMerkleProof(
              activeConditionIndex,
              addressToCheck,
              tokenId,
              quantity,
              proofs.proof,
              proofs.maxClaimable,
            );
        } else if (this.isSinglePhaseDropContract(this.contractWrapper)) {
          [validMerkleProof] =
            await this.contractWrapper.readContract.verifyClaimMerkleProof(
              tokenId,
              addressToCheck,
              quantity,
              {
                proof: proofs.proof,
                maxQuantityInAllowlist: proofs.maxClaimable,
              },
            );
        }

        if (!validMerkleProof) {
          reasons.push(ClaimEligibility.AddressNotAllowed);
          return reasons;
        }
      } catch (e) {
        reasons.push(ClaimEligibility.AddressNotAllowed);
        return reasons;
      }
    }

    // check for claim timestamp between claims
    let [lastClaimedTimestamp, timestampForNextClaim] = [
      BigNumber.from(0),
      BigNumber.from(0),
    ];
    if (this.isMultiPhaseDropContract(this.contractWrapper)) {
      activeConditionIndex =
        await this.contractWrapper.readContract.getActiveClaimConditionId(
          tokenId,
        );
      [lastClaimedTimestamp, timestampForNextClaim] =
        await this.contractWrapper.readContract.getClaimTimestamp(
          tokenId,
          activeConditionIndex,
          addressToCheck,
        );
    } else if (this.isSinglePhaseDropContract(this.contractWrapper)) {
      [lastClaimedTimestamp, timestampForNextClaim] =
        await this.contractWrapper.readContract.getClaimTimestamp(
          tokenId,
          addressToCheck,
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
        const balance = await provider.getBalance(addressToCheck);
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

        const balance = await erc20.readContract.balanceOf(addressToCheck);
        if (balance.lt(totalPrice)) {
          reasons.push(ClaimEligibility.NotEnoughTokens);
        }
      }
    }

    return reasons;
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
   *     maxQuantity: 2, // limit how many mints for this presale
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
  public async set(
    tokenId: BigNumberish,
    claimConditionInputs: ClaimConditionInput[],
    resetClaimEligibilityForAll = false,
  ): Promise<TransactionResult> {
    return this.setBatch(
      [
        {
          tokenId,
          claimConditions: claimConditionInputs,
        },
      ],
      resetClaimEligibilityForAll,
    );
  }

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
   *       maxQuantity: 2, // limit how many mints for this tokenId
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
  public async setBatch(
    claimConditionsForToken: ClaimConditionsForToken[],
    resetClaimEligibilityForAll = false,
  ) {
    const merkleInfo: { [key: string]: string } = {};
    const processedClaimConditions = await Promise.all(
      claimConditionsForToken.map(async ({ tokenId, claimConditions }) => {
        // sanitize for single phase deletions
        let claimConditionsProcessed = claimConditions;
        if (this.isSinglePhaseDropContract(this.contractWrapper)) {
          resetClaimEligibilityForAll = true;
          if (claimConditions.length === 0) {
            claimConditionsProcessed = [
              {
                startTime: new Date(0),
                currencyAddress: NATIVE_TOKEN_ADDRESS,
                price: 0,
                maxQuantity: 0,
                quantityLimitPerTransaction: 0,
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
        // process inputs
        const { snapshotInfos, sortedConditions } =
          await processClaimConditionInputs(
            claimConditionsProcessed,
            0,
            this.contractWrapper.getProvider(),
            this.storage,
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
      const mergedMetadata = this.metadata.parseInputMetadata({
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
      if (this.isSinglePhaseDropContract(this.contractWrapper)) {
        encoded.push(
          this.contractWrapper.readContract.interface.encodeFunctionData(
            "setClaimConditions",
            [tokenId, sortedConditions[0], resetClaimEligibilityForAll],
          ),
        );
      } else if (this.isMultiPhaseDropContract(this.contractWrapper)) {
        encoded.push(
          this.contractWrapper.readContract.interface.encodeFunctionData(
            "setClaimConditions",
            [tokenId, sortedConditions, resetClaimEligibilityForAll],
          ),
        );
      } else {
        throw new Error("Contract does not support claim conditions");
      }
    });

    return {
      receipt: await this.contractWrapper.multiCall(encoded),
    };
  }

  /**
   * Update a single claim condition with new data.
   * @param tokenId - the token id to update
   * @param index - the index of the claim condition to update, as given by the index from the result of `getAll()`
   * @param claimConditionInput - the new data to update, previous data will be retained
   */
  public async update(
    tokenId: BigNumberish,
    index: number,
    claimConditionInput: ClaimConditionInput,
  ): Promise<TransactionResult> {
    const existingConditions = await this.getAll(tokenId);
    const newConditionInputs = await updateExistingClaimConditions(
      index,
      claimConditionInput,
      existingConditions,
    );
    return await this.set(tokenId, newConditionInputs);
  }

  /**
   * Returns proofs and the overrides required for the transaction.
   *
   * @returns - `overrides` and `proofs` as an object.
   */
  public async prepareClaim(
    tokenId: BigNumberish,
    quantity: BigNumberish,
    checkERC20Allowance: boolean,
  ): Promise<ClaimVerification> {
    return prepareClaim(
      quantity,
      await this.getActive(tokenId),
      async () => (await this.metadata.get()).merkle,
      0,
      this.contractWrapper,
      this.storage,
      checkERC20Allowance,
    );
  }

  private isSinglePhaseDropContract(
    contractWrapper: ContractWrapper<any>,
  ): contractWrapper is ContractWrapper<DropSinglePhase1155> {
    return !hasFunction<DropSinglePhase1155>(
      "getClaimConditionById",
      contractWrapper,
    );
  }

  private isMultiPhaseDropContract(
    contractWrapper: ContractWrapper<any>,
  ): contractWrapper is ContractWrapper<DropERC1155> {
    return hasFunction<DropERC1155>("getClaimConditionById", contractWrapper);
  }
}
