import { useActiveChainId } from "../../Provider";
import { RequiredParam, WalletAddress } from "../../types";
import {
  cacheKeys,
  invalidateContractAndBalances,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Multiwrap,
  Role,
  SmartContract,
  Split,
  ValidContractInstance,
  Vote,
} from "@thirdweb-dev/sdk";
import { constants } from "ethers";
import invariant from "tiny-invariant";

/** **********************/
/**         UTILS       **/
/** **********************/

/**
 * @internal
 */
export type ContractWithRoles =
  | Exclude<ValidContractInstance, Vote | Split | Multiwrap>
  | SmartContract;

/**
 * @internal
 */
export type RolesForContract<TContract extends ContractWithRoles> =
  TContract extends SmartContract
    ? Role | (string & {})
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
 * Use this to get the roles of a {@link SmartContract}
 *
 * @example
 * ```jsx
 * const { data: roles, isLoading, error } = useAllRoleMembers(SmartContract);
 * ```
 *
 * @param contract - an instance of a {@link SmartContract}
 * @returns a list of addresses for all supported roles on the contract.
 * @beta
 */
export function useAllRoleMembers<TContract extends ContractWithRoles>(
  contract: RequiredParam<TContract>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork<Awaited<GetAllReturnType<TContract>>>(
    cacheKeys.extensions.roles.getAll(contractAddress),
    () => {
      invariant(contract, "No contract provided");
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
 * Use this to get the members of a role on a {@link SmartContract}
 *
 * @example
 * ```jsx
 * const { data: members, isLoading, error } = useRoleMembers(SmartContract, "admin");
 * ```
 *
 * @param contract - an instance of a {@link SmartContract}
 * @param role - the role to get the members of, see {@link Role}
 * @returns a list of addresses that are members of the role
 * @beta
 */
export function useRoleMembers<TContract extends ContractWithRoles>(
  contract: RequiredParam<TContract>,
  role: RolesForContract<TContract>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.extensions.roles.get(contractAddress, role),
    () => {
      invariant(contract, "No contract provided");
      invariant(contract.roles, "Contract does not support roles");
      return contract.roles.get(role);
    },
    {
      enabled: !!contract && !!contractAddress && !!role,
    },
  );
}

/**
 * Use this to check if a {@link WalletAddress} is a member of a role on a {@link SmartContract}
 *
 * @example
 * ```jsx
 * const { data: isMember, isLoading, error } = useIsAddressRole(SmartContract, "admin", "0x123");
 * ```
 *
 * @param contract - an instance of a {@link SmartContract}
 * @param role - the role to check the member against, see {@link Role}
 * @param walletAddress - the address to check
 * @returns true if the address is a member of the role, or false if not
 * @beta
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
 * Use this to OVERWRITE the list of addresses that are members of specific roles
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: overwriteRoles,
 *     isLoading,
 *     error,
 *   } = useSetAllRoleMembers(SmartContract);
 *
 *   if (error) {
 *     console.error("failed to overwrite roles", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => overwriteRoles({  rolesWithAddresses: { minter: [] } })}
 *     >
 *       Overwrite Roles
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link SmartContract}
 * @returns a mutation object that can be used to overwrite all roles on the contract
 * @beta
 */
export function useSetAllRoleMembers<TContract extends ContractWithRoles>(
  contract: RequiredParam<TContract>,
) {
  const activeChainId = useActiveChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (rolesWithAddresses: {
      [role in RolesForContract<TContract>]: string[];
    }) => {
      invariant(contract, "No contract provided");
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

// const { mutate } = useSetAllRoleMembers(undefined as unknown as NFTCollection);

/**
 * Use this to grant a {@link WalletAddress} a specific role on a {@link SmartContract}
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: grantRole,
 *     isLoading,
 *     error,
 *   } = useGrantRole(SmartContract);
 *
 *   if (error) {
 *     console.error("failed to grant role", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => grantRole({  role: "admin", address: "0x123" })}
 *     >
 *       Grant Role
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link SmartContract}
 * @returns a mutation object that can be used to grant a member of a role on the contract
 * @beta
 */
export function useGrantRole<TContract extends ContractWithRoles>(
  contract: RequiredParam<TContract>,
) {
  const activeChainId = useActiveChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (params: {
      role: RolesForContract<TContract>;
      address: WalletAddress;
    }) => {
      invariant(contract, "No contract provided");
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
 * Use this to revoke a {@link WalletAddress} a specific role on a {@link SmartContract}
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: revokeRole,
 *     isLoading,
 *     error,
 *   } = useRevokeRole(SmartContract);
 *
 *   if (error) {
 *     console.error("failed to revoke role", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => revokeRole({  role: "admin", address: "0x123" })}
 *     >
 *       Revoke Role
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link SmartContract}
 * @returns a mutation object that can be used to revoke a role from a member on the contract
 * @beta
 */
export function useRevokeRole<TContract extends ContractWithRoles>(
  contract: RequiredParam<TContract>,
) {
  const activeChainId = useActiveChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  return useMutation(
    async (params: {
      role: RolesForContract<TContract>;
      address: WalletAddress;
    }) => {
      invariant(contract, "No contract provided");
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
