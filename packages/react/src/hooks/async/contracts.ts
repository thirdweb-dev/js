import { useActiveChainId, useSDK } from "../../Provider";
import { ContractAddress, RequiredParam } from "../../types";
import {
  cacheKeys,
  createCacheKeyWithNetwork,
  createContractCacheKey,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import { useAddress } from "../useAddress";
import { useChainId } from "../useChainId";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  CommonContractSchemaInput,
  ContractEvent,
  EventQueryFilter,
  SUPPORTED_CHAIN_ID,
  ThirdwebSDK,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";
import type { SmartContract } from "@thirdweb-dev/sdk/dist/declarations/src/contracts/smart-contract";
import { CallOverrides } from "ethers";
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
    console.error("failed to resolve contract type", err);
    // this error can happen if the contract is a custom contract -> assume "custom"
    return "custom" as const;
  }
}

export function useContractType(
  contractAddress: RequiredParam<ContractAddress>,
) {
  const sdk = useSDK();

  return useQueryWithNetwork(
    cacheKeys.contract.type(contractAddress),
    () => fetchContractType(contractAddress, sdk),
    // is immutable, so infinite stale time
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      enabled: !!contractAddress && !!sdk,
    },
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

export function useCompilerMetadata(
  contractAddress: RequiredParam<ContractAddress>,
) {
  const sdk = useSDK();

  return useQueryWithNetwork(
    cacheKeys.contract.compilerMetadata(contractAddress),
    () => fetchCompilerMetadata(contractAddress, sdk),
    // is immutable, so infinite stale time
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      enabled: !!contractAddress && !!sdk,
    },
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

export type UseContractResult<
  TContract extends ValidContractInstance = SmartContract,
> = UseQueryResult<TContract | undefined> & {
  contract: TContract | undefined;
};

export function useContract<
  TContract extends ValidContractInstance = SmartContract,
>(contractAddress: RequiredParam<ContractAddress>) {
  const sdk = useSDK();
  const queryClient = useQueryClient();
  const activeChainId = useActiveChainId();
  const wallet = useAddress();
  const walletChainId = useChainId();

  // it's there because we put it there.
  const sdkTimestamp = (sdk as any)?._constructedAt;

  const contractQuery = useQueryWithNetwork(
    // need to add the wallet and walletChainId into the query key so this gets refreshed when the wallet / chain changes!
    [
      "contract-instance",
      contractAddress,
      { wallet, walletChainId, sdkTimestamp },
    ],
    async () => {
      invariant(contractAddress, "contract address is required");
      invariant(sdk, "SDK not initialized");
      invariant(activeChainId, "active chain id is required");
      // first fetch the contract type (we fetch this explicitly via the queryClient so **it** gets cached!)
      const cType = await queryClient.fetchQuery(
        contractType.cacheKey(contractAddress, activeChainId),
        () => contractType.fetchQuery(contractAddress, sdk),
        { cacheTime: Infinity, staleTime: Infinity },
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
        { cacheTime: Infinity, staleTime: Infinity },
      );
      // if we can't get the compiler metadata, we need to exit
      invariant(compMetadata, "could not get compiler metadata");
      // if we have the compiler metadata, we can use the custom contract
      return sdk.getContractFromAbi(contractAddress, compMetadata.abi);
    },
    {
      // keep the previous value around while we fetch the new one
      // this is important because otherwise it can lead to flickering (because we need to re-fetch the contract when sdk things change)
      keepPreviousData: true,
      // is immutable, so infinite cache & stale time (for a given key)
      cacheTime: Infinity,
      staleTime: Infinity,
      enabled: !!contractAddress && !!sdk && !!activeChainId,
    },
  );

  // const previousCountract = usePrevious(contractQuery.data);

  return {
    ...contractQuery,
    data: contractQuery.data,
    contract: contractQuery.data,
  } as UseContractResult<TContract>;
}

/**
 * Use this to get the contract metadata for a (built-in or custom) contract.
 *
 * @example
 * ```javascript
 * const { data: contractMetadata, isLoading, error } = useContractMetadata(>);
 * ```
 *
 * @param contract - the {@link ValidContractInstance} instance of the contract to get the metadata for
 * @returns a response object that includes the contract metadata of the deployed contract
 * @beta
 */
export function useContractMetadata(
  contract: RequiredParam<ValidContractInstance>,
) {
  return useQueryWithNetwork(
    cacheKeys.contract.metadata(contract?.getAddress()),
    async () => {
      invariant(contract, "contract is required");
      return await contract.metadata.get();
    },
    {
      enabled: !!contract,
    },
  );
}

/**
 * @internal
 */
export function useContractMetadataUpdate(
  contract: RequiredParam<ValidContractInstance>,
) {
  const activeChainId = useActiveChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (metadata: CommonContractSchemaInput) => {
      invariant(contract, "contract must be defined");

      return contract.metadata.update(metadata);
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(
          createCacheKeyWithNetwork(
            createContractCacheKey(contractAddress),
            activeChainId,
          ),
        ),
    },
  );
}

/**
 * CONTRACT EVENTS
 */

/**
 * Use this to query (and subscribe) to events or a specific event on a contract.
 *
 * @param contract - the {@link ValidContractInstance} instance of the contract to listen to events for
 * @param eventName - the name of the event to query for (omit this or pass `undefined` to query for all events)
 * @param options - options incldues the filters ({@link QueryAllEvents}) for the query as well as if you want to subscribe to real-time updates (default: true)
 * @returns a response object that includes the contract events
 * @beta
 */
export function useContractEvents(
  contract: RequiredParam<ValidContractInstance>,
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

/**
 * Use this to get data from a contract read-function call.
 *
 * @example
 * ```javascript
 * const { contract } = useContract("{{contract_address}}");
 * const { data, isLoading, error } = useContractRead(contract, "functionName", ...args);
 *```
 *
 * @param contract - the contract instance of the contract to call a function on
 * @param functionName - the name of the function to call
 * @param args - The arguments to pass to the function (if any), with optional call arguments as the last parameter
 * @returns a response object that includes the data returned by the function call
 *
 * @beta
 */
export function useContractRead(
  contract: RequiredParam<ValidContractInstance>,
  functionName: RequiredParam<string>,
  ...args: unknown[] | [...unknown[], CallOverrides]
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.call(contractAddress, functionName, args),
    () => {
      invariant(contract, "contract must be defined");
      invariant(functionName, "function name must be provided");
      return contract.call(functionName, ...args);
    },
    {
      enabled: !!contract && !!functionName,
    },
  );
}

/**
 * Use this to get a function to make a write call to your contract
 *
 * @example
 * ```javascript
 * const { contract } = useContract("{{contract_address}}");
 * const { mutate: myFunction, isLoading, error } = useContractWrite(contract, "myFunction");
 *
 * // the function can be called as follows:
 * // myFunction(["param 1", "param 2", ...])
 *```
 *
 * @param contract - the contract instance of the contract to call a function on
 * @param functionName - the name of the function to call
 * @returns a response object that includes the write function to call
 *
 * @beta
 */
export function useContractWrite(
  contract: RequiredParam<ValidContractInstance>,
  functionName: RequiredParam<string>,
) {
  const activeChainId = useActiveChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (callParams?: unknown[] | [...unknown[], CallOverrides]) => {
      invariant(contract, "contract must be defined");
      invariant(functionName, "function name must be provided");
      if (!callParams?.length) {
        return contract.call(functionName);
      }
      return contract.call(functionName, ...callParams);
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(
          createCacheKeyWithNetwork(
            createContractCacheKey(contractAddress),
            activeChainId,
          ),
        ),
    },
  );
}
