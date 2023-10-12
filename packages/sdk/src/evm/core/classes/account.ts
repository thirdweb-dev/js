import {
  FEATURE_ACCOUNT,
  FEATURE_ACCOUNT_PERMISSIONS,
} from "../../constants/thirdweb-features";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";

import type { IAccountCore } from "@thirdweb-dev/contracts-js";
import { assertEnabled, detectContractFeature } from "../../common";
import { AddressOrEns } from "../../schema";
import {
  PermissionSnapshotInput,
  SignerPermissionsInput,
  SignerWithPermissions,
} from "../../types";
import { buildTransactionFunction } from "../../common/transactions";
import { AccountPermissions } from "./account-permissions";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- TO BE REMOVED IN V4
export class Account<TContract extends IAccountCore>
  implements DetectableFeature
{
  featureName = FEATURE_ACCOUNT.name;
  private contractWrapper: ContractWrapper<IAccountCore>;
  private accountPermissions: AccountPermissions | undefined;

  constructor(contractWrapper: ContractWrapper<IAccountCore>) {
    this.contractWrapper = contractWrapper;
    this.accountPermissions = this.detectAccountPermissions();
  }

  private detectAccountPermissions(): AccountPermissions | undefined {
    if (
      detectContractFeature<IAccountCore>(
        this.contractWrapper,
        "AccountPermissions",
      )
    ) {
      return new AccountPermissions(this.contractWrapper);
    }
    return undefined;
  }

  getAddress(): string {
    return this.contractWrapper.address;
  }

  /*********************************
   * READ FUNCTIONS
   ********************************/

  /**
   * Get whether a signer is an admin on the account.
   *
   * @example
   * ```javascript
   * const isAdmin = await contract.account.isAdmin(signer);
   * ```
   * @param signer - The address of a signer of the account.
   * @returns whether a signer is an admin on the account.
   *
   * @twfeature AccountPermissions
   */
  public async isAdmin(signerAddress: AddressOrEns): Promise<boolean> {
    return assertEnabled(
      this.accountPermissions,
      FEATURE_ACCOUNT_PERMISSIONS,
    ).isAdmin(signerAddress);
  }

  /**
   * Get whether a signer has permissions to use the account.
   *
   * @example
   * ```javascript
   * const isAdmin = await contract.account.isSigner(signer);
   * ```
   * @param signer - The address of a signer of the account.
   * @returns whether a signer has permissions to use the account.
   *
   * @twfeature AccountPermissions
   */
  public async isSigner(signerAddress: AddressOrEns): Promise<boolean> {
    return assertEnabled(
      this.accountPermissions,
      FEATURE_ACCOUNT_PERMISSIONS,
    ).isSigner(signerAddress);
  }

  /**
   * Get all admins of the account.
   *
   * @example
   * ```javascript
   * const allAdmins = await contract.account.getAllAdmins();
   * ```
   *
   * @returns all admins of the account.
   *
   * @twfeature AccountPermissions
   */
  public async getAllAdmins(): Promise<string[]> {
    return assertEnabled(
      this.accountPermissions,
      FEATURE_ACCOUNT_PERMISSIONS,
    ).getAllAdmins();
  }

  /**
   * Get all (non-admin) signers with permissions to use the account.
   *
   * @example
   * ```javascript
   * const allSigners = await contract.account.getAllSigners();
   * ```
   *
   * @returns all (non-admin) signers with permissions to use the account.
   *
   * @twfeature AccountPermissions
   */
  public async getAllSigners(): Promise<SignerWithPermissions[]> {
    return assertEnabled(
      this.accountPermissions,
      FEATURE_ACCOUNT_PERMISSIONS,
    ).getAllSigners();
  }

  /**
   * Get all admins and non-admin signers with permissions to use the account.
   *
   * @example
   * ```javascript
   * const allAdminsAndSigners = await contract.account.getAllAdminsAndSigners();
   * ```
   *
   * @returns all admins and non-admin signers with permissions to use the account.
   *
   * @twfeature AccountPermissions
   */
  public async getAllAdminsAndSigners(): Promise<SignerWithPermissions[]> {
    return assertEnabled(
      this.accountPermissions,
      FEATURE_ACCOUNT_PERMISSIONS,
    ).getAllAdminsAndSigners();
  }

  /*********************************
   * WRITE FUNCTIONS
   ********************************/

  /**
   * Grant an address admin access to the account.
   *
   * @remarks Grants an address admin access to the account. The admin will have complete authority over the account.
   *
   * @param signer - The address to be granted admin access to the account.
   *
   * @example
   * ```javascript
   * const tx = await contract.account.grantAdminAccess(signer);
   * const receipt = tx.receipt();
   * ```
   *
   * @twfeature AccountPermissions
   */
  grantAdminPermissions = /* @__PURE__ */ buildTransactionFunction(
    async (signerAddress: AddressOrEns) => {
      return assertEnabled(
        this.accountPermissions,
        FEATURE_ACCOUNT_PERMISSIONS,
      ).grantAdminPermissions.prepare(signerAddress);
    },
  );

  /**
   * Revoke an address' admin access to the account.
   *
   * @remarks Revokes an address' admin access to the account.
   *
   * @param signer - The address of an admin of the account.
   *
   * @example
   * ```javascript
   * const tx = await contract.account.revokeAdminAccess(signer);
   * const receipt = tx.receipt();
   * ```
   *
   * @twfeature AccountPermissions
   */
  revokeAdminPermissions = /* @__PURE__ */ buildTransactionFunction(
    async (signerAddress: AddressOrEns) => {
      return assertEnabled(
        this.accountPermissions,
        FEATURE_ACCOUNT_PERMISSIONS,
      ).revokeAdminPermissions.prepare(signerAddress);
    },
  );

  /**
   * Grant a signer permissions to use the account.
   *
   * @remarks Grants a signer permissions to use the account.
   *
   * @param signer - The signer to be granted permissions to use the account.
   * @param permissions - The permissions to be applied to the signer's use of the account.
   *
   * @example
   * ```javascript
   * const tx = await contract.account.grantPermissions(signer, permissions);
   * const receipt = tx.receipt();
   * ```
   *
   * @twfeature AccountPermissions
   */
  grantPermissions = /* @__PURE__ */ buildTransactionFunction(
    async (
      signerAddress: AddressOrEns,
      permissions: SignerPermissionsInput,
    ) => {
      return assertEnabled(
        this.accountPermissions,
        FEATURE_ACCOUNT_PERMISSIONS,
      ).grantPermissions.prepare(signerAddress, permissions);
    },
  );

  /**
   * Update the permissions of a signer for using the account.
   *
   * @remarks Updates the permissions of a signer for using the account.
   *
   * @param signer - The signer whose permissions to use the account are to be updated.
   * @param permissions - The permissions to be applied to the signer's use of the account.
   *
   * @example
   * ```javascript
   * const tx = await contract.account.updateAccess(signer, restrictions);
   * const receipt = tx.receipt();
   * ```
   *
   * @twfeature AccountPermissions
   */
  updatePermissions = /* @__PURE__ */ buildTransactionFunction(
    async (
      signerAddress: AddressOrEns,
      permissions: SignerPermissionsInput,
    ) => {
      return assertEnabled(
        this.accountPermissions,
        FEATURE_ACCOUNT_PERMISSIONS,
      ).updatePermissions.prepare(signerAddress, permissions);
    },
  );

  /**
   * Revoke a scoped access address to the account
   *
   * @remarks Revokes an address' access to the account.
   *
   * @param signer - The address whose access to the account is to be revoked.
   *
   * @example
   * ```javascript
   * const tx = await contract.account.revokeAccess(signer);
   * const receipt = tx.receipt();
   * ```
   *
   * @twfeature AccountPermissions
   */
  revokeAccess = /* @__PURE__ */ buildTransactionFunction(
    async (signerAddress: AddressOrEns) => {
      return assertEnabled(
        this.accountPermissions,
        FEATURE_ACCOUNT_PERMISSIONS,
      ).revokeAccess.prepare(signerAddress);
    },
  );

  /**
   * Approve an address as a call target for a given signer on the account
   *
   * @remarks Approves an address as a call target for a given signer on the account.
   *
   * @param signer - A signer with restricted access to the account.
   * @param target - The address to approve as a call target for the signer.
   *
   * @example
   * ```javascript
   * const tx = await contract.account.approveTargetForSigner(signer, target);
   * const receipt = tx.receipt();
   * ```
   *
   * @twfeature AccountPermissions
   */
  approveTargetForSigner = /* @__PURE__ */ buildTransactionFunction(
    async (signerAddress: AddressOrEns, target: AddressOrEns) => {
      return assertEnabled(
        this.accountPermissions,
        FEATURE_ACCOUNT_PERMISSIONS,
      ).approveTargetForSigner.prepare(signerAddress, target);
    },
  );

  /**
   * Disapprove an address as a call target for a given signer on the account
   *
   * @remarks Disapprove an address as a call target for a given signer on the account.
   *
   * @param signer - A signer with restricted access to the account.
   * @param target - The address to disapprove as a call target for the signer.
   *
   * @example
   * ```javascript
   * const tx = await contract.account.disapproveTargetForSigner(signer, target);
   * const receipt = tx.receipt();
   * ```
   *
   * @twfeature AccountPermissions
   */
  disapproveTargetForSigner = /* @__PURE__ */ buildTransactionFunction(
    async (signerAddress: AddressOrEns, target: AddressOrEns) => {
      return assertEnabled(
        this.accountPermissions,
        FEATURE_ACCOUNT_PERMISSIONS,
      ).disapproveTargetForSigner.prepare(signerAddress, target);
    },
  );

  /**
   * Set the account's entire snapshot of permissions.
   *
   * @remarks Sets the account's entire snapshot of permissions.
   *
   * @param permissionSnapshot - the snapshot to set as the account's entire permission snapshot.
   *
   * @example
   * ```javascript
   * const tx = await contract.account.setAccess(permissionSnapshot);
   * const receipt = tx.receipt();
   * ```
   *
   * @twfeature AccountPermissions
   */
  resetAllPermissions = /* @__PURE__ */ buildTransactionFunction(
    async (permissionSnapshot: PermissionSnapshotInput) => {
      return assertEnabled(
        this.accountPermissions,
        FEATURE_ACCOUNT_PERMISSIONS,
      ).resetAllPermissions.prepare(permissionSnapshot);
    },
  );
}
