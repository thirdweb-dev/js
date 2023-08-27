import { BigNumber, utils } from "ethers";
import { FEATURE_ACCOUNT_PERMISSIONS } from "../../constants/thirdweb-features";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";

import type {
  IAccountCore,
  IAccountPermissions,
} from "@thirdweb-dev/contracts-js";
import invariant from "tiny-invariant";
import { resolveAddress } from "../../common";
import { resolveOrGenerateId } from "../../common/signature-minting";
import { buildTransactionFunction } from "../../common/transactions";
import { AddressOrEns } from "../../schema";
import {
  PermissionSnapshotInput,
  PermissionSnapshotOutput,
  PermissionSnapshotSchema,
  SignedSignerPermissionsPayload,
  SignerPermissionRequest,
  SignerPermissions,
  SignerPermissionsInput,
  SignerPermissionsOutput,
  SignerPermissionsSchema,
  SignerWithPermissions,
} from "../../types";

export class AccountPermissions implements DetectableFeature {
  featureName = FEATURE_ACCOUNT_PERMISSIONS.name;
  private contractWrapper: ContractWrapper<IAccountCore>;

  constructor(contractWrapper: ContractWrapper<IAccountCore>) {
    this.contractWrapper = contractWrapper;
  }

  getAddress(): string {
    return this.contractWrapper.readContract.address;
  }

  /*********************************
   * HELPER FUNCTIONS
   ********************************/

  private hasDuplicateSigners(snapshot: PermissionSnapshotOutput): boolean {
    const checkedSigner: Record<string, boolean> = {};

    const signers = snapshot.map((item) => item.signer);

    for (const signer of signers) {
      if (!checkedSigner[signer]) {
        checkedSigner[signer] = true;
      } else {
        return true;
      }
    }

    return false;
  }

  /**
   * Format the access restrictions for a given role
   *
   * @param restrictions - The access restrictions for a given role
   * @returns formatted role restrictions
   *
   */
  private parseSignerPermissionsStruct(
    permissions: IAccountPermissions.SignerPermissionsStruct,
  ): SignerPermissions {
    return {
      startDate: new Date(
        parseInt(permissions.startTimestamp.toString()) * 1000,
      ),
      expirationDate: new Date(
        parseInt(permissions.endTimestamp.toString()) * 1000,
      ),
      nativeTokenLimitPerTransaction: BigNumber.from(
        permissions.nativeTokenLimitPerTransaction,
      ),
      approvedCallTargets: permissions.approvedTargets,
    };
  }

  private async sendSignerPermissionRequest(
    signerAddress: string,
    permissions: SignerPermissionsOutput,
  ): Promise<Transaction> {
    const { payload, signature } = await this.generatePayload(
      signerAddress,
      permissions,
    );

    const [success] = await this.contractWrapper.read(
      "verifySignerPermissionRequest",
      [payload, signature],
    );

    if (!success) {
      throw new Error(`Invalid signature.`);
    }

    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "setPermissionsForSigner",
      args: [payload, signature],
    });
  }

  private async buildSignerPermissionRequest(
    signerAddress: string,
    permissions: SignerPermissionsOutput,
  ): Promise<string> {
    const { payload, signature } = await this.generatePayload(
      signerAddress,
      permissions,
    );

    const isValidSigner =
      await this.contractWrapper.readContract.verifySignerPermissionRequest(
        payload,
        signature,
      );
    if (!isValidSigner) {
      throw new Error(`Invalid signature.`);
    }

    return this.contractWrapper.writeContract.interface.encodeFunctionData(
      "setPermissionsForSigner",
      [payload, signature],
    );
  }

  /**
   * Generate and sign a payload to grant or revoke a signer's access to the account.
   *
   * @param signer - The address of the signer
   * @param roleAction - The address of the signer
   * @returns The generated payload and signature produced on signing that payload.
   *
   */
  private async generatePayload(
    signerAddress: string,
    permissions: SignerPermissionsOutput,
  ): Promise<SignedSignerPermissionsPayload> {
    // Get payload struct.
    const payload: IAccountPermissions.SignerPermissionRequestStruct = {
      signer: signerAddress,
      approvedTargets: permissions.approvedCallTargets,
      nativeTokenLimitPerTransaction: utils.parseEther(
        permissions.nativeTokenLimitPerTransaction,
      ),
      permissionStartTimestamp: permissions.startDate,
      permissionEndTimestamp: permissions.expirationDate,
      reqValidityStartTimestamp: 0,
      // Req validity ends 10 years from now.
      reqValidityEndTimestamp: BigNumber.from(
        Math.floor(
          new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10).getTime() /
            1000,
        ),
      ),
      uid: resolveOrGenerateId(undefined),
    };

    // Generate signature
    const chainId = await this.contractWrapper.getChainID();
    const connectedSigner = this.contractWrapper.getSigner();
    invariant(connectedSigner, "No signer available");

    const signature = await this.contractWrapper.signTypedData(
      connectedSigner,
      {
        name: "Account",
        version: "1",
        chainId,
        verifyingContract: this.getAddress(),
      },
      { SignerPermissionRequest },
      payload,
    );

    return { payload, signature };
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
    const resolvedSignerAddress = await resolveAddress(signerAddress);
    return await this.contractWrapper.readContract.isAdmin(
      resolvedSignerAddress,
    );
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
    const resolvedSignerAddress = await resolveAddress(signerAddress);
    return await this.contractWrapper.readContract.isActiveSigner(
      resolvedSignerAddress,
    );
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
    return await this.contractWrapper.readContract.getAllAdmins();
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
    const activeSignersWithPerms: IAccountPermissions.SignerPermissionsStruct[] =
      await this.contractWrapper.readContract.getAllActiveSigners();

    return await Promise.all(
      activeSignersWithPerms.map(async (signerWithPermissions) => {
        const signer = signerWithPermissions.signer;
        const permissions = this.parseSignerPermissionsStruct(
          signerWithPermissions,
        );
        return { signer, permissions };
      }),
    );
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
    const allAdmins = await this.getAllAdmins();
    const transformedAdmins: SignerWithPermissions[] = allAdmins.map(
      (admin) => {
        return {
          isAdmin: true,
          signer: admin,
          permissions: {
            startDate: new Date(0),
            expirationDate: new Date(0),
            nativeTokenLimitPerTransaction: BigNumber.from(0),
            approvedCallTargets: [],
          },
        };
      },
    );
    const allSigners = await this.getAllSigners();

    return [...transformedAdmins, ...allSigners];
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
    async (signerAddress: AddressOrEns): Promise<Transaction> => {
      const resolvedSignerAddress = await resolveAddress(signerAddress);
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setAdmin",
        args: [resolvedSignerAddress, true],
      });
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
    async (signerAddress: AddressOrEns): Promise<Transaction> => {
      const resolvedSignerAddress = await resolveAddress(signerAddress);
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setAdmin",
        args: [resolvedSignerAddress, false],
      });
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
    ): Promise<Transaction> => {
      const resolvedSignerAddress = await resolveAddress(signerAddress);
      const resolvedPermissions = await SignerPermissionsSchema.parseAsync(
        permissions,
      );

      if (await this.isAdmin(resolvedSignerAddress)) {
        throw new Error(
          "Signer is already an admin. Cannot grant permissions to an existing admin.",
        );
      }

      if (await this.isSigner(resolvedSignerAddress)) {
        throw new Error(
          "Signer already has permissions. Cannot grant permissions to an existing signer. You can update permissions using `updatePermissions`.",
        );
      }

      return await this.sendSignerPermissionRequest(
        resolvedSignerAddress,
        resolvedPermissions,
      );
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
    ): Promise<Transaction> => {
      const resolvedSignerAddress = await resolveAddress(signerAddress);
      const resolvedPermissions = await SignerPermissionsSchema.parseAsync(
        permissions,
      );

      if (await this.isAdmin(resolvedSignerAddress)) {
        throw new Error(
          "Signer is already an admin. Cannot update permissions of an existing admin.",
        );
      }

      if (!(await this.isSigner(resolvedSignerAddress))) {
        throw new Error(
          "Signer does not already have permissions. You can grant permissions using `grantPermissions`.",
        );
      }

      return await this.sendSignerPermissionRequest(
        resolvedSignerAddress,
        resolvedPermissions,
      );
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
    async (signerAddress: AddressOrEns): Promise<Transaction> => {
      const resolvedSignerAddress = await resolveAddress(signerAddress);

      if (await this.isAdmin(resolvedSignerAddress)) {
        throw new Error(
          "Signer is already an admin. Cannot revoke permissions of an admin.",
        );
      }

      if (!(await this.isSigner(resolvedSignerAddress))) {
        throw new Error(
          "Signer does not already have permissions. You can grant permissions using `grantPermissions`.",
        );
      }

      return await this.sendSignerPermissionRequest(resolvedSignerAddress, {
        startDate: BigNumber.from(0),
        expirationDate: BigNumber.from(0),
        approvedCallTargets: [],
        nativeTokenLimitPerTransaction: "0",
      });
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
    async (
      signerAddress: AddressOrEns,
      target: AddressOrEns,
    ): Promise<Transaction> => {
      const resolvedSignerAddress = await resolveAddress(signerAddress);
      const resolvedTarget = await resolveAddress(target);

      if (await this.isAdmin(resolvedSignerAddress)) {
        throw new Error(
          "Signer is already an admin. Cannot approve targets for an admin.",
        );
      }

      if (!(await this.isSigner(resolvedSignerAddress))) {
        throw new Error(
          "Signer does not already have permissions. You can grant permissions using `grantPermissions`.",
        );
      }

      const permissions: IAccountPermissions.SignerPermissionsStruct =
        await this.contractWrapper.readContract.getPermissionsForSigner(
          resolvedSignerAddress,
        );

      if (permissions.approvedTargets.includes(target)) {
        throw new Error("Target is already approved");
      }

      const newTargets = [...permissions.approvedTargets, resolvedTarget];

      return await this.sendSignerPermissionRequest(resolvedSignerAddress, {
        startDate: BigNumber.from(permissions.startTimestamp),
        expirationDate: BigNumber.from(permissions.endTimestamp),
        approvedCallTargets: newTargets,
        nativeTokenLimitPerTransaction:
          permissions.nativeTokenLimitPerTransaction.toString(),
      });
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
    async (
      signerAddress: AddressOrEns,
      target: AddressOrEns,
    ): Promise<Transaction> => {
      const resolvedSignerAddress = await resolveAddress(signerAddress);
      const resolvedTarget = await resolveAddress(target);

      if (await this.isAdmin(resolvedSignerAddress)) {
        throw new Error(
          "Signer is already an admin. Cannot approve targets for an admin.",
        );
      }

      if (!(await this.isSigner(resolvedSignerAddress))) {
        throw new Error(
          "Signer does not already have permissions. You can grant permissions using `grantPermissions`.",
        );
      }

      const permissions: IAccountPermissions.SignerPermissionsStruct =
        await this.contractWrapper.readContract.getPermissionsForSigner(
          resolvedSignerAddress,
        );

      if (!permissions.approvedTargets.includes(resolvedTarget)) {
        throw new Error("Target is currently not approved");
      }

      const newTargets = permissions.approvedTargets.filter(
        (approvedTarget) =>
          utils.getAddress(approvedTarget) !== utils.getAddress(resolvedTarget),
      );

      return await this.sendSignerPermissionRequest(resolvedSignerAddress, {
        startDate: BigNumber.from(permissions.startTimestamp),
        expirationDate: BigNumber.from(permissions.endTimestamp),
        approvedCallTargets: newTargets,
        nativeTokenLimitPerTransaction:
          permissions.nativeTokenLimitPerTransaction.toString(),
      });
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
    async (
      permissionSnapshot: PermissionSnapshotInput,
    ): Promise<Transaction> => {
      const resolvedSnapshot = await PermissionSnapshotSchema.parseAsync(
        permissionSnapshot,
      );

      /**
       * All cases
       *
       * - Add new admin :check:
       * - Remove current admin :check:
       * - Add new scoped :check:
       * - Remove current scoped :check:
       * - Update current scoped :check:
       * - Current admin -> new scoped :check:
       * - Current scoped -> new admin :check:
       **/

      // No duplicate signers in input!
      if (this.hasDuplicateSigners(resolvedSnapshot)) {
        throw new Error("Duplicate signers found in input.");
      }

      const addAdminData: string[] = [];
      const removeAdminData: string[] = [];
      const addOrUpdateSignerData: string[] = [];
      const removeSignerData: string[] = [];

      // Remove all existing admins not included in the passed snapshot.
      const allAdmins = await this.getAllAdmins();
      const allToMakeAdmin = resolvedSnapshot
        .filter((item) => item.makeAdmin)
        .map((item) => item.signer);
      allAdmins.forEach((admin) => {
        if (!allToMakeAdmin.includes(admin)) {
          removeAdminData.push(
            this.contractWrapper.writeContract.interface.encodeFunctionData(
              "setAdmin",
              [admin, false],
            ),
          );
        }
      });

      // Remove all existing signers not included in the passed snapshot.
      const allSigners = await this.getAllSigners();
      const allToMakeSigners = resolvedSnapshot
        .filter((item) => {
          return !item.makeAdmin;
        })
        .map((item) => item.signer);
      await Promise.all(
        allSigners.map(async (item) => {
          if (!allToMakeSigners.includes(item.signer)) {
            const data = await this.buildSignerPermissionRequest(item.signer, {
              startDate: BigNumber.from(0),
              expirationDate: BigNumber.from(0),
              approvedCallTargets: [],
              nativeTokenLimitPerTransaction: "0",
            });

            removeSignerData.push(data);
          }
        }),
      );

      for (const member of resolvedSnapshot) {
        // Add new admin
        if (member.makeAdmin) {
          addAdminData.push(
            this.contractWrapper.writeContract.interface.encodeFunctionData(
              "setAdmin",
              [member.signer, true],
            ),
          );
        } else {
          // Add new scoped
          const data = await this.buildSignerPermissionRequest(
            member.signer,
            member.permissions,
          );
          addOrUpdateSignerData.push(data);
        }
      }

      const data: string[] = [];
      removeAdminData.forEach((item) => {
        data.push(item);
      });
      removeSignerData.forEach((item) => {
        data.push(item);
      });
      addOrUpdateSignerData.forEach((item) => {
        data.push(item);
      });

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "multicall",
        args: [data],
      });
    },
  );
}
