import {
  RequiredParam,
  requiredParamInvariant,
} from "../../../core/query-utils/required-param";
import { useSDKChainId } from "../useSDK";
import { WalletAddress } from "../../types";
import {
  cacheKeys,
  invalidateContractAndBalances,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import {
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import type { SmartContract } from "@thirdweb-dev/sdk";
import type { BytesLike } from "ethers";
import invariant from "tiny-invariant";

/** **********************/
/**       READ HOOKS    **/
/** **********************/

/**
 * Get all accounts
 *
 * @example
 * ```javascript
 * const { data: accounts, isLoading, error } = useAccounts(contract);
 * ```
 *
 * @param contract - Instance of a account factory contract
 * @returns Query result object that includes an array of all accounts with their associated admin
 * @twfeature AccountFactory
 * @smartWallet
 */
export function useAccounts(
  contract: RequiredParam<SmartContract>,
): UseQueryResult<string[]> {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.accountFactory.getAll(contractAddress),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      invariant(
        contract.accountFactory.getAllAccounts,
        "Contract instance does not support contract.accountFactory.getAllAccounts",
      );
      return contract.accountFactory.getAllAccounts();
    },
    { enabled: !!contract },
  );
}

/**
 * Get all accounts associated with the provided address
 *
 * @example
 * ```javascript
 * const { data: accountsForAddress, isLoading, error } = useAccountsForAddress(contract, "{{account_address}}");
 * ```
 *
 * @param contract - Instance of a account factory contract
 * @param address - the address to get associated accounts for
 * @returns Query result object that includes an array of all accounts associated with the address
 *
 * @twfeature AccountFactory
 * @smartWallet
 */
export function useAccountsForAddress(
  contract: RequiredParam<SmartContract>,
  address: RequiredParam<WalletAddress>,
): UseQueryResult<string[]> {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.accountFactory.getAllForAddress(
      contractAddress,
      address,
    ),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      invariant(
        contract.accountFactory.getAssociatedAccounts,
        "Contract instance does not support contract.accountFactory.getAssociatedAccounts",
      );
      return contract.accountFactory.getAssociatedAccounts(address || "");
    },
    { enabled: !!contract },
  );
}

/**
 * Check if a account has been deployed for the given admin in the account factory contract
 *
 * @example
 * ```javascript
 * const { data: isAccountDeployed, isLoading, error } = useIsAccountDeployed(contract);
 * ```
 *
 * @param contract - Instance of a account factory contract
 * @returns a boolean indicating if a account has been deployed for the given admin
 * @twfeature AccountFactory
 * @smartWallet
 */
export function useIsAccountDeployed(
  contract: RequiredParam<SmartContract>,
  admin: RequiredParam<WalletAddress>,
  extraData?: BytesLike,
): UseQueryResult<boolean> {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.accountFactory.isAccountDeployed(contractAddress, admin),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      invariant(
        contract.accountFactory.isAccountDeployed,
        "Contract instance does not support contract.accountFactory.getAllAccounts",
      );
      invariant(admin, "No account address provided");
      return contract.accountFactory.isAccountDeployed(admin, extraData);
    },
    { enabled: !!contract },
  );
}

/** **********************/
/**     WRITE HOOKS     **/
/** **********************/
/**
 * Create a account in the account factory contract
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: createAccount,
 *     isLoading,
 *     error,
 *   } = useCreateAccount(contract);
 *
 *   if (error) {
 *     console.error("failed to create account", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => createAccount("0x...")}
 *     >
 *       Create Account
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - Instance of a account factory contract
 * @returns A mutation object to create a account
 * @twfeature AccountFactory
 * @smartWallet
 */
export function useCreateAccount(contract: RequiredParam<SmartContract>) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (admin: string, extraData?: BytesLike) => {
      requiredParamInvariant(contract, "contract is undefined");

      return contract.accountFactory.createAccount(admin, extraData);
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
