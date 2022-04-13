import { NFTDropKeys, editionDropKeys } from "../cache-keys";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";
import { useEditionDropResetClaimEligibilityMutation } from "./useEditionDrop";
import { useNFTDropResetClaimEligibilityMutation } from "./useNFTDrop";
import { ClaimConditionInput, EditionDrop, NFTDrop } from "@thirdweb-dev/sdk";
import invariant from "tiny-invariant";

export function useClaimPhases(
  contract?: NFTDrop | EditionDrop,
  tokenId?: string,
) {
  if (contract instanceof NFTDrop) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useNFTDropClaimPhases(contract);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useEditionDropClaimPhases(contract, tokenId);
  }
}

function useNFTDropClaimPhases(contract?: NFTDrop) {
  return useQueryWithNetwork(
    NFTDropKeys.claimPhases(contract?.getAddress()),
    () => contract?.claimConditions.getAll(),
    {
      enabled: !!contract,
    },
  );
}

function useEditionDropClaimPhases(contract?: EditionDrop, tokenId?: string) {
  return useQueryWithNetwork(
    editionDropKeys.claimPhases(contract?.getAddress(), tokenId),
    () => contract?.claimConditions.getAll(tokenId as string),
    {
      enabled: !!contract && !!tokenId,
    },
  );
}

export function useClaimPhasesMutation(
  contract?: NFTDrop | EditionDrop,
  tokenId?: string,
) {
  if (contract instanceof NFTDrop) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useNFTDropPhasesMutation(contract);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useEditionDropPhasesMutation(contract, tokenId);
  }
}

export function useResetEligibilityMutation(
  contract?: NFTDrop | EditionDrop,
  tokenId?: string,
) {
  if (contract instanceof NFTDrop) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useNFTDropResetClaimEligibilityMutation(contract);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useEditionDropResetClaimEligibilityMutation(contract, tokenId);
  }
}

function useNFTDropPhasesMutation(contract?: NFTDrop) {
  return useMutationWithInvalidate(
    async (phases: ClaimConditionInput[]) => {
      invariant(contract, "contract is required");

      return await contract.claimConditions.set(phases);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([NFTDropKeys.claimPhases(contract?.getAddress())]);
      },
    },
  );
}

function useEditionDropPhasesMutation(
  contract?: EditionDrop,
  tokenId?: string,
) {
  return useMutationWithInvalidate(
    async (phases: ClaimConditionInput[]) => {
      invariant(contract, "contract is required");
      invariant(tokenId, "tokenId is required");

      return await contract.claimConditions.set(tokenId, phases);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([
          editionDropKeys.claimPhases(contract?.getAddress(), tokenId),
        ]);
      },
    },
  );
}
