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
 * @param contract - an instance of a account
 * @returns a response object that includes an array of all signers of the provided account
 * @twfeature Account
 * @see {@link https://portal.thirdweb.com/react/react.useaccountsigners?utm_source=sdk | Documentation}
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
 * Get all admins of account
 *
 * @example
 * ```javascript
 * const { data: accounts, isLoading, error } = useAccountSigners(contract);
 * ```
 *
 * @param contract - an instance of a account
 * @returns a response object that includes an array of all admins of the provided account
 * @twfeature Account
 * @see {@link https://portal.thirdweb.com/react/react.useaccountadmins?utm_source=sdk | Documentation}
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
 * Get all signers and admins of account
 *
 * @example
 * ```javascript
 * const { data: accounts, isLoading, error } = useAccountSigners(contract);
 * ```
 *
 * @param contract - an instance of a account
 * @returns a response object that includes an array of all admins of the provided account
 * @twfeature Account
 * @see {@link https://portal.thirdweb.com/react/react.useaccountadmins?utm_source=sdk | Documentation}
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

export type CreateSessionKeyInput = {
  keyAddress: string;
  permissions: SignerPermissionsInput;
};

/**
 * Create and add a session key for the smart wallet
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: createSessionKey,
 *     isLoading,
 *     error,
 *   } = useCreateSessionKey();
 *
 *   if (error) {
 *     console.error("failed to create session key", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => createSessionKey(
 *         "0x...",
 *         {
 *           approvedCallTargets: ["0x..."], // the addresses of contracts that the session key can call
 *           nativeTokenLimitPerTransaction: 0.1, // the maximum amount of native token (in ETH) that the session key can spend per transaction
 *           startDate: new Date(), // the date when the session key becomes active
 *           expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // the date when the session key expires
 *         }
 *        )}
 *     >
 *       Create Session Key
 *     </button>
 *   );
 * };
 * ```
 *
 * @twfeature Account
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
 * Revoke a session key on the smart wallet
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: revokeSessionKey,
 *     isLoading,
 *     error,
 *   } = useRevokeSessionKey();
 *
 *   if (error) {
 *     console.error("failed to revoke session key", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => revokeSessionKey("0x...")}
 *     >
 *       Revoke Session Key
 *     </button>
 *   );
 * };
 * ```
 *
 * @twfeature Account
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
 * Add an additional admin on the smart wallet
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: addAdmin,
 *     isLoading,
 *     error,
 *   } = useAddAdmin();
 *
 *   if (error) {
 *     console.error("failed to add admin", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => addAdmin("0x...")}
 *     >
 *       Add admin
 *     </button>
 *   );
 * };
 * ```
 *
 * @twfeature Account
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
 * Add an additional admin on the smart wallet
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: removeAdmin,
 *     isLoading,
 *     error,
 *   } = useRemoveAdmin();
 *
 *   if (error) {
 *     console.error("failed to remove admin", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => removeAdmin("0x...")}
 *     >
 *       Remove admin
 *     </button>
 *   );
 * };
 * ```
 *
 * @twfeature Account
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
