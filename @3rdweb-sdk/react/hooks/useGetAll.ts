import { useQueryWithNetwork } from "./query/useQueryWithNetwork";
// eslint-disable-next-line import/no-cycle
import { useContractTypeOfContract } from "./useCommon";
import { AddressZero } from "@ethersproject/constants";
import {
  Pack,
  QueryAllParams,
  Split,
  Token,
  TokenDrop,
  ValidContractInstance,
  Vote,
} from "@thirdweb-dev/sdk";
import { BigNumber } from "ethers";
import { U } from "ts-toolbelt";

export const getAllQueryKey = (
  contract?: ValidContractInstance,
  queryParams?: QueryAllParams,
  isLazy = false,
) => {
  // this "hook" is a basic function that returns the cache key for the getAll function
  const contractType =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useContractTypeOfContract(contract) || ("invalid-contract" as const);
  const contractAddress = contract?.getAddress() || AddressZero;
  return queryParams
    ? ([
        contractType,
        contractAddress,
        "getAll",
        queryParams,
        { isLazy },
      ] as const)
    : ([contractType, contractAddress, "getAll", { isLazy }] as const);
};

export const getTotalCountQueryKey = (
  contract?: ValidContractInstance,
  isLazy = false,
) => {
  // this "hook" is a basic function that returns the cache key for the getAll function
  const contractType =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useContractTypeOfContract(contract) || ("invalid-contract" as const);
  const contractAddress = contract?.getAddress() || AddressZero;
  return [contractType, contractAddress, "totalCount", { isLazy }] as const;
};

export type ContractWithGetAll = U.Exclude<
  ValidContractInstance,
  Vote | Split | Token | Pack | TokenDrop
>;
export function useGetAll<TContract extends ContractWithGetAll>(
  contract?: TContract,
  queryParams: QueryAllParams = { count: 50, start: 0 },
  lazyMint?: true,
) {
  const queryKey = getAllQueryKey(contract, queryParams, lazyMint);

  return useQueryWithNetwork(
    queryKey,
    async () => {
      if (!contract) {
        return [];
      }

      if (lazyMint && "getAllUnclaimed" in contract) {
        return (await contract.getAllUnclaimed(queryParams)).map(
          (metadata) => ({ metadata, owner: AddressZero }),
        );
      }
      if ("getAll" in contract) {
        return await contract.getAll(queryParams);
      }
      return [];
    },
    { enabled: !!contract && "getAll" in contract, keepPreviousData: true },
  );
}

export function useGetTotalCount<TContract extends ContractWithGetAll>(
  contract?: TContract,
  lazyMint?: true,
) {
  const queryKey = getTotalCountQueryKey(contract, lazyMint);
  return useQueryWithNetwork(
    queryKey,
    async () => {
      if (!contract) {
        return BigNumber.from(0);
      }
      if (lazyMint && "totalUnclaimedSupply" in contract) {
        return await contract.totalUnclaimedSupply();
      }
      if ("totalSupply" in contract) {
        return await contract.totalSupply(0);
      }
      if ("getTotalCount" in contract) {
        return await contract.getTotalCount();
      }
      return BigNumber.from(0);
    },
    {
      enabled: !!contract,
      keepPreviousData: true,
    },
  );
}
