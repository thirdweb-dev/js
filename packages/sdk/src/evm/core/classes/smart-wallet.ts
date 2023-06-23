import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import { FEATURE_SMART_WALLET } from "../../constants/thirdweb-features";
import { utils, BigNumber } from "ethers";
import { Transaction } from "./transactions";

import type {
  IAccountCore,
  IAccountFactory,
  IAccountPermissions,
} from "@thirdweb-dev/contracts-js";
import IAccountFactoryAbi from "@thirdweb-dev/contracts-js/dist/abis/IAccountFactory.json";
import {
  AccessRestrictions,
  RoleAction,
  RoleRequest,
  SignedAccountPermissionsPayload,
  SignerWithRestrictions,
  AccessRestrictionsInput,
  AccessRestrictionsSchema,
  SignerWithRestrictionsBatchInput,
} from "../../types";
import invariant from "tiny-invariant";
import { buildTransactionFunction } from "../../common/transactions";
import { resolveOrGenerateId } from "../../common/signature-minting";
import { AddressOrEns, RawDateSchema } from "../../schema";
import { resolveAddress } from "../../common";
import { Signer } from "ethers";

export class SmartWallet<TContract extends IAccountCore>
  implements DetectableFeature
{
  featureName = FEATURE_SMART_WALLET.name;
  private contractWrapper: ContractWrapper<IAccountCore>;

  private emptyRole: string =
    "0x0000000000000000000000000000000000000000000000000000000000000000";

  constructor(contractWrapper: ContractWrapper<TContract>) {
    this.contractWrapper = contractWrapper;
  }

  getAddress(): string {
    return this.contractWrapper.readContract.address;
  }

  /*********************************
   * HELPER FUNCTIONS
   ********************************/

  private hasDuplicateSigners(signers: SignerWithRestrictionsBatchInput): boolean {
    const encounteredSigners = new Set();
  
    return signers.map(item => item.signer).some(signer => {
      const isDuplicate = encounteredSigners.has(signer);
      encounteredSigners.add(signer);
      return isDuplicate;
    });
  }

  /**
   * Format the access restrictions for a given role
   *
   * @param restrictions - The access restrictions for a given role
   * @returns formatted role restrictions
   *
   */
  private parseRoleRestrictionsStruct(
    restrictions: IAccountPermissions.RoleRestrictionsStruct,
  ): AccessRestrictions {
    return {
      startDate: new Date(
        parseInt(restrictions.startTimestamp.toString()) * 1000,
      ),
      expirationDate: new Date(
        parseInt(restrictions.endTimestamp.toString()) * 1000,
      ),
      nativeTokenLimitPerTransaction: BigNumber.from(
        restrictions.maxValuePerTransaction,
      ),
      approvedCallTargets: restrictions.approvedTargets,
    };
  }

  /**
   * Generate and sign a payload to grant or revoke a signer's access to the smart wallet.
   *
   * @param signer - The address of the signer
   * @param roleAction - The address of the signer
   * @returns The generated payload and signature produced on signing that payload.
   *
   */
  private async generatePayload(
    signerAddress: string,
    roleAction: RoleAction,
  ): Promise<SignedAccountPermissionsPayload> {
    // Derive role for target signer.
    const role = utils.solidityKeccak256(["string"], [signerAddress]);

    // Get role request struct.
    const payload: IAccountPermissions.RoleRequestStruct = {
      role,
      target: signerAddress,
      action: roleAction,
      validityStartTimestamp: 0,
      validityEndTimestamp: BigNumber.from(
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
        verifyingContract: this.contractWrapper.readContract.address,
      },
      { RoleRequest },
      payload,
    );

    return { payload, signature };
  }

  /**
   * Get the factory contract which deployed the smart wallet
   *
   * @returns Returns the address of the factory
   *
   */
  private async getFactory(): Promise<ContractWrapper<IAccountFactory>> {
    // Get factory.
    const chainId = await this.contractWrapper.getChainID();
    const factoryAddress = await this.getFactoryAddress();
    const wrapper = new ContractWrapper<IAccountFactory>(
      chainId,
      factoryAddress,
      IAccountFactoryAbi,
      this.contractWrapper.options,
    );
    wrapper.updateSignerOrProvider(this.contractWrapper.getSigner() as Signer);
    return wrapper;
  }

  /*********************************
   * READ FUNCTIONS
   ********************************/

  /**
   * Get whether a signer is an admin on the smart wallet.
   *
   * @example
   * ```javascript
   * const isAdmin = await contract.smartWallet.isAdmin(signer);
   * ```
   * @param signer - The address of a signer of the smart wallet.
   * @returns whether a signer is an admin on the smart wallet.
   *
   * @twfeature SmartWallet
   */
  public async isAdmin(signerAddress: AddressOrEns): Promise<boolean> {
    const resolvedSignerAddress = await resolveAddress(signerAddress);
    return await this.contractWrapper.readContract.isAdmin(
      resolvedSignerAddress,
    );
  }

  /**
   * Get the restrictions under which a given signer can use the smart wallet.
   *
   * @example
   * ```javascript
   * const restrictionsForSigner = await contract.smartWallet.getAccessRestrictions(signer);
   * ```
   * @param signer - The address of a signer of the smart wallet.
   * @returns the restrictions under which a given signer can use the smart wallet.
   *
   * @twfeature SmartWallet
   */
  public async getAccessRestrictions(
    signerAddress: AddressOrEns,
  ): Promise<AccessRestrictions> {
    const resolvedSignerAddress = await resolveAddress(signerAddress);
    const roleRestrictions: IAccountPermissions.RoleRestrictionsStruct =
      await this.contractWrapper.readContract.getRoleRestrictionsForAccount(
        resolvedSignerAddress,
      );
    return this.parseRoleRestrictionsStruct(roleRestrictions);
  }

  /**
   * Get the address of the EIP-4337 factory contract which deployed the smart wallet
   *
   * @example
   * ```javascript
   * const factoryAddress = await contract.smartWallet.getFactoryAddress();
   * ```
   * @returns the address of the factory which deployed the smart wallet.
   *
   * @twfeature SmartWallet
   */
  public async getFactoryAddress(): Promise<string> {
    return this.contractWrapper.readContract.factory();
  }

  /**
   * Get all signers (admin or non-admin) of the smart wallet, along with their access restrictions.
   *
   * @example
   * ```javascript
   * const allSigners = await contract.smartWallet.getSignersWithRestrictions();
   * ```
   * @returns all signers (admin or non-admin) of the smart wallet, along with their access restrictions.
   *
   * @twfeature SmartWallet
   */
  public async getSignersWithRestrictions(): Promise<SignerWithRestrictions[]> {
    // Get all associated signers.
    const contract = await this.getFactory();
    const signers: string[] = await contract.readContract.getSignersOfAccount(this.getAddress());

    return await Promise.all(
      signers.map(async (signer) => {
        const isAdmin = await this.contractWrapper.readContract.isAdmin(signer);
        const restrictions = await this.getAccessRestrictions(signer);
        return { signer, isAdmin, restrictions };
      }),
    );
  }

  /*********************************
   * WRITE FUNCTIONS
   ********************************/

  /**
   * Grant an address admin access to the smart wallet.
   *
   * @remarks Grants an address admin access to the smart wallet. The admin will have complete authority over the smart wallet.
   *
   * @param signer - The address to be granted admin access to the smart wallet.
   *
   * @example
   * ```javascript
   * const tx = await contract.smartWallet.grantAdminAccess(signer);
   * const receipt = tx.receipt();
   * ```
   *
   * @twfeature SmartWallet
   */
  grantAdminAccess = /* @__PURE__ */ buildTransactionFunction(
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
   * Revoke an address' admin access to the smart wallet.
   *
   * @remarks Revokes an address' admin access to the smart wallet.
   *
   * @param signer - The address of an admin of the smart wallet.
   *
   * @example
   * ```javascript
   * const tx = await contract.smartWallet.revokeAdminAccess(signer);
   * const receipt = tx.receipt();
   * ```
   *
   * @twfeature SmartWallet
   */
  revokeAdminAccess = /* @__PURE__ */ buildTransactionFunction(
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
   * Grant an address access to the smart wallet with certain restrictions.
   *
   * @remarks Grants an address access to the smart wallet with certain restrictions.
   *
   * @param signer - The address to be granted access to the smart wallet.
   * @param restrictions - The restrictions to be applied to the signer's use of the smart wallet.
   *
   * @example
   * ```javascript
   * const tx = await contract.smartWallet.grantAccess(signer, restrictions);
   * const receipt = tx.receipt();
   * ```
   *
   * @twfeature SmartWallet
   */
  grantAccess = /* @__PURE__ */ buildTransactionFunction(
    async (
      signerAddress: AddressOrEns,
      restrictions: AccessRestrictionsInput,
    ): Promise<Transaction> => {
      const resolvedSignerAddress = await resolveAddress(signerAddress);

      const currentRole = (
        await this.contractWrapper.readContract.getRoleRestrictionsForAccount(
          resolvedSignerAddress,
        )
      ).role;
      if (currentRole !== this.emptyRole) {
        throw new Error("Signer already has access");
      }
      const parsedRestrictions = await AccessRestrictionsSchema.parseAsync(
        restrictions,
      );

      // Performing a multicall: [1] setting restrictions for role, [2] granting role to signer.
      const encoded: string[] = [];

      // ===== Preparing [1] `setRoleRestrictions` =====

      // Derive role for target signer.
      const role = utils.solidityKeccak256(["string"], [resolvedSignerAddress]);

      // Get role restrictions struct.
      const roleRestrictions: IAccountPermissions.RoleRestrictionsStruct = {
        role,
        approvedTargets: parsedRestrictions.approvedCallTargets,
        maxValuePerTransaction:
          parsedRestrictions.nativeTokenLimitPerTransaction,
        startTimestamp: parsedRestrictions.startDate,
        endTimestamp: parsedRestrictions.expirationDate,
      };

      encoded.push(
        this.contractWrapper.readContract.interface.encodeFunctionData(
          "setRoleRestrictions",
          [roleRestrictions],
        ),
      );

      // ===== Preparing [2] `changeRole` =====

      const { payload, signature } = await this.generatePayload(
        resolvedSignerAddress,
        RoleAction.GRANT,
      );

      const isValidSigner =
        await this.contractWrapper.readContract.verifyRoleRequest(
          payload,
          signature,
        );
      if (!isValidSigner) {
        throw new Error(`Invalid signature.`);
      }

      encoded.push(
        this.contractWrapper.readContract.interface.encodeFunctionData(
          "changeRole",
          [payload, signature],
        ),
      );

      // Perform multicall
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "multicall",
        args: [encoded],
      });
    },
  );

  /**
   * Approve an address as a call target for a given signer on the smart wallet.
   *
   * @remarks Approves an address as a call target for a given signer on the smart wallet.
   *
   * @param signer - A signer with restricted access to the smart wallet.
   * @param target - The address to approve as a call target for the signer.
   *
   * @example
   * ```javascript
   * const tx = await contract.smartWallet.approveTargetForSigner(signer, target);
   * const receipt = tx.receipt();
   * ```
   *
   * @twfeature SmartWallet
   */
  approveTargetForSigner = /* @__PURE__ */ buildTransactionFunction(
    async (
      signerAddress: AddressOrEns,
      target: string,
    ): Promise<Transaction> => {
      const resolvedSignerAddress = await resolveAddress(signerAddress);
      const restrictionsForSigner: IAccountPermissions.RoleRestrictionsStruct =
        await this.contractWrapper.readContract.getRoleRestrictionsForAccount(
          resolvedSignerAddress,
        );

      if (restrictionsForSigner.role === this.emptyRole) {
        throw new Error("Signer does not have any access");
      }

      if (restrictionsForSigner.approvedTargets.includes(target)) {
        throw new Error("Target is already approved");
      }

      const newTargets = [...restrictionsForSigner.approvedTargets, target];

      const newRestrictions: IAccountPermissions.RoleRestrictionsStruct = {
        ...restrictionsForSigner,
        approvedTargets: newTargets,
      };
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setRoleRestrictions",
        args: [newRestrictions],
      });
    },
  );

  /**
   * Disapprove an address as a call target for a given signer on the smart wallet.
   *
   * @remarks Disapprove an address as a call target for a given signer on the smart wallet.
   *
   * @param signer - A signer with restricted access to the smart wallet.
   * @param target - The address to disapprove as a call target for the signer.
   *
   * @example
   * ```javascript
   * const tx = await contract.smartWallet.disapproveTargetForSigner(signer, target);
   * const receipt = tx.receipt();
   * ```
   *
   * @twfeature SmartWallet
   */
  disapproveTargetForSigner = /* @__PURE__ */ buildTransactionFunction(
    async (
      signerAddress: AddressOrEns,
      target: string,
    ): Promise<Transaction> => {
      const resolvedSignerAddress = await resolveAddress(signerAddress);
      const restrictionsForSigner: IAccountPermissions.RoleRestrictionsStruct =
        await this.contractWrapper.readContract.getRoleRestrictionsForAccount(
          resolvedSignerAddress,
        );

      if (restrictionsForSigner.role === this.emptyRole) {
        throw new Error("Signer does not have any access");
      }

      if (!restrictionsForSigner.approvedTargets.includes(target)) {
        throw new Error("Target is not already approved");
      }

      const newTargets = restrictionsForSigner.approvedTargets.filter(
        (approvedTarget) =>
          utils.getAddress(approvedTarget) !== utils.getAddress(target),
      );

      const newRestrictions: IAccountPermissions.RoleRestrictionsStruct = {
        ...restrictionsForSigner,
        approvedTargets: newTargets,
      };
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setRoleRestrictions",
        args: [newRestrictions],
      });
    },
  );

  /**
   * Update an address' access to the smart wallet.
   *
   * @remarks Updates an address' access to the smart wallet.
   *
   * @param signer - The address whose access to the smart wallet is to be updated.
   * @param restrictions - The restrictions to be applied to the signer's use of the smart wallet.
   *
   * @example
   * ```javascript
   * const tx = await contract.smartWallet.updateAccess(signer, restrictions);
   * const receipt = tx.receipt();
   * ```
   *
   * @twfeature SmartWallet
   */
  updateAccess = /* @__PURE__ */ buildTransactionFunction(
    async (
      signerAddress: AddressOrEns,
      restrictions: AccessRestrictionsInput,
    ): Promise<Transaction> => {
      const resolvedSignerAddress = await resolveAddress(signerAddress);

      const currentRole = (
        await this.contractWrapper.readContract.getRoleRestrictionsForAccount(
          resolvedSignerAddress,
        )
      ).role;
      if (currentRole === this.emptyRole) {
        throw new Error("Signer does not have any access");
      }
      const parsedRestrictions = await AccessRestrictionsSchema.parseAsync(
        restrictions,
      );

      // Get role restrictions struct.
      const roleRestrictions: IAccountPermissions.RoleRestrictionsStruct = {
        role: currentRole,
        approvedTargets: parsedRestrictions.approvedCallTargets,
        maxValuePerTransaction:
          parsedRestrictions.nativeTokenLimitPerTransaction,
        startTimestamp: parsedRestrictions.startDate,
        endTimestamp: parsedRestrictions.expirationDate,
      };

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setRoleRestrictions",
        args: [roleRestrictions],
      });
    },
  );

  /**
   * Revoke an address' access to the smart wallet.
   *
   * @remarks Revokes an address' access to the smart wallet.
   *
   * @param signer - The address whose access to the smart wallet is to be revoked.
   *
   * @example
   * ```javascript
   * const tx = await contract.smartWallet.revokeAccess(signer);
   * const receipt = tx.receipt();
   * ```
   *
   * @twfeature SmartWallet
   */
  revokeAccess = /* @__PURE__ */ buildTransactionFunction(
    async (signerAddress: AddressOrEns): Promise<Transaction> => {
      const resolvedSignerAddress = await resolveAddress(signerAddress);

      const currentRole = (
        await this.contractWrapper.readContract.getRoleRestrictionsForAccount(
          resolvedSignerAddress,
        )
      ).role;
      if (currentRole === this.emptyRole) {
        throw new Error("Signer does not have any access");
      }

      const { payload, signature } = await this.generatePayload(
        resolvedSignerAddress,
        RoleAction.REVOKE,
      );

      const isValidSigner =
        await this.contractWrapper.readContract.verifyRoleRequest(
          payload,
          signature,
        );
      if (!isValidSigner) {
        throw new Error(`Invalid signature.`);
      }

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "changeRole",
        args: [payload, signature],
      });
    },
  );

  /**
   * Set the wallet's entire snapshot of permissions.
   *
   * @remarks Sets the wallet's entire snapshot of permissions.
   *
   * @param permissionsSnapshot - the snapshot to set as the wallet's entire permission snapshot.
   *
   * @example
   * ```javascript
   * const tx = await contract.smartWallet.setAccess(permissionsSnapshot);
   * const receipt = tx.receipt();
   * ```
   *
   * @twfeature SmartWallet
   */
  setAccess = /* @__PURE__ */ buildTransactionFunction(
    async (permissionsSnapshot: SignerWithRestrictionsBatchInput): Promise<Transaction> => {

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
      if(this.hasDuplicateSigners(permissionsSnapshot)) {
        throw new Error("Duplicate signers found in input.")
      }

      const currentPermissionsSnapshot = await this.getSignersWithRestrictions();

      // Performing a multicall.
      const encoded: string[] = [];

      // First make all calls related to admin access.
      const allCurrentAdmins = currentPermissionsSnapshot.filter((result) => result.isAdmin).map((result) => result.signer);
      const allNewAdmins = permissionsSnapshot.filter((result) => result.isAdmin).map((result) => result.signer);

      // All remove-admin actions.
      for(const currentAdmin of allCurrentAdmins) {
        if(!allNewAdmins.includes(currentAdmin)) {
          encoded.push(
            this.contractWrapper.readContract.interface.encodeFunctionData(
              "setAdmin",
              [currentAdmin, false],
            ),
          )
        }
      }

      // All add-admin actions.
      const toRemoveAsScoped: Record<string, string> = {};
      for(const newAdmin of allNewAdmins) {
        if(!allCurrentAdmins.includes(newAdmin)) {

          const data = this.contractWrapper.readContract.interface.encodeFunctionData(
            "setAdmin",
            [newAdmin, true],
          );
          

          // If the new admin is already a scoped account, we need to remove them as a scoped account first.
          const currentRole = (await this.contractWrapper.readContract.getRoleRestrictionsForAccount(newAdmin)).role;
          if(currentRole === this.emptyRole) {
            encoded.push(
              data,
            )
          } else {
            toRemoveAsScoped[newAdmin] = data;
          }
        }
      }

      // All scoped actions.
      const allCurrentScoped = currentPermissionsSnapshot.filter((result) => !result.isAdmin).map((result) => result.signer);
      const allNewScoped = permissionsSnapshot.filter((result) => !result.isAdmin).map((result) => result.signer);

      // All remove-scoped actions.
      const newAdminsToRemoveAsScoped = Object.keys(toRemoveAsScoped);
      for(const currentScoped of allCurrentScoped) {
        if(!allNewScoped.includes(currentScoped)) {

          const { payload, signature } = await this.generatePayload(
            currentScoped,
            RoleAction.REVOKE,
          );

          encoded.push(
            this.contractWrapper.readContract.interface.encodeFunctionData(
              "changeRole",
              [payload, signature],
            ),
          )

          if(newAdminsToRemoveAsScoped.includes(currentScoped)) {
            encoded.push(
              toRemoveAsScoped[currentScoped],
            )
          }
        }
      }

      // All add-scoped actions.
      for(const newScoped of allNewScoped) {
        if(!allCurrentScoped.includes(newScoped)) {

          // Derive role for target signer.
          const role = utils.solidityKeccak256(["string"], [newScoped]);
          
          const parsedRestrictions = await AccessRestrictionsSchema.parseAsync(
            permissionsSnapshot.find((result) => result.signer === newScoped)?.restrictions
          );

          // Get role restrictions struct.
          const roleRestrictions: IAccountPermissions.RoleRestrictionsStruct = {
            role,
            approvedTargets: parsedRestrictions.approvedCallTargets,
            maxValuePerTransaction:
            parsedRestrictions.nativeTokenLimitPerTransaction,
            startTimestamp: parsedRestrictions.startDate,
            endTimestamp: parsedRestrictions.expirationDate,
          };

          encoded.push(
            this.contractWrapper.readContract.interface.encodeFunctionData(
              "setRoleRestrictions",
              [roleRestrictions],
            ),
          );

          const { payload, signature } = await this.generatePayload(
            newScoped,
            RoleAction.GRANT,
          );

          encoded.push(
            this.contractWrapper.readContract.interface.encodeFunctionData(
              "changeRole",
              [payload, signature],
            ),
          )
        }
      }

      // All update-scoped actions.
      for(const currentScoped of allCurrentScoped) {
        if(allNewScoped.includes(currentScoped)) {
          // Derive role for target signer.
          const role = utils.solidityKeccak256(["string"], [currentScoped]);
          
          const parsedRestrictions = await AccessRestrictionsSchema.parseAsync(
            permissionsSnapshot.find((result) => result.signer === currentScoped)?.restrictions
          );

          // Get role restrictions struct.
          const roleRestrictions: IAccountPermissions.RoleRestrictionsStruct = {
            role,
            approvedTargets: parsedRestrictions.approvedCallTargets,
            maxValuePerTransaction:
            parsedRestrictions.nativeTokenLimitPerTransaction,
            startTimestamp: parsedRestrictions.startDate,
            endTimestamp: parsedRestrictions.expirationDate,
          };

          encoded.push(
            this.contractWrapper.readContract.interface.encodeFunctionData(
              "setRoleRestrictions",
              [roleRestrictions],
            ),
          );
        }
      }

      // Perform multicall
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "multicall",
        args: [encoded],
      });
    }
  )
}
