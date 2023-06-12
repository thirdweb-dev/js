import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import { FEATURE_SMART_WALLET } from "../../constants/thirdweb-features";
import { ethers, BigNumber } from "ethers";
import { Transaction } from "./transactions";

import type {
  IAccountCore, IAccountFactory, IAccountPermissions,
} from "@thirdweb-dev/contracts-js";
import IAccountFactoryAbi from "@thirdweb-dev/contracts-js/dist/abis/IAccountFactory.json";
import { AccessRestrictions, RoleAction, RoleRequest, SignedAccountPermissionsPayload, SignerWithRestrictions } from "../../types";
import { randomUUID } from "crypto";
import invariant from "tiny-invariant";
import { buildTransactionFunction } from "../../common/transactions";
import { SmartWalletFactory } from "./smart-wallet-factory";

export class SmartWallet<TContract extends IAccountCore> implements DetectableFeature {
    
  featureName = FEATURE_SMART_WALLET.name;
  private contractWrapper: ContractWrapper<IAccountCore>;

  constructor(contractWrapper: ContractWrapper<TContract>) {
    this.contractWrapper = contractWrapper;
  }

  getAddress(): string {
    return this.contractWrapper.readContract.address;
  }

  /*********************************
   * HELPER FUNCTIONS
  ********************************/

  private parseRoleRestrictionsStruct(restrictions: IAccountPermissions.RoleRestrictionsStruct): AccessRestrictions {
    return {
      startDate: new Date(parseInt((restrictions.startTimestamp).toString()) * 1000),
      expirationDate: new Date(parseInt((restrictions.endTimestamp).toString()) * 1000),
      nativeTokenLimitPerTransaction: BigNumber.from(restrictions.maxValuePerTransaction),
      approvedCallTargets: restrictions.approvedTargets,
    }
  }

  private async generatePayload(signer: string, roleAction: RoleAction): Promise<SignedAccountPermissionsPayload> {
    // Derive role for target signer.
    const role = ethers.utils.solidityKeccak256(["string"], [signer]);

    // Get role request struct.
    const payload: IAccountPermissions.RoleRequestStruct = {
      role,
      target: signer,
      action: roleAction,
      validityStartTimestamp: 0,
      validityEndTimestamp: BigNumber.from(
        Math.floor(
          (new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10)).getTime() / 1000
        )
      ),
      uid: ethers.utils.solidityKeccak256(["string"], [randomUUID()]),
    }

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
      payload
    );

    return { payload, signature };
  }

  private async getFactory(): Promise<SmartWalletFactory<IAccountFactory>> {
    // Get factory.
    const chainId = await this.contractWrapper.getChainID();
    const factoryAddress = await this.getFactoryAddress();
    const wrapper =  new ContractWrapper<IAccountFactory>(chainId, factoryAddress, IAccountFactoryAbi, this.contractWrapper.options);
    return new SmartWalletFactory(wrapper);
  }

  /*********************************
   * READ FUNCTIONS
  ********************************/

  // TODO: documentation
  public async getAccessRestrictions(signer: string): Promise<AccessRestrictions> {
    const roleRestrictions: IAccountPermissions.RoleRestrictionsStruct = await this.contractWrapper.readContract.getRoleRestrictionsForAccount(signer);
    return this.parseRoleRestrictionsStruct(roleRestrictions);
  }

  // TODO: documentation
  public async getFactoryAddress(): Promise<string> {
    return this.contractWrapper.readContract.factory();
  }

  // TODO: documentation
  public async getSignersWithRestrictions(): Promise<SignerWithRestrictions[]> {
    // Get all associated signers.
    const factory = await this.getFactory();
    const signers: string[] = await factory.getAssociatedSigners(this.getAddress());
    
    return await Promise.all(
      signers.map(async (signer) => {
        const isAdmin = await this.contractWrapper.readContract.isAdmin(signer);
        const restrictions = await this.getAccessRestrictions(signer);
        return { signer, isAdmin, restrictions };
      })
    );
  }
  
  /*********************************
   * WRITE FUNCTIONS
  ********************************/

  grantAdminAccess = buildTransactionFunction(
    async(
      signer: string,
    ): Promise<Transaction> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setAdmin",
        args: [signer, true],
      })
    }
  )

  revokeAdminAccess = buildTransactionFunction(
    async(
      signer: string,
    ): Promise<Transaction> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setAdmin",
        args: [signer, false],
      })
    }
  )
  
  // TODO: documentation
  grantAccess = buildTransactionFunction(
    async(
      signer: string,
      restrictions: AccessRestrictions,
    ): Promise<Transaction> => {

      const currentRole = (await this.contractWrapper.readContract.getRoleRestrictionsForAccount(signer)).role;
      if(currentRole !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
        throw new Error("Signer already has access");
      }

      // Performing a multicall: [1] setting restrictions for role, [2] granting role to signer.
      const encoded: string[] = [];

      // ===== Preparing [1] `setRoleRestrictions` =====

      // Derive role for target signer.
      const role = ethers.utils.solidityKeccak256(["string"], [signer]);

      // Get role restrictions struct.
      const roleRestrictions: IAccountPermissions.RoleRestrictionsStruct = {
        role,
        approvedTargets: restrictions.approvedCallTargets,
        maxValuePerTransaction: restrictions.nativeTokenLimitPerTransaction,
        startTimestamp: Math.floor(restrictions.startDate.getTime() / 1000),
        endTimestamp: Math.floor(restrictions.expirationDate.getTime() / 1000),
      }

      encoded.push(this.contractWrapper.readContract.interface.encodeFunctionData("setRoleRestrictions", [roleRestrictions]));

      // ===== Preparing [2] `changeRole` =====

      const { payload, signature } = await this.generatePayload(signer, RoleAction.GRANT);
      
      const isValidSigner = await this.contractWrapper.readContract.verifyRoleRequest(payload, signature);
      if(!isValidSigner) { throw new Error(`Invalid signature.`) }
      
      encoded.push(this.contractWrapper.readContract.interface.encodeFunctionData("changeRole", [payload, signature]));
      
      // Perform multicall
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "multicall",
        args: [encoded],
      })
    }
  );

  // TODO: Add / remove approved targets.

  updateAccess = buildTransactionFunction(
    async(
      signer: string,
      restrictions: AccessRestrictions,
    ): Promise<Transaction> => {
      
      const currentRole = (await this.contractWrapper.readContract.getRoleRestrictionsForAccount(signer)).role;
      if(currentRole === "0x0000000000000000000000000000000000000000000000000000000000000000") {
        throw new Error("Signer does not have any access");
      }

      // Get role restrictions struct.
      const roleRestrictions: IAccountPermissions.RoleRestrictionsStruct = {
        role: currentRole,
        approvedTargets: restrictions.approvedCallTargets,
        maxValuePerTransaction: restrictions.nativeTokenLimitPerTransaction,
        startTimestamp: Math.floor(restrictions.startDate.getTime() / 1000),
        endTimestamp: Math.floor(restrictions.expirationDate.getTime() / 1000),
      }

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setRoleRestrictions",
        args: [roleRestrictions],
      })
    }
  )
  
  // TODO: documentation
  revokeAccess = buildTransactionFunction(
    async(
      signer: string,
    ): Promise<Transaction> => {
      const currentRole = (await this.contractWrapper.readContract.getRoleRestrictionsForAccount(signer)).role;
      if(currentRole === "0x0000000000000000000000000000000000000000000000000000000000000000") {
        throw new Error("Signer does not have any access");
      }

      const { payload, signature } = await this.generatePayload(signer, RoleAction.REVOKE);
      
      const isValidSigner = await this.contractWrapper.readContract.verifyRoleRequest(payload, signature);
      if(!isValidSigner) { throw new Error(`Invalid signature.`) }

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "changeRole",
        args: [payload, signature],
      })
    }
  )
}