import { neverPersist } from "../../../core/query-utils/query-key";
import {
  RequiredParam,
  requiredParamInvariant,
} from "../../../core/query-utils/required-param";
import { useSDK, useSDKChainId } from "../../providers/base";
import { ContractAddress } from "../../types";
import {
  cacheKeys,
  createCacheKeyWithNetwork,
  createContractCacheKey,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import { useAddress, useChainId } from "../wallet";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  CommonContractSchemaInput,
  ContractEvent,
  ContractForPrebuiltContractType,
  ContractType,
  EventQueryOptions,
  PrebuiltContractType,
  SUPPORTED_CHAIN_ID,
  ThirdwebSDK,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";
import type { SmartContract } from "@thirdweb-dev/sdk/dist/declarations/src/evm/contracts/smart-contract";
import { CallOverrides, ContractInterface } from "ethers";
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
export function useContract(
  contractAddress: RequiredParam<ContractAddress>,
): UseContractResult<SmartContract>;

/**
 * Use this resolve a contract address to a smart contract instance.
 *
 * @example
 * ```javascript
 * const { contract, isLoading, error } = useContract("{{contract_address}}", "nft-drop");
 * ```
 *
 * @param contractAddress - the address of the deployed contract
 * @param _contractType - the type of the contract
 * @returns a response object that includes the contract once it is resolved
 * @public
 */
export function useContract<TContractType extends ContractType>(
  contractAddress: RequiredParam<ContractAddress>,
  _contractType: TContractType,
): UseContractResult<
  TContractType extends PrebuiltContractType
    ? ContractForPrebuiltContractType<TContractType>
    : SmartContract
>;

/**
 * Use this resolve a contract address to a smart contract instance.
 *
 * @example
 * ```javascript
 * const { contract, isLoading, error } = useContract("{{contract_address}}", ABI);
 * ```
 *
 * @param contractAddress - the address of the deployed contract
 * @param _abi - the ABI of the contract to use
 * @returns a response object that includes the contract once it is resolved
 * @public
 */

export function useContract(
  contractAddress: RequiredParam<ContractAddress>,
  _abi: ContractInterface,
): UseContractResult<SmartContract>;

export function useContract(
  contractAddress: RequiredParam<ContractAddress>,
  contractTypeOrABI?: ContractType | ContractInterface,
) {
  const sdk = useSDK();
  const queryClient = useQueryClient();
  const activeChainId = useSDKChainId();
  const wallet = useAddress();
  const walletChainId = useChainId();

  // it's there because we put it there.
  const sdkTimestamp = (sdk as any)?._constructedAt;

  const contractQuery = useQueryWithNetwork(
    // need to add the wallet and walletChainId into the query key so this gets refreshed when the wallet / chain changes!
    neverPersist([
      "contract-instance",
      contractAddress,
      { wallet, walletChainId, sdkTimestamp },
    ]),
    async () => {
      requiredParamInvariant(contractAddress, "contract address is required");
      invariant(sdk, "SDK not initialized");
      invariant(activeChainId, "active chain id is required");

      // if we don't have a contractType or ABI then we will have to resolve it regardless
      // we also handle it being "custom" just in case...
      if (!contractTypeOrABI || contractTypeOrABI === "custom") {
        // we just resolve here (sdk does this internally anyway)
        const resolvedContractType = await queryClient.fetchQuery(
          contractType.cacheKey(contractAddress, activeChainId),
          () => contractType.fetchQuery(contractAddress, sdk),
          { cacheTime: Infinity, staleTime: Infinity },
        );
        let abi: ContractInterface | undefined;
        if (resolvedContractType === "custom") {
          abi = (
            await queryClient.fetchQuery(
              compilerMetadata.cacheKey(contractAddress, activeChainId),
              () => compilerMetadata.fetchQuery(contractAddress, sdk),
              { cacheTime: Infinity, staleTime: Infinity, retry: 0 },
            )
          )?.abi;
        }
        invariant(resolvedContractType, "failed to resolve contract type");
        // just let the sdk handle the rest
        // if we have resolved an ABI for a custom contract, use that otherwise use contract type
        return sdk.getContract(contractAddress, abi || resolvedContractType);
      }
      // every other case can just be handled by the sdk directly
      return sdk.getContract(contractAddress, contractTypeOrABI);
    },
    {
      // keep the previous value around while we fetch the new one
      // this is important because otherwise it can lead to flickering (because we need to re-fetch the contract when sdk things change)
      keepPreviousData: true,
      // is immutable, so infinite cache & stale time (for a given key)
      cacheTime: Infinity,
      staleTime: Infinity,
      enabled: !!contractAddress && !!sdk && !!activeChainId,
      // never retry
      retry: 0,
    },
  );

  // const previousCountract = usePrevious(contractQuery.data);

  return {
    ...contractQuery,
    data: contractQuery.data,
    contract: contractQuery.data,
  } as UseContractResult<ValidContractInstance>;
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
 * @twfeature ContractMetadata
 * @beta
 */
export function useContractMetadata<TContract extends ValidContractInstance>(
  contract: RequiredParam<TContract>,
) {
  return useQueryWithNetwork<
    typeof contract extends undefined
      ? undefined
      : Awaited<ReturnType<TContract["metadata"]["get"]>>
  >(
    cacheKeys.contract.metadata(contract?.getAddress()),
    async () => {
      requiredParamInvariant(contract, "contract is required");
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
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (metadata: CommonContractSchemaInput) => {
      requiredParamInvariant(contract, "contract must be defined");

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
  options: { queryFilter?: EventQueryOptions; subscribe?: boolean } = {
    subscribe: true,
  },
) {
  const contractAddress = contract?.getAddress();

  const queryClient = useQueryClient();
  const activeChainId = useSDKChainId();

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
      requiredParamInvariant(contract, "contract must be defined");
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
      requiredParamInvariant(contract, "contract must be defined");
      requiredParamInvariant(functionName, "function name must be provided");
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
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (callParams?: unknown[] | [...unknown[], CallOverrides]) => {
      requiredParamInvariant(contract, "contract must be defined");
      requiredParamInvariant(functionName, "function name must be provided");
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
