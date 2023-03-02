import {
  RequiredParam,
  requiredParamInvariant,
} from "../../../core/query-utils/required-param";
import { useSDKChainId } from "../../providers/thirdweb-sdk-provider";
import {
  cacheKeys,
  invalidateContractAndBalances,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import invariant from "tiny-invariant";

/**
 * Get App URI
 *
 * @example
 * ```javascript
 * const { data: contractMetadata, isLoading, error } = useAppURI(SmartContract;
 * ```
 *
 * @param contract - the {@link SmartContract} instance of the contract to get the appURI of
 * @returns a response object that includes the appURI of the contract
 * @twfeature AppURI | ContractMetadata
 * @beta
 */
export function useAppURI<TContract extends ValidContractInstance>(
  contract: RequiredParam<TContract>,
) {
  return useQueryWithNetwork<string>(
    cacheKeys.contract.app.get(contract?.getAddress()),
    async () => {
      requiredParamInvariant(contract, "Contract is required");
      invariant(contract.app, "Contract does not support app");
      return await contract.app.get();
    },
    {
      enabled: !!contract,
    },
  );
}

/**
 * Set App URI
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: useSetAppURI,
 *     isLoading,
 *     error,
 *   } = useSetAppURI(SmartContract);
 *
 *   if (error) {
 *     console.error("failed to update appURI", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => useSetAppURI({ uri })}
 *     >
 *       Update App URI
 *     </button>
 *   );
 * };
 * ```
 * @param contract - an instance of a {@link SmartContract}
 * @returns a mutation object that can be used to update the appURI of a contract
 * @twfeature AppURI | ContractMetadata
 * @beta
 */
export function useSetAppURI(contract: RequiredParam<ValidContractInstance>) {
  const queryClient = useQueryClient();
  const contractAddress = contract?.getAddress();
  const activeChainId = useSDKChainId();
  return useMutation(
    (params: { uri: string }) => {
      requiredParamInvariant(contract, "Contract is required");
      invariant(contract.app, "Contract does not support app");
      return contract.app.set(params.uri);
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}
