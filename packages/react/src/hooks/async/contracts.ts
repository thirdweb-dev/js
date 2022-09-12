import { useActiveChainId, useSDK } from "../../Provider";
import { ContractAddress, RequiredParam } from "../../types";
import {
  cacheKeys,
  createCacheKeyWithNetwork,
  invalidateContractAndBalances,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import {
  QueryClient,
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  ContractEvent,
  EventQueryFilter,
  SUPPORTED_CHAIN_ID,
  ThirdwebSDK,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";
import { SmartContractImpl } from "@thirdweb-dev/sdk/dist/declarations/src/contracts/classes/smart-contract";
import { useEffect, useMemo } from "react";
import invariant from "tiny-invariant";

// contract type

async function fetchContractType(
  contractAddress: RequiredParam<ContractAddress>,
  sdk: RequiredParam<ThirdwebSDK>,
) {
  if (!contractAddress || !sdk) {
    return null;
  }
  try {
    return await sdk.resolveContractType(contractAddress);
  } catch (err) {
    // this error can happen if the contract is a custom contract -> assume "custom"
    return "custom" as const;
  }
}

function useContractType(contractAddress: RequiredParam<ContractAddress>) {
  const sdk = useSDK();

  return useQueryWithNetwork(
    cacheKeys.contract.type(contractAddress),
    () => fetchContractType(contractAddress, sdk),
    // is immutable, so infinite stale time
    { staleTime: Infinity, enabled: !!contractAddress && !!sdk },
  );
}

export const contractType = {
  cacheKey: (
    contractAddress: RequiredParam<ContractAddress>,
    chainId: RequiredParam<SUPPORTED_CHAIN_ID>,
  ) =>
    createCacheKeyWithNetwork(
      cacheKeys.contract.type(contractAddress),
      chainId,
    ),
  useQuery: useContractType,
  fetchQuery: fetchContractType,
};

// end contract type

// contract compiler metadata

function fetchCompilerMetadata(
  contractAddress: RequiredParam<ContractAddress>,
  sdk: RequiredParam<ThirdwebSDK>,
) {
  if (!contractAddress || !sdk) {
    return null;
  }
  try {
    return sdk.getPublisher().fetchCompilerMetadataFromAddress(contractAddress);
  } catch (err) {
    // if we fail to get contract metadata just return null;
    return null;
  }
}

function useCompilerMetadata(contractAddress: RequiredParam<ContractAddress>) {
  const sdk = useSDK();

  return useQueryWithNetwork(
    cacheKeys.contract.compilerMetadata(contractAddress),
    () => fetchCompilerMetadata(contractAddress, sdk),
    // is immutable, so infinite stale time
    { staleTime: Infinity, enabled: !!contractAddress && !!sdk },
  );
}

export const compilerMetadata = {
  cacheKey: (
    contractAddress: RequiredParam<ContractAddress>,
    chainId: RequiredParam<SUPPORTED_CHAIN_ID>,
  ) =>
    createCacheKeyWithNetwork(
      cacheKeys.contract.compilerMetadata(contractAddress),
      chainId,
    ),
  useQuery: useCompilerMetadata,
  fetchQuery: fetchCompilerMetadata,
};

// end compiler metadata

// useContract

export type Contract = ValidContractInstance;

function createReadHook<TContract extends Contract>(
  contract: RequiredParam<TContract>,
) {
  return function <TData>(
    action: (contract: TContract) => Promise<TData> | TData,
  ) {
    const contractAddress = contract?.getAddress();
    const actionKey = action.toString();

    return useQueryWithNetwork(
      cacheKeys.contract.read(contractAddress, actionKey),
      async () => {
        // cann happen if contract is not yet ready
        invariant(contract, "Contract is not ready");
        return (await action(contract as TContract)) as Awaited<TData>;
      },
      {
        enabled: !!contractAddress && !!actionKey,
      },
    );
  };
}

type ActionFn = (...args: any[]) => any;

function createWriteHook<TContract extends Contract>(
  contract: RequiredParam<TContract>,
  queryClient: QueryClient,
  activeChainId: RequiredParam<SUPPORTED_CHAIN_ID>,
) {
  return function <TAction extends ActionFn>(
    action:
      | ((contract: TContract) => Promise<TAction>)
      | ((contract: TContract) => TAction),
  ) {
    return useMutation<
      Awaited<ReturnType<TAction>>,
      unknown,
      Parameters<TAction> | void
    >(
      async (variables: Parameters<TAction> | void) => {
        return await (
          await action(contract as TContract)
        ).call(contract, ...variables);
      },
      {
        onSettled: () =>
          invalidateContractAndBalances(
            queryClient,
            contract?.getAddress(),
            activeChainId,
          ),
      },
    );
  };
}

export type UseContractResult<TContract extends Contract = SmartContractImpl> =
  UseQueryResult<TContract | undefined> & {
    contract: TContract | undefined;
    useRead: <TData>(
      action: (contract: TContract) => TData | Promise<TData>,
    ) => UseQueryResult<TData | undefined, unknown>;
    useWrite: <TAction extends (...args: any[]) => any>(
      action:
        | ((contract: TContract) => Promise<TAction>)
        | ((contract: TContract) => TAction),
    ) => UseMutationResult<Awaited<ReturnType<TAction>>>;
  };

export function useContract<TContract extends Contract = SmartContractImpl>(
  contractAddress: RequiredParam<ContractAddress>,
) {
  const sdk = useSDK();
  const queryClient = useQueryClient();
  const activeChainId = useActiveChainId();

  const contractQuery = useQueryWithNetwork(
    ["contract-instance", contractAddress],
    async () => {
      invariant(contractAddress, "contract address is required");
      invariant(sdk, "SDK not initialized");
      invariant(activeChainId, "active chain id is required");
      // first fetch the contract type (we fetch this explicitly via the queryClient so **it** gets cached!)
      const cType = await queryClient.fetchQuery(
        contractType.cacheKey(contractAddress, activeChainId),
        () => contractType.fetchQuery(contractAddress, sdk),
      );
      // if we can't get the contract type, we need to exit
      invariant(cType, "could not get contract type");
      // if the contract type is NOT "custom", we can use the built-in contract method from the SDK
      if (cType !== "custom") {
        return await sdk.getBuiltInContract(contractAddress, cType);
      }
      // if the contract type is "custom", we need to fetch the compiler metadata

      const compMetadata = await queryClient.fetchQuery(
        compilerMetadata.cacheKey(contractAddress, activeChainId),
        () => compilerMetadata.fetchQuery(contractAddress, sdk),
      );
      // if we can't get the compiler metadata, we need to exit
      invariant(compMetadata, "could not get compiler metadata");
      // if we have the compiler metadata, we can use the custom contract
      return sdk.getContractFromAbi(contractAddress, compMetadata.abi);
    },
    {
      // never actually cache this query, it returns a class!
      cacheTime: 0,
      enabled: !!contractAddress && !!sdk && !!activeChainId,
    },
  );

  // we return an array (similar to useState()) so the use-case ends up being `const [contract, {isLoading, error}] = useContract("0x...")`
  return {
    ...contractQuery,
    contract: contractQuery.data,
    useRead: createReadHook(contractQuery.data),
    useWrite: createWriteHook(contractQuery.data, queryClient, activeChainId),
  } as UseContractResult<TContract>;
}

/**
 * Use this to get the contract metadata for a (built-in or custom) contract.
 *
 * @example
 * ```javascript
 * const { data: contractMetadata, isLoading, error } = useContractMetadata("{{contract_address}}");
 * ```
 *
 * @param contract - the address of the deployed contract
 * @returns a response object that includes the contract metadata of the deployed contract
 * @beta
 */
export function useContractMetadata(contract: UseContractResult) {
  return contract.useRead((c) => c.metadata.get());
}

// const { mutate: setMetadata, data } = useContractWrite(
//   "0x...",
//   (contract) => contract.,
// );

// setMetadata([{ name: "foo" }]);

/**
 * CONTRACT EVENTS
 */

/**
 * Use this to query (and subscribe) to events or a specific event on a contract.
 *
 * @param contract - the {@link Contract} instance of the contract to call a function on
 * @param eventName - the name of the event to query for (omit this or pass `undefined` to query for all events)
 * @param options - options incldues the filters ({@link QueryAllEvents}) for the query as well as if you want to subscribe to real-time updates (default: true)
 * @returns a response object that includes the contract events
 * @beta
 */
export function useContractEvents(
  contract: RequiredParam<Contract>,
  eventName?: string,
  options: { queryFilter?: EventQueryFilter; subscribe?: boolean } = {
    subscribe: true,
  },
) {
  const contractAddress = contract?.getAddress();

  const queryClient = useQueryClient();
  const activeChainId = useActiveChainId();

  const cacheKey = useMemo(
    () =>
      createCacheKeyWithNetwork(
        eventName
          ? cacheKeys.contract.events.getAllEvents(contractAddress)
          : cacheKeys.contract.events.getEvents(
              contractAddress,
              eventName as string,
            ),
        activeChainId,
      ),
    [activeChainId, contractAddress, eventName],
  );
  useEffect(() => {
    // if we're not subscribing or query is not enabled yet we can early exit
    if (!options.subscribe || !contract || !contract) {
      return;
    }

    const cleanupListener = contract.events.listenToAllEvents(
      (contractEvent) => {
        // if we have a specific event name we are looking for we can early exist if it doesn't match
        if (eventName && eventName !== contractEvent.eventName) {
          return;
        }
        // insert new event to the front of the array (no duplicates, though)
        queryClient.setQueryData(
          cacheKey,
          (oldData: ContractEvent[] | undefined) => {
            if (!oldData) {
              return [contractEvent];
            }
            const eventIsNotAlreadyInEventsList =
              oldData.findIndex(
                (e) =>
                  e.transaction.transactionHash ===
                    contractEvent.transaction.transactionHash &&
                  e.transaction.logIndex === contractEvent.transaction.logIndex,
              ) === -1;
            if (eventIsNotAlreadyInEventsList) {
              return [contractEvent, ...oldData];
            }
            return oldData;
          },
        );
      },
    );
    // cleanup listener on unmount
    return cleanupListener;
  }, [options.subscribe, cacheKey, contract, queryClient, eventName]);

  return useQuery(
    cacheKey,
    () => {
      invariant(contract, "contract must be defined");
      if (eventName) {
        return contract.events.getEvents(eventName, options.queryFilter);
      }
      return contract.events.getAllEvents(options.queryFilter);
    },
    {
      enabled: !!contract,
      // we do not need to re-fetch if we're subscribing
      refetchOnWindowFocus: !options.subscribe,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  );
}
