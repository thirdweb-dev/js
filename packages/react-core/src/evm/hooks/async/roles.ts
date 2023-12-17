import {
  requiredParamInvariant,
  RequiredParam,
} from "../../../core/query-utils/required-param";
import { useSDKChainId } from "../useSDK";
import { WalletAddress } from "../../types";
import {
  cacheKeys,
  invalidateContractAndBalances,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Role, ValidContractInstance } from "@thirdweb-dev/sdk";
import type { Vote } from "@thirdweb-dev/sdk";
import type { SmartContract } from "@thirdweb-dev/sdk";
import { constants } from "ethers";
import invariant from "tiny-invariant";

/** **********************/
/**         UTILS       **/
/** **********************/

/**
 * @internal
 */
export type ContractWithRoles = Exclude<ValidContractInstance, Vote>;

/**
 * @permissionControl
 */
export type RolesForContract<TContract extends ContractWithRoles> =
  TContract extends SmartContract
    ? // eslint-disable-next-line @typescript-eslint/ban-types
      Role | (string & {})
    : NonNullable<Exclude<TContract, SmartContract>["roles"]>["roles"][number];

/**
 * @internal
 */
type GetAllReturnType<TContract extends ContractWithRoles> = Promise<
  Record<RolesForContract<TContract>, string[]>
>;

/** **********************/
/**     READ  HOOKS     **/
/** **********************/

/**
 * Hook for getting all wallet addresses that have a role in a smart contract.
 *
 * Available to use on contracts that implement `Permissions`.
 *
 * @example
 *
 * ```jsx
 * import { useAllRoleMembers, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address (must implement permission controls)
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useAllRoleMembers(contract);
 * }
 * ```
 *
 * @param contract - an instance of a `SmartContract`
 *
 * @returns
 * The hook's data property, once loaded, is an object, where the keys are the role names and the values are arrays of wallet addresses that have that role.
 *
 * ```ts
 * Record<
 *   | "admin"
 *   | "transfer"
 *   | "minter"
 *   | "pauser"
 *   | "lister"
 *   | "asset"
 *   | "unwrap"
 *   | "factory"
 *   | (string & {}),
 *   string[]
 * > | undefined;
 * ```
 *
 * For example, if the contract has two roles, `admin` and `transfer`, and the `admin` role has two members, the `data` property will look like this:
 *
 * ```ts
 * {
 *   admin: ["0x1234", "0x5678"],
 *   transfer: [],
 * }
 * ```
 * @twfeature PermissionsEnumerable
 * @permissionControl
 */
export function useAllRoleMembers<TContract extends ContractWithRoles>(
  contract: RequiredParam<TContract>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork<Awaited<GetAllReturnType<TContract>>>(
    cacheKeys.extensions.roles.getAll(contractAddress),
    () => {
      requiredParamInvariant(contract, "No contract provided");
      invariant(contract.roles, "Contract does not support roles");
      // have to cast to any because of role bs, type is defined in the useQueryWithNetwork definition above
      return contract.roles.getAll() as any;
    },
    {
      enabled: !!contract && !!contractAddress,
    },
  );
}

/**
 * Hook for getting all wallet addresses that have a specific role in a smart contract.
 *
 * Available to use on contracts that implement the `PermissionsEnumerable` interface.
 *
 * @example
 *
 * ```jsx
 * import { useContract, useRoleMembers } from "@thirdweb-dev/react";
 *
 * // Your smart contract address (must implement permission controls)
 * const contractAddress = "{{contract_address}}";
 *
 * const roleName = "admin";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useRoleMembers(contract, roleName);
 * }
 * ```
 *
 * @param contract - an instance of a `SmartContract`
 * @param role - The name of the role to get the members of. Can be any custom role, or a built-in role, such as `admin`, `transfer`, `minter`, `pauser`, `lister`, `asset`, `unwrap`, or `factory`.
 * @returns The hook's `data` property, once loaded, is an array of wallet addresses that have the specified role
 *
 * @twfeature Permissions
 * @permissionControl
 */
export function useRoleMembers<TContract extends ContractWithRoles>(
  contract: RequiredParam<TContract>,
  role: RolesForContract<TContract>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.extensions.roles.get(contractAddress, role),
    () => {
      requiredParamInvariant(contract, "No contract provided");
      invariant(contract.roles, "Contract does not support roles");
      return contract.roles.get(role);
    },
    {
      enabled: !!contract && !!contractAddress && !!role,
    },
  );
}

/**
 * Hook to check if an address is a member of a role on a smart contract.
 *
 * Available to use on contracts that implement "Permission Controls" interface
 *
 * Provide the following arguments to the hook:
 *
 * 1. `contract` - The contract instance to check the role on.
 * 2. `roleName` - The name of the role to check.
 * 3. `address` - The wallet address to see if it is a member of the role.
 *
 * @example
 *
 * ```jsx
 * import { useIsAddressRole, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address (must implement permission controls)
 * const contractAddress = "{{contract_address}}";
 *
 * // Address of the wallet to check
 * const walletAddress = "{{wallet_address}}";
 *
 * // Name of the role to check
 * const roleName = "admin";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const isMember = useIsAddressRole(contract, roleName, walletAddress);
 * }
 * ```
 *
 * @param contract - an instance of a `SmartContract`
 *
 * @param role - The name of the role to check. Can be any custom role, or a built-in role, such as `"admin"`, `"transfer"`, `"minter"`, `"pauser"`, `"lister"`, `"asset"`, `"unwrap"`, or `"factory"`.
 * @param walletAddress - The wallet address to check if it is a member of the role. Use the `useAddress` hook to get the current wallet address.
 * @returns `true` if the address is a member of the role, or `false` if not
 *
 * @twfeature PermissionsEnumerable
 * @permissionControl
 */
export function useIsAddressRole<TContract extends ContractWithRoles>(
  contract: RequiredParam<TContract>,
  role: RolesForContract<TContract>,
  walletAddress: RequiredParam<WalletAddress>,
): boolean {
  // TODO this might be possible to do with `verify` fn instead?
  const contractHasRoles = !!(contract && contract.roles);
  const { data } = useRoleMembers(
    contractHasRoles ? contract : undefined,
    role,
  );

  // if the contract does not have roles then everything is allowed === true
  if (contractHasRoles === false) {
    return true;
  }

  // switch logic (if address 0 is in the role list then anyone has permissions to it)
  if (data?.includes(constants.AddressZero)) {
    return true;
  }

  // actual role check logic
  return !!(walletAddress && data?.includes(walletAddress));
}

/** **********************/
/**     WRITE HOOKS     **/
/** **********************/

/**
 * Overwrite the list of members for specific roles
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: overwriteRoles,
 *     isLoading,
 *     error,
 *   } = useSetAllRoleMembers(contract);
 *
 *   if (error) {
 *     console.error("failed to overwrite roles", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => overwriteRoles({ rolesWithAddresses: { minter: ["{{wallet_address}"] } })}
 *     >
 *       Overwrite Roles
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link SmartContract}
 * @returns a mutation object that can be used to overwrite all roles on the contract
 * @twfeature Permissions
 * @permissionControl
 */
export function useSetAllRoleMembers<TContract extends ContractWithRoles>(
  contract: RequiredParam<TContract>,
) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (rolesWithAddresses: {
      [role in RolesForContract<TContract>]: string[];
    }) => {
      requiredParamInvariant(contract, "No contract provided");
      invariant(contract.roles, "Contract does not support roles");
      await contract.roles.setAll(rolesWithAddresses);
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

/**
 * Hook for granting a role on a smart contract.
 *
 * Available to use on smart contracts that implement the "Permissions" interface.
 *
 * @example
 * ```jsx
 * import { useGrantRole, useContract, Web3Button } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 * const roleToGrant = "{{role}}";
 * const walletAddressToGrant = "{{wallet_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { mutateAsync: grantRole, isLoading, error } = useGrantRole(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         grantRole({
 *           role: roleToGrant, // name of your role.
 *           address: walletAddressToGrant, // address to grant the role to.
 *         })
 *       }
 *     >
 *       Grant Role
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a `SmartContract`
 *
 * @returns a mutation object that can be used to grant a member of a role on the contract
 *
 * #### role (required)
 *
 * The name of the role to grant the address.
 *
 * Accepts any `string` value to include custom-defined roles.
 *
 * Also accepts the default roles available on the [prebuilt contracts](https://portal.thirdweb.com/pre-built-contracts):
 *
 * ```ts
 * string |
 *   "admin" |
 *   "minter" |
 *   "transfer" |
 *   "lister" |
 *   "asset" |
 *   "unwrap" |
 *   "pauser" |
 *   "factory";
 * ```
 *
 * #### address (required)
 *
 * The address to grant the role to.
 *
 * To use the address of the connected wallet, use the `useAddress` hook.
 *
 * @twfeature Permissions | PermissionsEnumerable
 * @permissionControl
 */
export function useGrantRole<TContract extends ContractWithRoles>(
  contract: RequiredParam<TContract>,
) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (params: {
      role: RolesForContract<TContract>;
      address: WalletAddress;
    }) => {
      requiredParamInvariant(contract, "No contract provided");
      invariant(contract.roles, "Contract does not support roles");
      await contract.roles.grant(params.role as any, params.address);
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

/**
 * Hook for revoking a wallet address from a role on a smart contract.
 *
 * Available to use on contracts that implement "Permission Controls" interface
 *
 * The wallet address that initiates this transaction must have the relevant permissions on the contract to remove the role from the wallet address (typically `admin` level required).
 *
 * ```jsx
 * import { useContract, useRevokeRole, Web3Button } from "@thirdweb-dev/react";
 *
 * // Your smart contract address (must implement permission controls)
 * const contractAddress = "{{contract_address}}";
 * const walletAddress = "{{wallet_address}}";
 *
 * function App() {
 *   // Contract must be a contract that implements the Permission Controls interface
 *   const { contract } = useContract(contractAddress);
 *   const { mutateAsync: revokeRole, isLoading, error } = useRevokeRole(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         revokeRole({
 *           role: "admin",
 *           address: walletAddress,
 *         })
 *       }
 *     >
 *       Revoke Role
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a `SmartContract`
 *
 * @returns a mutation object that can be used to revoke a role from a member on the contract
 * #### role (required)
 *
 * The role to revoke from the wallet address.
 *
 * Can be any custom role, or a built-in role, such as `admin`, `transfer`, `minter`, `pauser`, `lister`, `asset`, `unwrap`, or `factory`.
 *
 * #### address
 *
 * The wallet address to revoke the role from.
 *
 * To use the connected wallet address, use the `useAddress` hook.
 *
 * @twfeature Permissions | PermissionsEnumerable
 * @permissionControl
 */
export function useRevokeRole<TContract extends ContractWithRoles>(
  contract: RequiredParam<TContract>,
) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  return useMutation(
    async (params: {
      role: RolesForContract<TContract>;
      address: WalletAddress;
    }) => {
      requiredParamInvariant(contract, "No contract provided");
      invariant(contract.roles, "Contract does not support roles");
      await contract.roles.revoke(params.role as any, params.address);
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
