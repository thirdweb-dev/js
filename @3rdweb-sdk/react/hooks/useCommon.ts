import {
  CacheKeyMap,
  platformFeeKeys,
  recipientKeys,
  royaltyKeys,
} from "../cache-keys";
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

interface ITransferInput {
  to: string;
  amount?: string;
  tokenId?: string;
}

interface IAirdropInput {
  tokenId: string;
  addresses: { address: string; quantity?: string }[];
}

export type TransferableContract =
  | NFTCollection
  | Edition
  | Token
  | NFTDrop
  | EditionDrop
  | TokenDrop
  | SignatureDrop;
// | PackContract;

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

export function useTransferMutation<TContract extends ValidContractInstance>(
  contract?: TContract,
) {
  const contractType = useContractTypeOfContract(contract);

  return useMutationWithInvalidate(
    async (transferData: ITransferInput) => {
      invariant(
        contract,
        "Contract is not a valid contract. Please use a valid contract",
      );
      invariant(
        "transfer" in contract,
        "Contract does not support transfer functionality",
      );
      if (
        contract instanceof NFTCollection ||
        contract instanceof NFTDrop ||
        contract instanceof SignatureDrop
      ) {
        invariant(transferData.tokenId, "tokenId is required");
        return await contract.transfer(transferData.to, transferData.tokenId);
      } else if (
        contract instanceof Edition ||
        contract instanceof EditionDrop
      ) {
        invariant(transferData.amount, "amount is required");
        invariant(transferData.tokenId, "tokenId is required");

        return await contract.transfer(
          transferData.to,
          transferData.tokenId,
          transferData.amount,
        );
      } else if (contract instanceof Token) {
        invariant(transferData.amount, "amount is required");
        return await contract.transfer(transferData.to, transferData.amount);
      }
      throw new Error("Contract is not a valid contract");
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        // this should not be possible, but we need to catch it in case it does
        // if we don't know we just invalidate everything.
        if (!contractType) {
          return invalidate(
            Object.keys(CacheKeyMap)
              .map((key) => {
                const cacheKeys = CacheKeyMap[key as keyof typeof CacheKeyMap];
                if ("list" in cacheKeys) {
                  return cacheKeys.list(contract?.getAddress());
                }
                return undefined as never;
              })
              .filter((fn) => !!fn),
          );
        }

        return invalidate([
          CacheKeyMap[contractType].list(contract?.getAddress()),
        ]);
      },
    },
  );
}

export function useAirdropMutation<TContract extends ValidContractInstance>(
  contract?: TContract,
) {
  const contractType = useContractTypeOfContract(contract);

  return useMutationWithInvalidate(
    async (airdropData: IAirdropInput) => {
      invariant(
        contract,
        "Contract is not a valid contract. Please use a valid contract",
      );
      invariant(
        "airdrop" in contract,
        "Contract does not support airdrop functionality",
      );
      if (contract instanceof Edition || contract instanceof EditionDrop) {
        return await contract.airdrop(
          airdropData.tokenId,
          airdropData.addresses,
        );
      }
      throw new Error("Contract is not a valid contract");
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        // this should not be possible, but we need to catch it in case it does
        // if we don't know we just invalidate everything.
        if (!contractType) {
          return invalidate(
            Object.keys(CacheKeyMap)
              .map((key) => {
                const cacheKeys = CacheKeyMap[key as keyof typeof CacheKeyMap];
                if ("list" in cacheKeys) {
                  return cacheKeys.list(contract?.getAddress());
                }
                return undefined as never;
              })
              .filter((fn) => !!fn),
          );
        }

        return invalidate([
          CacheKeyMap[contractType].list(contract?.getAddress()),
        ]);
      },
    },
  );
}
