import { hasFunction } from "../../common";
import { MissingRoleError } from "../../common/error";
import { getRoleHash, Role } from "../../common/role";
import { FEATURE_PERMISSIONS } from "../../constants/thirdweb-features";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResult } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import type {
  IPermissions,
  IPermissionsEnumerable,
} from "@thirdweb-dev/contracts-js";
import invariant from "tiny-invariant";

/**
 * Handle contract permissions
 * @remarks Configure roles and permissions for a contract, to restrict certain actions.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * const rolesAndMembers = await contract.roles.getAll();
 * await contract.roles.grantRole("admin", "0x...");
 * ```
 * @public
 */
export class ContractRoles<TContract extends IPermissions, TRole extends Role>
  implements DetectableFeature
{
  featureName = FEATURE_PERMISSIONS.name;
  private contractWrapper;
  /**
   * @internal
   * @remarks This is used for typing inside react hooks which is why it has to be public.
   */
  public readonly roles;

  constructor(
    contractWrapper: ContractWrapper<TContract>,
    roles: readonly TRole[],
  ) {
    this.contractWrapper = contractWrapper;
    this.roles = roles;
  }

  /** **************************
   * READ FUNCTIONS
   ****************************/

  /**
   * Call this to get get a list of addresses for all supported roles on the contract.
   * @remarks See {@link ContractRoles.get} to get a list of addresses that are members of a specific role.
   * @example
   * ```javascript
   * const rolesAndMembers = await contract.roles.getAll();
   * ```
   * @returns A record of {@link Role}s to lists of addresses that are members of the given role.
   * @throws If the contract does not support roles this will throw an error.
   *
   * @public
   * @twfeature Permissions
   */
  public async getAll(): Promise<Record<TRole, string[]>> {
    invariant(this.roles.length, "this contract has no support for roles");
    const roles = {} as Record<TRole, string[]>;
    for (const role of this.roles) {
      roles[role] = await this.get(role);
    }
    return roles;
  }

  /**
   * Call this to get a list of addresses that are members of a specific role.
   * @remarks See {@link ContractRoles.getAll} to get get a list of addresses for all supported roles on the contract.
   * @param role - The Role to to get a memberlist for.
   * @returns The list of addresses that are members of the specific role.
   * @throws If you are requestiong a role that does not exist on the contract this will throw an error.
   *
   * @example Say you want to get the list of addresses that are members of the minter role.
   * ```javascript
   * const minterAddresses = await contract.roles.get("minter");
   * ```
   *
   * @public
   * @twfeature Permissions
   */
  public async get(role: TRole): Promise<string[]> {
    invariant(
      this.roles.includes(role),
      `this contract does not support the "${role}" role`,
    );
    const wrapper = this.contractWrapper;
    if (
      hasFunction<IPermissionsEnumerable>("getRoleMemberCount", wrapper) &&
      hasFunction<IPermissionsEnumerable>("getRoleMember", wrapper)
    ) {
      const roleHash = getRoleHash(role);
      const count = (
        await wrapper.readContract.getRoleMemberCount(roleHash)
      ).toNumber();
      return await Promise.all(
        Array.from(Array(count).keys()).map((i) =>
          wrapper.readContract.getRoleMember(roleHash, i),
        ),
      );
    }
    throw new Error(
      "Contract does not support enumerating roles. Please implement IPermissionsEnumerable to unlock this functionality.",
    );
  }

  /**
   * Call this to OVERWRITE the list of addresses that are members of specific roles.
   *
   * Every role in the list will be overwritten with the new list of addresses provided with them.
   * If you want to add or remove addresses for a single address use {@link ContractRoles.grant} and {@link ContractRoles.revoke} respectively instead.
   * @param rolesWithAddresses - A record of {@link Role}s to lists of addresses that should be members of the given role.
   * @throws If you are requestiong a role that does not exist on the contract this will throw an error.
   * @example Say you want to overwrite the list of addresses that are members of the minter role.
   * ```javascript
   * const minterAddresses = await contract.roles.get("minter");
   * await contract.roles.setAll({
   *  minter: []
   * });
   * console.log(await contract.roles.get("minter")); // No matter what members had the role before, the new list will be set to []
   * ```
   * @public
   * @twfeature Permissions
   *
   * */
  public async setAll(rolesWithAddresses: {
    [key in TRole]?: string[];
  }): Promise<TransactionResult> {
    const roles = Object.keys(rolesWithAddresses) as TRole[];
    invariant(roles.length, "you must provide at least one role to set");
    invariant(
      roles.every((role) => this.roles.includes(role)),
      "this contract does not support the given role",
    );
    const currentRoles = await this.getAll();
    const encoded: string[] = [];
    // add / remove admin role at the end so we don't revoke admin then grant
    const sortedRoles = roles.sort((role) => (role === "admin" ? 1 : -1));
    for (let i = 0; i < sortedRoles.length; i++) {
      const role = sortedRoles[i];
      const addresses: string[] = rolesWithAddresses[role] || [];
      const currentAddresses = currentRoles[role] || [];
      const toAdd = addresses.filter(
        (address) => !currentAddresses.includes(address),
      );
      const toRemove = currentAddresses.filter(
        (address) => !addresses.includes(address),
      );
      if (toAdd.length) {
        toAdd.forEach((address) => {
          encoded.push(
            this.contractWrapper.readContract.interface.encodeFunctionData(
              "grantRole",
              [getRoleHash(role), address],
            ),
          );
        });
      }
      if (toRemove.length) {
        for (let j = 0; j < toRemove.length; j++) {
          const address = toRemove[j];
          const revokeFunctionName = (await this.getRevokeRoleFunctionName(
            address,
          )) as any;
          encoded.push(
            this.contractWrapper.readContract.interface.encodeFunctionData(
              revokeFunctionName,
              [getRoleHash(role), address],
            ),
          );
        }
      }
    }
    return {
      receipt: await this.contractWrapper.multiCall(encoded),
    };
  }

  /**
   * Throws an error if an address is missing the roles specified.
   *
   * @param roles - The roles to check
   * @param address - The address to check
   *
   * @internal
   */
  public async verify(roles: TRole[], address: string): Promise<void> {
    await Promise.all(
      roles.map(async (role) => {
        const members = await this.get(role);
        if (
          !members.map((a) => a.toLowerCase()).includes(address.toLowerCase())
        ) {
          throw new MissingRoleError(address, role);
        }
      }),
    );
  }

  /** **************************
   * WRITE FUNCTIONS
   ****************************/

  /**
   * Call this to grant a role to a specific address.
   *
   * @remarks Make sure you are sure you want to grant the role to the address.
   *
   * @example
   * ```javascript
   * await contract.roles.grant("minter", "0x1234567890123456789012345678901234567890");
   * ```
   *
   * @param role - The {@link Role} to grant to the address
   * @param address - The address to grant the role to
   * @returns The transaction receipt
   * @throws If you are trying to grant does not exist on the contract this will throw an error.
   *
   * @public
   * @twfeature Permissions
   */
  public async grant(role: TRole, address: string): Promise<TransactionResult> {
    invariant(
      this.roles.includes(role),
      `this contract does not support the "${role}" role`,
    );
    return {
      receipt: await this.contractWrapper.sendTransaction("grantRole", [
        getRoleHash(role),
        address,
      ]),
    };
  }

  /**
   * Call this to revoke a role from a specific address.
   *
   * @remarks
   *
   * -- Caution --
   *
   * This will let you remove yourself from the role, too.
   * If you remove yourself from the admin role, you will no longer be able to administer the contract.
   * There is no way to recover from this.
   *
   * @example
   * ```javascript
   * await contract.roles.revoke("minter", "0x1234567890123456789012345678901234567890");
   * ```
   *
   * @param role - The {@link Role} to revoke
   * @param address - The address to revoke the role from
   * @returns The transaction receipt
   * @throws If you are trying to revoke does not exist on the module this will throw an error.
   *
   * @public
   * @twfeature Permissions
   */
  public async revoke(
    role: TRole,
    address: string,
  ): Promise<TransactionResult> {
    invariant(
      this.roles.includes(role),
      `this contract does not support the "${role}" role`,
    );
    const revokeFunctionName = await this.getRevokeRoleFunctionName(address);
    return {
      receipt: await this.contractWrapper.sendTransaction(revokeFunctionName, [
        getRoleHash(role),
        address,
      ]),
    };
  }

  /** **************************
   * PRIVATE FUNCTIONS
   ****************************/

  private async getRevokeRoleFunctionName(address: string) {
    const signerAddress = await this.contractWrapper.getSignerAddress();
    if (signerAddress.toLowerCase() === address.toLowerCase()) {
      return "renounceRole";
    }
    return "revokeRole";
  }
}
