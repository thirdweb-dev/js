import { BigNumberish, utils } from "ethers";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { ClaimVerification } from "../../types/claim-conditions/claim-conditions";
import { isLegacySinglePhaseDrop } from "./isLegacySinglePhaseDrop";
import { resolveAddress } from "../../common/ens/resolveAddress";
import { ContractWrapper } from "../classes/contract-wrapper";
import { isLegacyMultiPhaseDrop } from "./isLegacyMultiPhaseDrop";
import { IDropSinglePhase_V1 } from "@thirdweb-dev/contracts-js";
import type { IDropSinglePhase } from "@thirdweb-dev/contracts-js/src/DropSinglePhase";
import {
  BaseClaimConditionERC721,
  BaseDropERC20,
  PrebuiltNFTDrop,
  PrebuiltTokenDrop,
} from "../../types/eips";

export async function getClaimArguments(
  destinationAddress: AddressOrEns,
  quantity: BigNumberish,
  claimVerification: ClaimVerification,
  contractWrapper: ContractWrapper<
    | PrebuiltNFTDrop
    | PrebuiltTokenDrop
    | BaseClaimConditionERC721
    | BaseDropERC20
  >,
): Promise<any[]> {
  const resolvedAddress = await resolveAddress(destinationAddress);
  if (isLegacyMultiPhaseDrop(contractWrapper)) {
    return [
      resolvedAddress,
      quantity,
      claimVerification.currencyAddress,
      claimVerification.price,
      claimVerification.proofs,
      claimVerification.maxClaimable,
    ];
  } else if (isLegacySinglePhaseDrop(contractWrapper)) {
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
