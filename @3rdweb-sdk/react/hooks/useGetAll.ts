import { useQueryWithNetwork } from "./query/useQueryWithNetwork";
// eslint-disable-next-line import/no-cycle
import { useContractTypeOfContract } from "./useCommon";
import { AddressZero } from "@ethersproject/constants";
import {
  EditionDrop,
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
) => {
  // this "hook" is a basic function that returns the cache key for the getAll function
  const contractType =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useContractTypeOfContract(contract) || ("invalid-contract" as const);
  const contractAddress = contract?.getAddress() || AddressZero;
  return queryParams
    ? ([contractType, contractAddress, "getAll", queryParams] as const)
    : ([contractType, contractAddress, "getAll"] as const);
};

export const getTotalCountQueryKey = (contract?: ValidContractInstance) => {
  // this "hook" is a basic function that returns the cache key for the getAll function
  const contractType =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useContractTypeOfContract(contract) || ("invalid-contract" as const);
  const contractAddress = contract?.getAddress() || AddressZero;
  return [contractType, contractAddress, "totalCount"] as const;
};

export type ContractWithGetAll = U.Exclude<
  ValidContractInstance,
  Vote | Split | Token | Pack | TokenDrop
>;
export function useGetAll<TContract extends ContractWithGetAll>(
  contract?: TContract,
  queryParams: QueryAllParams = { count: 50, start: 0 },
) {
  const queryKey = getAllQueryKey(contract, queryParams);

  return useQueryWithNetwork(
    queryKey,
    async () => {
      if (!contract) {
        return [];
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
) {
  const queryKey = getTotalCountQueryKey(contract);
  return useQueryWithNetwork(
    queryKey,
    async () => {
      if (!contract) {
        return BigNumber.from(0);
      }
      if (contract instanceof EditionDrop) {
        return await contract.getTotalCount();
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
