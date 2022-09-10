import { platformFeeKeys, recipientKeys, royaltyKeys } from "../cache-keys";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";
import {
  CommonPlatformFeeSchema,
  CommonRoyaltySchema,
  ContractType,
  Edition,
  EditionDrop,
  Marketplace,
  NFTCollection,
  NFTDrop,
  SignatureDrop,
  Split,
  Token,
  TokenDrop,
  ValidContractInstance,
  Vote,
} from "@thirdweb-dev/sdk";
import invariant from "tiny-invariant";
import { z } from "zod";

export function useRealContract<T extends ValidContractInstance>(contract: T) {
  if (contract instanceof NFTDrop) {
    return contract as NFTDrop;
  } else if (contract instanceof EditionDrop) {
    return contract as EditionDrop;
  } else if (contract instanceof NFTCollection) {
    return contract as NFTCollection;
  } else if (contract instanceof Edition) {
    return contract as Edition;
  } else if (contract instanceof Token) {
    return contract as Token;
  } else if (contract instanceof Marketplace) {
    return contract as Marketplace;
  } else if (contract instanceof Vote) {
    return contract as Vote;
  } else if (contract instanceof Split) {
    return contract as Split;
  } else if (contract instanceof TokenDrop) {
    return contract as TokenDrop;
  } else if (contract instanceof SignatureDrop) {
    return contract as SignatureDrop;
  }

  throw new Error("Contract is not a valid contract");
}

export function useContractConstructor<T extends ValidContractInstance>(
  contract?: T,
) {
  if (contract instanceof NFTDrop) {
    return NFTDrop;
  } else if (contract instanceof EditionDrop) {
    return EditionDrop;
  } else if (contract instanceof NFTCollection) {
    return NFTCollection;
  } else if (contract instanceof Edition) {
    return Edition;
  } else if (contract instanceof Token) {
    return Token;
  } else if (contract instanceof Marketplace) {
    return Marketplace;
  } else if (contract instanceof Vote) {
    return Vote;
  } else if (contract instanceof Split) {
    return Split;
  } else if (contract instanceof TokenDrop) {
    return TokenDrop;
  } else if (contract instanceof SignatureDrop) {
    return SignatureDrop;
  }

  throw new Error("Contract is not a valid contract");
}

export function contractTypeFromContract(contract: ValidContractInstance) {
  if (contract instanceof NFTDrop) {
    return NFTDrop.contractType;
  } else if (contract instanceof EditionDrop) {
    return EditionDrop.contractType;
  } else if (contract instanceof NFTCollection) {
    return NFTCollection.contractType;
  } else if (contract instanceof Edition) {
    return Edition.contractType;
  } else if (contract instanceof Token) {
    return Token.contractType;
  } else if (contract instanceof Marketplace) {
    return Marketplace.contractType;
  } else if (contract instanceof Vote) {
    return Vote.contractType;
  } else if (contract instanceof Split) {
    return Split.contractType;
  } else if (contract instanceof TokenDrop) {
    return TokenDrop.contractType;
  } else if (contract instanceof SignatureDrop) {
    return SignatureDrop.contractType;
  }

  throw new Error("Contract does not have a contractType");
}

export function useContractTypeOfContract<T extends ValidContractInstance>(
  contract?: T,
): ContractType | null {
  if (!contract) {
    return null;
  }
  return contractTypeFromContract(contract);
}

export function usePascalCaseContractName(contractName: string) {
  if (!contractName) {
    return null;
  } else if (contractName === "nft-drop") {
    return "NFTDrop";
  } else if (contractName === "edition-drop") {
    return "EditionDrop";
  } else if (contractName === "nft-collection") {
    return "NFTCollection";
  } else if (contractName === "edition") {
    return "Edition";
  } else if (contractName === "token") {
    return "Token";
  } else if (contractName === "marketplace") {
    return "Marketplace";
  } else if (contractName === "vote") {
    return "Vote";
  } else if (contractName === "split") {
    return "Split";
  } else if (contractName === "token-drop") {
    return "TokenDrop";
  } else if (contractName === "signature-drop") {
    return "SignatureDrop";
  } else {
    return contractName;
  }
}

export function useContractName<T extends ValidContractInstance>(
  contract?: T,
): string | null {
  if (!contract) {
    return null;
  } else if (contract instanceof NFTDrop) {
    return "NFTDrop";
  } else if (contract instanceof EditionDrop) {
    return "EditionDrop";
  } else if (contract instanceof NFTCollection) {
    return "NFTCollection";
  } else if (contract instanceof Edition) {
    return "Edition";
  } else if (contract instanceof Token) {
    return "Token";
  } else if (contract instanceof Marketplace) {
    return "Marketplace";
  } else if (contract instanceof Vote) {
    return "Vote";
  } else if (contract instanceof Split) {
    return "Split";
  } else if (contract instanceof TokenDrop) {
    return "TokenDrop";
  } else if (contract instanceof SignatureDrop) {
    return "SignatureDrop";
  }

  throw new Error("Contract does not have a contractType");
}

export type TransferableContract =
  | NFTCollection
  | Edition
  | Token
  | NFTDrop
  | EditionDrop
  | TokenDrop
  | SignatureDrop;

export type RecipientContract = NFTDrop | EditionDrop | SignatureDrop;

export function hasPrimarySaleMechanic(
  contract: ValidContractInstance,
): contract is RecipientContract {
  return "sales" in contract;
}

export function useSaleRecipient<TContract extends RecipientContract>(
  contract?: TContract,
  tokenId?: string,
) {
  return useQueryWithNetwork(
    tokenId
      ? recipientKeys.token(contract?.getAddress(), tokenId)
      : recipientKeys.detail(contract?.getAddress()),
    async () => await contract?.sales.getRecipient(),
    {
      enabled: !!contract,
    },
  );
}
export function useSetSaleRecipientMutation<
  TContract extends RecipientContract,
>(contract?: TContract, tokenId?: string) {
  return useMutationWithInvalidate(
    (recipientAddress: string) => {
      invariant(contract, "contract must be defined");

      return contract?.sales.setRecipient(recipientAddress);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        if (tokenId) {
          invalidate([recipientKeys.token(contract?.getAddress(), tokenId)]);
        } else {
          invalidate([recipientKeys.detail(contract?.getAddress())]);
        }
      },
    },
  );
}

export type RoyaltyContract =
  | NFTDrop
  | EditionDrop
  | NFTCollection
  | Edition
  | SignatureDrop;

export function hasRoyaltyMechanic(
  contract: ValidContractInstance,
): contract is RoyaltyContract {
  return "royalties" in contract;
}

export function useContractRoyalty<TContract extends RoyaltyContract>(
  contract?: TContract,
) {
  return useQueryWithNetwork(
    royaltyKeys.detail(contract?.getAddress()),
    async () => await contract?.royalties.getDefaultRoyaltyInfo(),
    {
      enabled: !!contract,
    },
  );
}
export function useContractRoyaltyMutation<TContract extends RoyaltyContract>(
  contract?: TContract,
) {
  return useMutationWithInvalidate(
    (data: z.input<typeof CommonRoyaltySchema>) => {
      invariant(contract, "contract must be defined");

      return contract?.royalties.setDefaultRoyaltyInfo(data);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        invalidate([royaltyKeys.detail(contract?.getAddress())]);
      },
    },
  );
}

export type PlatformFeeContract =
  | NFTCollection
  | NFTDrop
  | Edition
  | EditionDrop
  | Token
  | Marketplace
  | SignatureDrop;

export function hasPlatformFeeMechanic(
  contract: ValidContractInstance,
): contract is PlatformFeeContract {
  return "platformFees" in contract;
}

export function useContractPlatformFee<TContract extends PlatformFeeContract>(
  contract?: TContract,
) {
  return useQueryWithNetwork(
    platformFeeKeys.detail(contract?.getAddress()),
    async () => await contract?.platformFees.get(),
    {
      enabled: !!contract,
    },
  );
}
export function useContractPlatformFeeMutation<
  TContract extends PlatformFeeContract,
>(contract?: TContract) {
  return useMutationWithInvalidate(
    (data: z.input<typeof CommonPlatformFeeSchema>) => {
      invariant(contract, "contract must be defined");

      return contract?.platformFees.set(data);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        invalidate([platformFeeKeys.detail(contract?.getAddress())]);
      },
    },
  );
}
