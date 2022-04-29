import { NFTDropKeys, editionDropKeys, tokenDropKeys } from "../cache-keys";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";
import { useEditionDropResetClaimEligibilityMutation } from "./useEditionDrop";
import { useNFTDropResetClaimEligibilityMutation } from "./useNFTDrop";
import {
  useTokenDropData,
  useTokenDropResetClaimEligibilityMutation,
} from "./useTokenDrop";
import {
  ClaimConditionInput,
  EditionDrop,
  NFTDrop,
  TokenDrop,
} from "@thirdweb-dev/sdk";
import invariant from "tiny-invariant";

export function useDecimals(contract?: NFTDrop | EditionDrop | TokenDrop) {
  if (contract instanceof NFTDrop || contract instanceof EditionDrop) {
    return 0;
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTokenDropData(contract?.getAddress()).data?.decimals;
  }
}

export function useClaimPhases(
  contract?: NFTDrop | EditionDrop | TokenDrop,
  tokenId?: string,
) {
  if (contract instanceof NFTDrop) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useNFTDropClaimPhases(contract);
  } else if (contract instanceof EditionDrop) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useEditionDropClaimPhases(contract, tokenId);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTokenDropClaimPhases(contract);
  }
}

function useNFTDropClaimPhases(contract?: NFTDrop) {
  return useQueryWithNetwork(
    NFTDropKeys.claimPhases(contract?.getAddress()),
    async () => await contract?.claimConditions.getAll(),
    {
      enabled: !!contract,
    },
  );
}

function useEditionDropClaimPhases(contract?: EditionDrop, tokenId?: string) {
  return useQueryWithNetwork(
    editionDropKeys.claimPhases(contract?.getAddress(), tokenId),
    async () => await contract?.claimConditions.getAll(tokenId as string),
    {
      enabled: !!contract && !!tokenId,
    },
  );
}

function useTokenDropClaimPhases(contract?: TokenDrop) {
  return useQueryWithNetwork(
    tokenDropKeys.claimPhases(contract?.getAddress()),
    async () => await contract?.claimConditions.getAll(),
    {
      enabled: !!contract,
    },
  );
}

export function useClaimPhasesMutation(
  contract?: NFTDrop | EditionDrop | TokenDrop,
  tokenId?: string,
) {
  if (contract instanceof NFTDrop) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useNFTDropPhasesMutation(contract);
  } else if (contract instanceof EditionDrop) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useEditionDropPhasesMutation(contract, tokenId);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTokenDropPhasesMutation(contract);
  }
}

export function useResetEligibilityMutation(
  contract?: NFTDrop | EditionDrop | TokenDrop,
  tokenId?: string,
) {
  if (contract instanceof NFTDrop) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useNFTDropResetClaimEligibilityMutation(contract);
  } else if (contract instanceof EditionDrop) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useEditionDropResetClaimEligibilityMutation(contract, tokenId);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTokenDropResetClaimEligibilityMutation(contract);
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

function useTokenDropPhasesMutation(contract?: TokenDrop) {
  return useMutationWithInvalidate(
    async (phases: ClaimConditionInput[]) => {
      invariant(contract, "contract is required");

      return await contract.claimConditions.set(phases);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([tokenDropKeys.claimPhases(contract?.getAddress())]);
      },
    },
  );
}
