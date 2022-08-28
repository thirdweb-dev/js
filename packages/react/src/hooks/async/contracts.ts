import { useActiveChainId, useSDK } from "../../Provider";
import { ContractAddress, RequiredParam } from "../../types";
import {
  cacheKeys,
  createCacheKeyWithNetwork,
  createContractCacheKey,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ContractEvent,
  CONTRACTS_MAP,
  CustomContractMetadata,
  EventQueryFilter,
  PublishedMetadata,
  ThirdwebSDK,
} from "@thirdweb-dev/sdk";
import { CallOverrides } from "ethers";
import { useEffect, useMemo } from "react";
import invariant from "tiny-invariant";

async function fetchContractType(
  contractAddress: RequiredParam<string>,
  sdk: RequiredParam<ThirdwebSDK>,
) {
  if (!contractAddress || !sdk) {
    return;
  }
  try {
    return await sdk.resolveContractType(contractAddress);
  } catch (err) {
    // expected error, return custom type instead
    return "custom" as const;
  }
}

async function fetchContractCompilerMetadata(
  contractAddress: RequiredParam<string>,
  sdk: RequiredParam<ThirdwebSDK>,
) {
  if (!contractAddress || !sdk) {
    return;
  }

  return await (
    await sdk.getPublisher()
  ).fetchCompilerMetadataFromAddress(contractAddress);
}
async function fetchContractTypeAndCompilerMetadata(
  queryClient: QueryClient,
  contractAddress?: string,
  sdk?: ThirdwebSDK,
) {
  if (!contractAddress || !sdk) {
    return;
  }
  const contractType = await queryClient.fetchQuery(
    createCacheKeyWithNetwork(
      cacheKeys.contract.type(contractAddress),
      (sdk as any)._chainId,
    ),
    () => fetchContractType(contractAddress, sdk),
    // is immutable, so infinite stale time
    { staleTime: Infinity },
  );
  if (contractType !== "custom") {
    return {
      contractType,
      compilerMetadata: null,
    };
  }
  const compilerMetadata = await queryClient.fetchQuery(
    createCacheKeyWithNetwork(
      cacheKeys.contract.compilerMetadata(contractAddress),
      (sdk as any)._chainId,
    ),
    () => fetchContractCompilerMetadata(contractAddress, sdk),
    // is immutable, so infinite stale time
    { staleTime: Infinity },
  );
  return {
    contractType,
    compilerMetadata,
  };
}

function getContractAbi(
  input: RequiredParam<
    Awaited<ReturnType<typeof fetchContractTypeAndCompilerMetadata>>
  >,
) {
  if (!input || !input.contractType) {
    return null;
  }
  let contractAbi: PublishedMetadata["abi"] | null = null;
  if (input.contractType !== "custom") {
    contractAbi = CONTRACTS_MAP[input.contractType].contractAbi;
  }
  if (input.contractType === "custom" && input.compilerMetadata) {
    contractAbi = input.compilerMetadata?.abi;
  }

  return contractAbi;
}

function getContractFromCombinedTypeAndCompilerMetadata(
  contractAddress: RequiredParam<ContractAddress>,
  input: RequiredParam<
    Awaited<ReturnType<typeof fetchContractTypeAndCompilerMetadata>>
  >,
  sdk: RequiredParam<ThirdwebSDK>,
) {
  if (!input || !sdk || !contractAddress || !input.contractType) {
    return null;
  }

  const contractAbi = getContractAbi(input);

  invariant(
    contractAbi,
    `could not resolve any ABI for contract${contractAddress}`,
  );
  return sdk.getContractFromAbi(contractAddress, contractAbi);
}

/**
 *
 * @internal
 *
 * @param contractAddress - contract address
 * @returns the contract abi
 */
export function useContractAbi(
  contractAddress: RequiredParam<ContractAddress>,
) {
  const sdk = useSDK();

  const contractTypeAndCompilerMetadata =
    useContractTypeAndCompilerMetadata(contractAddress);

  if (
    !contractAddress ||
    !sdk ||
    !contractTypeAndCompilerMetadata.data?.contractType
  ) {
    return {
      ...contractTypeAndCompilerMetadata,
      abi: null,
    };
  }

  const abi = getContractAbi(contractTypeAndCompilerMetadata.data);
  return { ...contractTypeAndCompilerMetadata, abi };
}

/**
 * Use this to get the contract type for a (built-in or custom) contract.
 *
 * @example
 * ```javascript
 * const { data: contractType, isLoading, error } = useContractType("{{contract_address}}");
 * ```
 *
 * @param contractAddress - the address of the deployed contract
 * @returns a response object that includes the contract type of the contract
 * @beta
 */
export function useContractType(
  contractAddress: RequiredParam<ContractAddress>,
) {
  const sdk = useSDK();
  return useQueryWithNetwork(
    cacheKeys.contract.type(contractAddress),
    () => fetchContractType(contractAddress, sdk),
    {
      enabled: !!sdk && !!contractAddress,
      // never stale, a contract's publish metadata is immutable
      staleTime: Infinity,
    },
  );
}

/**
 * Use this to get the publish metadata for a deployed contract.
 *
 * @example
 * ```javascript
 * const { data: compilerMetadata, isLoading, error } = useContractCompilerMetadata("{{contract_address}}");
 * ```
 *
 * @param contractAddress - the address of the deployed contract
 * @returns a response object that includes the published metadata (name, abi, bytecode) of the contract
 * @beta
 */
export function useContractCompilerMetadata(
  contractAddress: RequiredParam<ContractAddress>,
) {
  const sdk = useSDK();
  return useQueryWithNetwork(
    cacheKeys.contract.compilerMetadata(contractAddress),
    () => fetchContractCompilerMetadata(contractAddress, sdk),
    {
      enabled: !!sdk && !!contractAddress,
      // never stale, a contract's publish metadata is immutable
      staleTime: Infinity,
    },
  );
}

/**
 * @internal
 */
function useContractTypeAndCompilerMetadata(
  contractAddress: RequiredParam<ContractAddress>,
) {
  const sdk = useSDK();
  const queryClient = useQueryClient();
  return useQueryWithNetwork(
    cacheKeys.contract.typeAndCompilerMetadata(contractAddress),
    () =>
      fetchContractTypeAndCompilerMetadata(queryClient, contractAddress, sdk),
    {
      enabled: !!sdk && !!contractAddress,
      // combination of type and publish metadata is immutable
      staleTime: Infinity,
    },
  );
}

/**
 * Use this resolve a contract address to a smart contract instance.
 *
 * @example
 * ```javascript
 * const { contract, isLoading, error } = useContract("{{contract_address}}");
 * ```
 *
 * @param contractAddress - the address of the deployed contract
 * @returns a response object that includes the contract once it is resolved
 * @public
 */
export function useContract(contractAddress: RequiredParam<ContractAddress>) {
  const sdk = useSDK();

  const contractTypeAndCompilerMetadata =
    useContractTypeAndCompilerMetadata(contractAddress);

  if (
    !contractAddress ||
    !sdk ||
    !contractTypeAndCompilerMetadata.data?.contractType
  ) {
    return {
      ...contractTypeAndCompilerMetadata,
      contract: null,
    };
  }

  const contract = getContractFromCombinedTypeAndCompilerMetadata(
    contractAddress,
    contractTypeAndCompilerMetadata.data,
    sdk,
  );
  return { ...contractTypeAndCompilerMetadata, contract };
}

/**
 * Use this to get the contract metadata for a (built-in or custom) contract.
 *
 * @example
 * ```javascript
 * const { data: contractMetadata, isLoading, error } = useContractMetadata("{{contract_address}}");
 * ```
 *
 * @param contractAddress - the address of the deployed contract
 * @returns a response object that includes the contract metadata of the deployed contract
 * @beta
 */
export function useContractMetadata(
  contractAddress: RequiredParam<ContractAddress>,
) {
  const sdk = useSDK();
  const queryClient = useQueryClient();
  const activeChainId = useActiveChainId();
  return useQueryWithNetwork(
    cacheKeys.contract.metadata(contractAddress),
    async () => {
      const typeAndCompilerMetadata = await queryClient.fetchQuery(
        createCacheKeyWithNetwork(
          cacheKeys.contract.typeAndCompilerMetadata(contractAddress),
          activeChainId,
        ),
        () =>
          fetchContractTypeAndCompilerMetadata(
            queryClient,
            contractAddress,
            sdk,
          ),
        // is immutable, so infinite stale time
        { staleTime: Infinity },
      );
      const contract = getContractFromCombinedTypeAndCompilerMetadata(
        contractAddress,
        typeAndCompilerMetadata,
        sdk,
      );
      invariant(contract?.metadata?.get, "contract metadata is not available");
      return (await contract.metadata.get()) as CustomContractMetadata;
    },
    {
      enabled: !!contractAddress || !!sdk,
    },
  );
}

/**
 @internal
 */
export function useContractFunctions(
  contractAddress: RequiredParam<ContractAddress>,
) {
  const sdk = useSDK();
  const queryClient = useQueryClient();
  const activeChainId = useActiveChainId();
  return useQueryWithNetwork(
    cacheKeys.contract.extractFunctions(contractAddress),
    async () => {
      const typeAndCompilerMetadata = await queryClient.fetchQuery(
        createCacheKeyWithNetwork(
          cacheKeys.contract.typeAndCompilerMetadata(contractAddress),
          activeChainId,
        ),
        () =>
          fetchContractTypeAndCompilerMetadata(
            queryClient,
            contractAddress,
            sdk,
          ),
        // is immutable, so infinite stale time
        { staleTime: Infinity },
      );
      const contract = getContractFromCombinedTypeAndCompilerMetadata(
        contractAddress,
        typeAndCompilerMetadata,
        sdk,
      );
      if (contract?.publishedMetadata.extractFunctions) {
        return contract.publishedMetadata.extractFunctions();
      }
      return null;
    },
    {
      enabled: !!contractAddress || !!sdk,
      // functions are based on publish metadata (abi), so this is immutable
      staleTime: Infinity,
    },
  );
}

/**
 * Use this to get data from a contract read-function call.
 *
 * @example
 * ```javascript
 * const { contract } = useContract("{{contract_address}}");
 * const { data, isLoading, error } = useContractData(contract, "functionName", ...args);
 *```
 *
 * @param contract - the contract instance of the contract to call a function on
 * @param functionName - the name of the function to call
 * @param args - The arguments to pass to the function (if any), with optional call arguments as the last parameter
 * @returns a response object that includes the data returned by the function call
 *
 * @beta
 */
export function useContractData(
  contract: RequiredParam<ReturnType<typeof useContract>["contract"]>,
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
 * const { mutate: myFunction, isLoading, error } = useContractCall(contract, "myFunction");
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
export function useContractCall(
  contract: RequiredParam<ReturnType<typeof useContract>["contract"]>,
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

/**
 * Use this to query (and subscribe) to all events on a contract.
 *
 * @param contract - the contract instance of the contract to call a function on
 * @param options - options incldues the filters ({@link QueryAllEvents}) for the query as well as if you want to subscribe to real-time updates (default: true)
 * @returns a response object that includes the contract events
 * @beta
 */
export function useAllContractEvents(
  contract: RequiredParam<ReturnType<typeof useContract>["contract"]>,
  options: { queryFilter?: EventQueryFilter; subscribe?: boolean } = {
    subscribe: true,
  },
) {
  const contractAddress = contract?.getAddress();
  const queryEnabled = !!contract;
  const queryClient = useQueryClient();
  const activeChainId = useActiveChainId();

  const cacheKey = useMemo(
    () =>
      createCacheKeyWithNetwork(
        cacheKeys.contract.events.getAllEvents(contractAddress),
        activeChainId,
      ),
    [activeChainId, contractAddress],
  );
  useEffect(() => {
    // if we're not subscribing or query is not enabled yet we can early exit
    if (!options.subscribe || !queryEnabled || !contract) {
      return;
    }

    const cleanupListener = contract.events.listenToAllEvents(
      (contractEvent) => {
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
  }, [queryEnabled, options.subscribe, cacheKey, contract, queryClient]);

  return useQuery(
    cacheKey,
    () => {
      invariant(contract, "contract must be defined");
      return contract.events.getAllEvents(options.queryFilter);
    },
    {
      enabled: queryEnabled,
      // we do not need to re-fetch if we're subscribing
      refetchOnWindowFocus: !options.subscribe,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  );
}

/**
 * Use this to query (and subscribe) to a specific event on a contract.
 *
 * @param contract - the contract instance of the contract to call a function on
 * @param options - options incldues the filters ({@link QueryAllEvents}) for the query as well as if you want to subscribe to real-time updates (default: true)
 * @returns a response object that includes the contract events
 * @beta
 */
export function useContractEvents(
  contract: RequiredParam<ReturnType<typeof useContract>["contract"]>,
  eventName: string,
  options: { queryFilter?: EventQueryFilter; subscribe?: boolean } = {
    subscribe: true,
  },
) {
  const contractAddress = contract?.getAddress();
  const queryEnabled = !!contract && !!eventName;
  const queryClient = useQueryClient();
  const activeChainId = useActiveChainId();

  const cacheKey = useMemo(
    () =>
      createCacheKeyWithNetwork(
        cacheKeys.contract.events.getAllEvents(contractAddress),
        activeChainId,
      ),
    [activeChainId, contractAddress],
  );
  useEffect(() => {
    // if we're not subscribing or query is not enabled yet we can early exit
    if (!options.subscribe || !queryEnabled || !contract || !eventName) {
      return;
    }

    const cleanupListener = contract.events.listenToAllEvents(
      (contractEvent) => {
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
  }, [
    queryEnabled,
    options.subscribe,
    cacheKey,
    eventName,
    contract,
    queryClient,
  ]);

  return useQuery(
    cacheKey,
    () => {
      invariant(contract, "contract must be defined");
      return contract.events.getEvents(eventName, options.queryFilter);
    },
    {
      enabled: queryEnabled,
      // we do not need to re-fetch if we're subscribing
      refetchOnWindowFocus: !options.subscribe,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  );
}
