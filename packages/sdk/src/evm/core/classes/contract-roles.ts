import type {
  IMulticall,
  IPermissions,
  IPermissionsEnumerable,
} from "@thirdweb-dev/contracts-js";
import invariant from "tiny-invariant";
import { resolveAddress } from "../../common/ens/resolveAddress";
import { MissingRoleError } from "../../common/error";
import { hasFunction } from "../../common/feature-detection/hasFunction";
import { Role, getRoleHash } from "../../common/role";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_PERMISSIONS } from "../../constants/thirdweb-features";
import { Address } from "../../schema/shared/Address";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractEncoder } from "./contract-encoder";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";

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
export class ContractRoles<TRole extends Role> implements DetectableFeature {
  featureName = FEATURE_PERMISSIONS.name;
  private contractWrapper;
  /**
   * @internal
   * @remarks This is used for typing inside react hooks which is why it has to be public.
   */
  public readonly roles;

  constructor(
    contractWrapper: ContractWrapper<IPermissions>,
    roles: readonly TRole[],
  ) {
    this.contractWrapper = contractWrapper;
    this.roles = roles;
  }

  /** **************************
   * READ FUNCTIONS
   ****************************/

  /**
   * Get all members of all roles
   * @remarks See {@link ContractRoles.get} to get a list of addresses that are members of a specific role.
   * @example
   * ```javascript
   * const rolesAndMembers = await contract.roles.getAll();
   * ```
   * @returns A record of {@link Role}s to lists of addresses that are members of the given role.
   * @throws If the contract does not support roles this will throw an error.
   *
   * @public
   * @twfeature PermissionsEnumerable
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
   * Get all members of a specific role
   * @remarks See {@link ContractRoles.getAll} to get get a list of addresses for all supported roles on the contract.
   * @param role - The Role to to get a memberlist for.
   * @returns The list of addresses that are members of the specific role.
   * @throws If you are requesting a role that does not exist on the contract this will throw an error.
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
        await wrapper.read("getRoleMemberCount", [roleHash])
      ).toNumber();
      return await Promise.all(
        Array.from(Array(count).keys()).map((i) =>
          wrapper.read("getRoleMember", [roleHash, i]),
        ),
      );
    }
    throw new Error(
      "Contract does not support enumerating roles. Please implement IPermissionsEnumerable to unlock this functionality.",
    );
  }

  /**
   * Overwrite the list of members for specific roles
   *
   * @remarks Every role in the list will be overwritten with the new list of addresses provided with them.
   * If you want to add or remove addresses for a single address use {@link ContractRoles.grant} and {@link ContractRoles.revoke} respectively instead.
   * @param rolesWithAddresses - A record of {@link Role}s to lists of addresses that should be members of the given role.
   * @throws If you are requesting a role that does not exist on the contract this will throw an error.
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
  setAll = /* @__PURE__ */ buildTransactionFunction(
    async (rolesWithAddresses: {
      [key in TRole]?: AddressOrEns[];
    }): Promise<Transaction> => {
      const contractEncoder = new ContractEncoder(this.contractWrapper);

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
        const addresses: Address[] = await Promise.all(
          rolesWithAddresses[role]?.map(
            async (addressOrEns) => await resolveAddress(addressOrEns),
          ) || [],
        );
        const currentAddresses: Address[] = await Promise.all(
          currentRoles[role]?.map(
            async (addressOrEns) =>
              await resolveAddress(addressOrEns as AddressOrEns),
          ) || [],
        );
        const toAdd = addresses.filter(
          (address) => !currentAddresses.includes(address),
        );
        const toRemove = currentAddresses.filter(
          (address) => !addresses.includes(address),
        );
        if (toAdd.length) {
          toAdd.forEach((address) => {
            encoded.push(
              contractEncoder.encode("grantRole", [getRoleHash(role), address]),
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
              contractEncoder.encode(revokeFunctionName, [
                getRoleHash(role),
                address,
              ]),
            );
          }
        }
      }

      return Transaction.fromContractWrapper({
        contractWrapper: this
          .contractWrapper as unknown as ContractWrapper<IMulticall>,
        method: "multicall",
        args: [encoded],
      });
    },
  );

  /**
   * Throws an error if an address is missing the roles specified.
   *
   * @param roles - The roles to check
   * @param address - The address to check
   *
   * @internal
   */
  public async verify(roles: TRole[], address: AddressOrEns): Promise<void> {
    await Promise.all(
      roles.map(async (role) => {
        const members = await this.get(role);
        const resolvedAddress: Address = await resolveAddress(address);
        if (
          !members
            .map((a) => a.toLowerCase())
            .includes(resolvedAddress.toLowerCase())
        ) {
          throw new MissingRoleError(resolvedAddress, role);
        }
      }),
    );
  }

  /** **************************
   * WRITE FUNCTIONS
   ****************************/

  /**
   * Grant a role to a specific address
   *
   * @remarks Make sure you are sure you want to grant the role to the address.
   *
   * @example
   * ```javascript
   * await contract.roles.grant("minter", "{{wallet_address}}");
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
  grant = /* @__PURE__ */ buildTransactionFunction(
    async (role: TRole, address: AddressOrEns): Promise<Transaction> => {
      invariant(
        this.roles.includes(role),
        `this contract does not support the "${role}" role`,
      );

      const resolvedAddress: Address = await resolveAddress(address);
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "grantRole",
        args: [getRoleHash(role), resolvedAddress],
      });
    },
  );

  /**
   * Revoke a role from a specific address
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
   * await contract.roles.revoke("minter", "{{wallet_address}}");
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
  revoke = /* @__PURE__ */ buildTransactionFunction(
    async (role: TRole, address: AddressOrEns): Promise<Transaction> => {
      invariant(
        this.roles.includes(role),
        `this contract does not support the "${role}" role`,
      );
      const resolvedAddress = await resolveAddress(address);
      const revokeFunctionName = await this.getRevokeRoleFunctionName(
        resolvedAddress,
      );

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: revokeFunctionName,
        args: [getRoleHash(role), resolvedAddress],
      });
    },
  );

  /** **************************
   * PRIVATE FUNCTIONS
   ****************************/

  private async getRevokeRoleFunctionName(address: AddressOrEns) {
    const resolvedAddress = await resolveAddress(address);
    const signerAddress = await this.contractWrapper.getSignerAddress();
    if (signerAddress.toLowerCase() === resolvedAddress.toLowerCase()) {
      return "renounceRole";
    }
    return "revokeRole";
  }
}
