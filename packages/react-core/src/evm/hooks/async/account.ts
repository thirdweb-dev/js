import {
  RequiredParam,
  requiredParamInvariant,
} from "../../../core/query-utils/required-param";
import { cacheKeys } from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import {
  useMutation,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import type {
  SignerWithPermissions,
  SmartContract,
  SignerPermissionsInput,
  TransactionResult,
} from "@thirdweb-dev/sdk";
import invariant from "tiny-invariant";
import { WalletAddress } from "../../types";
import { useWallet } from "../../../core/hooks/wallet-hooks";

/** **********************/
/**       READ HOOKS    **/
/** **********************/

/**
 * Get all signers of account
 *
 * @example
 * ```javascript
 * const { data: accounts, isLoading, error } = useAccountSigners(contract);
 * ```
 *
 * @param contract - Instance of a `SmartContract`
 * @returns hook's `data` property contains an array of all signers
 * @twfeature Account
 * @smartWallet
 */
export function useAccountSigners(
  contract: RequiredParam<SmartContract>,
): UseQueryResult<SignerWithPermissions[]> {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.account.signers(contractAddress),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      invariant(
        contract.account.getAllSigners,
        "Contract instance does not support contract.account.getAllSigners",
      );
      return contract.account.getAllSigners();
    },
    { enabled: !!contract },
  );
}

/**
 * Get all the admins on a smart wallet account
 *
 * @example
 * ```javascript
 * const { data: accounts, isLoading, error } = useAccountAdmins(contract);
 * ```
 *
 * @param contract - Instance of `SmartContract`
 * @returns The hook's `data` property, once loaded, contains an array of all admins of the provided account
 * @twfeature Account
 * @smartWallet
 */
export function useAccountAdmins(
  contract: RequiredParam<SmartContract>,
): UseQueryResult<WalletAddress[]> {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.account.signers(contractAddress),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      invariant(
        contract.account.getAllAdmins,
        "Contract instance does not support contract.account.getAllAdmins",
      );
      return contract.account.getAllAdmins();
    },
    { enabled: !!contract },
  );
}

/**
 * Get all signers and admins on a smart wallet account.
 *
 * ```jsx
 * import { useAccountAdminsAndSigners } from "@thirdweb-dev/react";
 *
 * const { data: accounts, isLoading, error } = useAccountAdminsAndSigners(contract);
 * ```
 *
 * @param contract - Instance of `SmartContract`
 * @returns hook's `data` property containing an array of all admins and signers
 *
 * @twfeature Account
 * @smartWallet
 */
export function useAccountAdminsAndSigners(
  contract: RequiredParam<SmartContract>,
): UseQueryResult<SignerWithPermissions[]> {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.account.signers(contractAddress),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      invariant(
        contract.account.getAllAdminsAndSigners,
        "Contract instance does not support contract.account.getAllAdminsAndSigners",
      );

      return contract.account.getAllAdminsAndSigners();
    },
    { enabled: !!contract },
  );
}

/** **********************/
/**     WRITE HOOKS     **/
/** **********************/

type CreateSessionKeyInput = {
  keyAddress: string;
  permissions: SignerPermissionsInput;
};

/**
 * Create and add a session key for the smart wallet account
 *
 * @example
 * ```jsx
 *  const Component = () => {
 *    const {
 *      mutate: createSessionKey,
 *      isLoading,
 *      error,
 *    } = useCreateSessionKey();
 *
 *    if (error) {
 *      console.error("failed to create session key", error);
 *    }
 *
 *    return (
 *      <button
 *        disabled={isLoading}
 *        onClick={() => createSessionKey(
 *          keyAddress,
 *          {
 *            approvedCallTargets: ["0x..."], // the addresses of contracts that the session key can call
 *            nativeTokenLimitPerTransaction: 0.1, // the maximum amount of native token (in ETH) that the session key can spend per transaction
 *            startDate: new Date(), // the date when the session key becomes active
 *            expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // the date when the session key expires
 *          }
 *         )}
 *      >
 *        Create Session Key
 *      </button>
 *    );
 *  };
 * ```
 *
 * @twfeature Account
 *
 * @returns  Mutation object to create and add a session key for the smart wallet
 *
 * ```ts
 * const { mutateAsync, isLoading, error } = useCreateSessionKey();
 * ```
 *
 * ### options
 * The mutation function takes an object with the following properties as argument:
 *
 * #### address
 * The address to add as an admin on the account as a `string`.
 *
 * #### approvedCallTargets
 * An array of addresses that the session key can call as a `string[]`.
 *
 * #### nativeTokenLimitPerTransaction
 * The maximum amount of native token (in ETH) that the session key can spend per transaction as a `number`.
 *
 * #### startDate
 * The date when the session key becomes active as a `Date`.
 *
 * #### startDate
 * The date when the session key expires as a `Date`.
 *
 * @smartWallet
 */
export function useCreateSessionKey(): UseMutationResult<
  TransactionResult,
  unknown,
  CreateSessionKeyInput
> {
  const smartWallet = useWallet("smartWallet");
  return useMutation(async (args: CreateSessionKeyInput) => {
    requiredParamInvariant(smartWallet, "wallet is not connected");
    return smartWallet.createSessionKey(args.keyAddress, args.permissions);
  });
}

/**
 * Revoke a session key (or signer) on the smart wallet account
 *
 * @example
 * ```jsx
 * import { useRevokeSessionKey } from "@thirdweb-dev/react";
 *
 * // Your ERC20 token smart contract address
 * const keyAddress = "{{key_address}}";
 *
 * const Component = () => {
 *   const { mutate: revokeSessionKey, isLoading, error } = useRevokeSessionKey();
 *
 *   if (error) {
 *     console.error("failed to revoke session key", error);
 *   }
 *
 *   return (
 *     <button disabled={isLoading} onClick={() => revokeSessionKey(keyAddress)}>
 *       Revoke Session Key
 *     </button>
 *   );
 * };
 * ```
 *
 * @twfeature Account
 * @returns
 * Mutation object to revoke a session key (or signer) on the smart wallet
 *
 * ```ts
 * const { mutateAsync, isLoading, error } = useRevokeSessionKey();
 * ```
 *
 * The mutation function takes an address of type `string` to remove as an admin.
 *
 * @smartWallet
 */
export function useRevokeSessionKey(): UseMutationResult<
  TransactionResult,
  unknown,
  string
> {
  const smartWallet = useWallet("smartWallet");
  return useMutation(async (keyAddress: string) => {
    requiredParamInvariant(smartWallet, "wallet is not connected");
    return smartWallet.revokeSessionKey(keyAddress);
  });
}

/**
 * Add an additional admin on the smart wallet account
 *
 * @example
 * ```jsx
 * import { useAddAdmin } from "@thirdweb-dev/react";
 *
 * const adminAddress = "{{admin_address}}";
 *
 * const Component = () => {
 *   const { mutate: addAdmin, isLoading, error } = useAddAdmin();
 *
 *   if (error) {
 *     console.error("failed to add admin", error);
 *   }
 *
 *   return (
 *     <button disabled={isLoading} onClick={() => addAdmin(adminAddress)}>
 *       Add admin
 *     </button>
 *   );
 * };
 * ```
 *
 * @returns  mutation object to add given address as an admin
 *
 * @twfeature Account
 * @smartWallet
 */
export function useAddAdmin(): UseMutationResult<
  TransactionResult,
  unknown,
  string
> {
  const smartWallet = useWallet("smartWallet");
  return useMutation(async (adminAddress: string) => {
    requiredParamInvariant(smartWallet, "wallet is not connected");
    return smartWallet.addAdmin(adminAddress);
  });
}

/**
 * Remove an admin on the smart wallet account. This action has to be performed by an admin on the account.
 *
 * ```jsx
 * import { useRemoveAdmin } from "@thirdweb-dev/react";
 *
 * const adminAddress = "{{admin_address}}";
 *
 * const Component = () => {
 *   const { mutate: removeAdmin, isLoading, error } = useRemoveAdmin();
 *
 *   if (error) {
 *     console.error("failed to remove admin", error);
 *   }
 *
 *   return (
 *     <button disabled={isLoading} onClick={() => removeAdmin(adminAddress)}>
 *       Remove admin
 *     </button>
 *   );
 * };
 * ```
 *
 * @twfeature Account
 * @returns  mutation object to remove given address as an admin
 * @smartWallet
 */
export function useRemoveAdmin(): UseMutationResult<
  TransactionResult,
  unknown,
  string
> {
  const smartWallet = useWallet("smartWallet");
  return useMutation(async (adminAddress: string) => {
    requiredParamInvariant(smartWallet, "wallet is not connected");
    return smartWallet.removeAdmin(adminAddress);
  });
}
