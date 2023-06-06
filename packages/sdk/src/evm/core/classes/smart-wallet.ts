import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import { FEATURE_SMART_WALLET } from "../../constants/thirdweb-features";
import { ethers, BigNumber } from "ethers";
import { Transaction } from "./transactions";

import type {
  IAccountCore, IAccountPermissions
} from "@thirdweb-dev/contracts-js";
import { AccessRestrictions, RoleAction, RoleRequest, SignedAccountPermissionsPayload, } from "../../types";
import { randomUUID } from "crypto";
import invariant from "tiny-invariant";
import { buildTransactionFunction } from "../../common/transactions";

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
      startDate: new Date(parseInt((restrictions.startTimestamp).toString())),
      expirationDate: new Date(parseInt((restrictions.endTimestamp).toString())),
      nativeTokenLimitPerTransaction: BigNumber.from(restrictions.maxValuePerTransaction),
      approvedCallTargets: restrictions.approvedTargets,
    }
  }

  private async generatePayload(signer: string, roleAction: RoleAction ): Promise<SignedAccountPermissionsPayload> {
    // Derive role for target signer.
    const role = ethers.utils.solidityKeccak256(["string"], [signer]);

    // Get role request struct.
    const payload: IAccountPermissions.RoleRequestStruct = {
      role,
      target: signer,
      action: roleAction,
      validityStartTimestamp: 0,
      validityEndTimestamp: ethers.constants.MaxUint256,
      uid: randomUUID(),
    }

    // Generate signature
    const chainId = await this.contractWrapper.getChainID();
    const connectedSigner = this.contractWrapper.getSigner();
    invariant(connectedSigner, "No signer available");

    const signature = await this.contractWrapper.signTypedData(
      connectedSigner,
      {
        name: "AccountPermissions",
        version: "1",
        chainId,
        verifyingContract: this.contractWrapper.readContract.address,
      },
      { RoleRequest },
      payload
    );

    return { payload, signature };
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
  
  /*********************************
   * WRITE FUNCTIONS
  ********************************/
  
  // TODO: documentation
  grantAccess = buildTransactionFunction(
    async(
      signer: string,
      restrictions: AccessRestrictions,
    ): Promise<Transaction> => {
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
      
      encoded.push(this.contractWrapper.readContract.interface.encodeFunctionData("changeRole", [payload, signature]));
      
      // Perform multicall
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "multicall",
        args: [encoded],
      })
    }
  );
  
  // TODO: documentation
  revokeAccess = buildTransactionFunction(
    async(
      signer: string,
    ): Promise<Transaction> => {
      const { payload, signature } = await this.generatePayload(signer, RoleAction.REVOKE);

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "changeRole",
        args: [payload, signature],
      })
    }
  )
}