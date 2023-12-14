import { neverPersist } from "../../../core/query-utils/query-key";
import {
  RequiredParam,
  requiredParamInvariant,
} from "../../../core/query-utils/required-param";
import { useSDK, useSDKChainId } from "../useSDK";
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
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { getCachedAbiForContract, TransactionResult } from "@thirdweb-dev/sdk";
import type {
  CommonContractSchemaInput,
  ContractEvent,
  ContractForPrebuiltContractType,
  ContractType,
  EventQueryOptions,
  PrebuiltContractType,
  SmartContract,
  SUPPORTED_CHAIN_ID,
  ThirdwebSDK,
  ValidContractInstance,
  BaseContractForAddress,
  PublishedMetadata,
} from "@thirdweb-dev/sdk";
import type { CallOverrides, ContractInterface, providers } from "ethers";
import { useEffect, useMemo } from "react";
import invariant from "tiny-invariant";
import { ContractAddress as GeneratedContractAddress } from "@thirdweb-dev/generated-abis";

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

/**
 * Hook for determining the type of contract for a contract address.
 *
 * This is useful if you want to determine if a contract is a [prebuilt contract](https://portal.thirdweb.com/pre-built-contracts).
 *
 * @example
 *
 * ```jsx
 * import { useContractType } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { data, isLoading, error } = useContractType(contractAddress);
 * }
 * ```
 *
 * @metadata
 */
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

/**
 * @internal
 */
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
): Promise<PublishedMetadata> | null {
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

/**
 * Hook for retrieving information such as the ABI, license, and metadata of a smart contract using it's contract address.
 *
 * @example
 *
 * ```jsx
 * import { useCompilerMetadata } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { data, isLoading, error } = useCompilerMetadata(contractAddress);
 * }
 *
 * export default App;
 * ```
 *
 * @metadata
 */
export function useCompilerMetadata(
  contractAddress: RequiredParam<ContractAddress>,
): UseQueryResult<PublishedMetadata | null> {
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

/**
 * @internal
 */
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
 * Hook for connecting to a smart contract.
 *
 * Provide your smart contract address as the first parameter. Once connected, the `contract` will be an instance of your smart contract.
 *
 * @example
 * ```javascript
 * const { contract, isLoading, error } = useContract("{{contract_address}}");
 * ```
 *
 * @remarks
 *
 * To cache the ABI of the smart contract, use [thirdweb generate](https://portal.thirdweb.com/cli/generate). This is recommended to improve performance and provide type-safety when interacting with your smart contract.
 *
 *
 * @param contractAddress - the address of the deployed contract
 * @returns a response object that includes the contract once it is resolved
 * @contract
 */
export function useContract(
  contractAddress: RequiredParam<ContractAddress>,
): UseContractResult<SmartContract>;

/**
 * If your contract is a prebuilt contract, it is strongly recommended you provide the contract's name as the second argument to gain access to improved top-level functions and type inference.
 *
 * Available contract types are:
 * - `"nft-drop"`
 * - `"signature-drop"`
 * - `"edition-drop"`
 * - `"nft-collection"`
 * - `"edition"`
 * - `"multiwrap"`
 * - `"pack"`
 * - `"token-drop"`
 * - `"token"`
 * - `"marketplace"`
 * - `"marketplace-v3"`
 * - `"split"`
 * - `"vote"`
 *
 * When a contract type is provided, the contract object will be typed as the contract's class.
 * For example, if you provide the contract type `"pack"`, the contract object will be returned typed as an instance of the `Pack` class, unlocking all of the top-level functions specific to the pack.
 *
 * @example
 * ```javascript
 * const { contract, isLoading, error } = useContract("{{contract_address}}", "pack");
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
 * Optionally, (if you don’t want to use the dashboard import feature),
 * you can provide your smart contract’s ABI to the second parameter of the useContract hook.
 * This is useful when developing on a local node, where it may be faster to use the ABI than to import the contract using the dashboard.
 *
 * The ABI is only necessary if you have not deployed your contract with, or imported your contract to the thirdweb dashboard.
 *
 * @example
 * ```javascript
 * const { contract, isLoading, error } = useContract("{{contract_address}}", contractAbi);
 * ```
 *
 * @param contractAddress - the address of the deployed contract
 * @param _abi - the ABI of the contract to use
 * @returns a response object that includes the contract once it is resolved
 */

export function useContract(
  contractAddress: RequiredParam<ContractAddress>,
  _abi: ContractInterface,
): UseContractResult<SmartContract>;

// TODO: add JSDoc for this signature
export function useContract<
  TContractAddress extends ContractAddress | GeneratedContractAddress,
>(
  contractAddress: RequiredParam<TContractAddress>,
): UseContractResult<
  TContractAddress extends GeneratedContractAddress
    ? SmartContract<BaseContractForAddress<TContractAddress>>
    : SmartContract
>;

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
        // First check local ABI cache
        const cachedAbi = getCachedAbiForContract(contractAddress);
        if (cachedAbi) {
          return sdk.getContract(contractAddress, cachedAbi);
        }

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
 * Get the metadata of this contract
 *
 * @example
 * ```javascript
 * const { data: contractMetadata, isLoading } = useContractMetadata(contract);
 * ```
 *
 * @param contract - the {@link ValidContractInstance} instance of the contract to get the metadata for
 * @returns a response object that includes the contract metadata of the deployed contract
 * @twfeature ContractMetadata
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
      return (await contract.metadata.get()) as any; // FIXME types
    },
    {
      enabled: !!contract,
    },
  );
}

/**
 * Update the metadata of this contract
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: updateContractMetadata,
 *     isLoading,
 *     error,
 *   } = useContractMetadataUpdate(contract);
 *
 *   if (error) {
 *     console.error("failed to update contract metadata", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => updateContractMetadata({ name: "New name", description: "New description" })}
 *     >
 *       Update contract metadata
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - the {@link ValidContractInstance} instance of the contract to get the metadata for
 * @returns a response object that includes the contract metadata of the deployed contract
 * @twfeature ContractMetadata
 */
export function useContractMetadataUpdate(
  contract: RequiredParam<ValidContractInstance>,
): UseMutationResult<
  {
    receipt: providers.TransactionReceipt;
    data: () => Promise<any>;
  },
  unknown,
  {
    name: string;
    description?: string | undefined;
    image?: any;
    external_link?: string | undefined;
    app_uri?: string | undefined;
  },
  unknown
> {
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
 * Hook for reading events emitted by a smart contract, including new events as they are emitted (optional).
 *
 * By default, it reads all events emitted by the smart contract.
 *
 * ```javascript
 * const { data, isLoading, error } = useContractEvents(contract);
 * ```
 *
 * @example
 * ```tsx
 * import { useContractEvents, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useContractEvents(contract);
 * }
 * ```
 *
 * @param contract - the contract instance of the contract to listen to events for
 *
 * @param eventName -
 * The name of the event to query for. For example, if your smart contract emits an event called MyEvent, you would pass "MyEvent" to this parameter.
 *
 * Omit this parameter or provide undefined to query for all events emitted by the smart contract.
 *
 * @param options -
 * An object containing options to filter the events being queried.
 *
 * Available options include queryFilter to refine which events you want to read, and a boolean `subscribe` flag to subscribe to new events as they are emitted.
 *
 * ### Example
 * ```tsx
 * import {
 *   useContractEvents,
 *   useContract,
 *   Web3Button,
 * } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useContractEvents(
 *     contract,
 *     "MyEvent",
 *     {
 *       queryFilter: {
 *         filters: {
 *           tokenId: 123, // e.g. Only events where tokenId = 123
 *         },
 *         fromBlock: 0, // Events starting from this block
 *         toBlock: 100, // Events up to this block
 *         order: "asc", // Order of events ("asc" or "desc")
 *       },
 *       subscribe: true, // Subscribe to new events
 *     },
 *   );
 * ```
 *
 * @returns a response object that includes the contract events. The hook's data property, once loaded, contains an array of event objects
 * @contract
 *
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
          ? cacheKeys.contract.events.getEvents(
              contractAddress,
              eventName as string,
            )
          : cacheKeys.contract.events.getAllEvents(contractAddress),
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
 * Generic hook for reading any data from a smart contract via it’s function/view/variable name.
 *
 * ```javascript
 * const { contract } = useContract("{{contract_address}}");
 * const { data, isLoading, error } = useContractRead(contract, "functionName", args);
 * ```
 *
 * @example
 * Provide your smart contract instance from `useContract`, a function name and the arguments to pass to the function (if any).
 *
 * For example, to read the value of a view on your smart contract called getName you would do the following:
 *
 * ```tsx
 * import { useContractRead, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useContractRead(contract, "getName");
 * }
 * ```
 *
 * @remarks
 * If you have cached the ABI of your smart contract using [thirdweb generate](https://portal.thirdweb.com/cli/generate), the functionName and args parameters are strongly typed according to your smart contract’s ABI.
 *
 * @param contract - the contract instance of the contract to call a function on
 *
 * @param functionName - the name of the function to call in the smart contract. This can be any function, view, variable, etc. that does not require a transaction to occur.
 *
 * @param args - The arguments to pass to the function (if any)
 *
 * @param overrides - `CallOverrides` object to send with your request.
 * To include the sender's address (msg.sender) when calling view functions within your smart contract, include the property `{from: 0X123}` passing the relevant address.
 *
 * ```ts
 * const { data, isLoading, error } = useContractRead(contract, "getName", ["arg1", "arg2"], {
 *     blockTag: 123,
 *     from: "0x123",
 *   });
 * ```
 *
 * @returns a response object that includes the data returned by the function call
 * @contract
 */
export function useContractRead<
  TContractAddress extends GeneratedContractAddress | ContractAddress,
  TContract extends TContractAddress extends GeneratedContractAddress
    ? BaseContractForAddress<TContractAddress>
    : ValidContractInstance,
  TContractInstance extends TContractAddress extends GeneratedContractAddress
    ? SmartContract<BaseContractForAddress<TContractAddress>>
    : ValidContractInstance,
  TFunctionName extends TContractAddress extends GeneratedContractAddress
    ? TContract extends BaseContractForAddress<TContractAddress>
      ? keyof TContract["functions"]
      : never
    : Parameters<TContractInstance["call"]>[0],
  TArgs extends TContractAddress extends GeneratedContractAddress
    ? TContract extends BaseContractForAddress<TContractAddress>
      ? TFunctionName extends keyof TContract["functions"]
        ? Parameters<TContract["functions"][TFunctionName]>
        : unknown[]
      : unknown[]
    : unknown[],
  TReturnType extends TContractAddress extends GeneratedContractAddress
    ? TContract extends BaseContractForAddress<TContractAddress>
      ? TFunctionName extends keyof TContract["functions"]
        ? ReturnType<TContract["functions"][TFunctionName]>
        : any
      : any
    : any,
>(
  contract: TContractInstance extends ValidContractInstance
    ? RequiredParam<TContractInstance> | undefined
    : TContractAddress extends GeneratedContractAddress
    ?
        | RequiredParam<SmartContract<BaseContractForAddress<TContractAddress>>>
        | undefined
    : RequiredParam<SmartContract> | undefined,
  functionName: RequiredParam<TFunctionName & string>,
  args?: TArgs,
  overrides?: CallOverrides,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.call(contractAddress, functionName, args, overrides),
    () => {
      requiredParamInvariant(contract, "contract must be defined");
      requiredParamInvariant(functionName, "function name must be provided");
      return (
        contract.call as (
          functionName: TFunctionName,
          args?: TArgs,
          overrides?: CallOverrides,
        ) => Promise<TReturnType>
      )(functionName, args, overrides);
    },
    {
      enabled: !!contract && !!functionName,
    },
  );
}

/**
 * Generic hook for calling any smart contract function that requires a transaction to take place.
 *

 * ```tsx
 * import { useContractWrite } from "@thirdweb-dev/react";
 *
 * const { mutate, mutateAsync, isLoading, error } = useContractWrite(contract, "setName");
 * ```
 *
 * Provide your smart contract instance returned from the `useContract` hook, along with the name of the function you wish to call on your smart contract as arguments to the hook.
 *
 * Then call the `mutate` or `mutateAsync` function returned by the hook, providing an array of arguments to send to your smart contract function.
 *
 * If you provide too many or too few arguments, the `error` property will be populated with an error message.
 *
 * If your function has no arguments, provide an empty array by calling the function with `{ args: [] }`
 *
 * @example
 * ```javascript
 * import { useContractWrite, useContract, Web3Button } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { mutateAsync, isLoading, error } = useContractWrite(
 *     contract,
 *     "setName",
 *   );
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       // Calls the "setName" function on your smart contract with "My Name" as the first argument
 *       action={() => mutateAsync({ args: ["My Name"] })}
 *     >
 *       Send Transaction
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @remarks
 *
 * If you have cached the ABI of your smart contract using [thirdweb generate](https://portal.thirdweb.com/cli/generate), the functionName and args parameters are strongly typed according to your smart contract’s ABI.
 *
 *
 * @param contract - the contract instance of the contract to call a function on
 * @param functionName - the name of the function to call in the smart contract.
 * @returns a response object that includes the write function to call
 * @contract
 */
export function useContractWrite<
  TContractAddress extends GeneratedContractAddress | ContractAddress,
  TContract extends TContractAddress extends GeneratedContractAddress
    ? BaseContractForAddress<TContractAddress>
    : ValidContractInstance,
  TContractInstance extends TContractAddress extends GeneratedContractAddress
    ? SmartContract<BaseContractForAddress<TContractAddress>>
    : ValidContractInstance,
  TFunctionName extends TContractAddress extends GeneratedContractAddress
    ? TContract extends BaseContractForAddress<TContractAddress>
      ? keyof TContract["functions"]
      : never
    : Parameters<TContractInstance["call"]>[0],
  TArgs extends TContractAddress extends GeneratedContractAddress
    ? TContract extends BaseContractForAddress<TContractAddress>
      ? TFunctionName extends keyof TContract["functions"]
        ? Parameters<TContract["functions"][TFunctionName]>
        : unknown[]
      : unknown[]
    : any[],
>(
  contract: TContractInstance extends ValidContractInstance
    ? RequiredParam<TContractInstance> | undefined
    : TContractAddress extends GeneratedContractAddress
    ?
        | RequiredParam<SmartContract<BaseContractForAddress<TContractAddress>>>
        | undefined
    : RequiredParam<SmartContract> | undefined,
  functionName: RequiredParam<TFunctionName & string>,
) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      args,
      overrides,
    }: {
      args?: TArgs;
      overrides?: CallOverrides;
    }) => {
      requiredParamInvariant(contract, "contract must be defined");
      requiredParamInvariant(functionName, "function name must be provided");

      return (
        contract.call as (
          functionName: TFunctionName,
          args?: TArgs,
          overrides?: CallOverrides,
        ) => Promise<TransactionResult>
      )(functionName, args, overrides);
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
