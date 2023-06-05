import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import { FEATURE_SMART_WALLET } from "../../constants/thirdweb-features";
import { ethers } from "ethers";
import { Transaction } from "./transactions";

import type {
  IAccount, 
  IAccountPermissions,
  IMulticall 
} from "@thirdweb-dev/contracts-js";
import { AccessRestrictions, RoleRequest, } from "../../types";
import { randomUUID } from "crypto";
import invariant from "tiny-invariant";
import { buildTransactionFunction } from "../../common/transactions";

export class SmartWallet<TContract extends IAccount & IAccountPermissions & IMulticall> implements DetectableFeature {
    
  featureName = FEATURE_SMART_WALLET.name;
  private contractWrapper: ContractWrapper<IAccount & IAccountPermissions & IMulticall>;

  private GRANT = 0;
  private REVOKE = 1;

  constructor(contractWrapper: ContractWrapper<TContract>) {
    this.contractWrapper = contractWrapper;
  }

  getAddress(): string {
    return this.contractWrapper.readContract.address;
  }

  /*********************************
   * READ FUNCTIONS
  ********************************/

  // TODO: documentation
  public async getAccessRestrictions(signer: string): Promise<IAccountPermissions.RoleRestrictionsStruct> {
    return this.contractWrapper.readContract.getRoleRestrictionsForAccount(signer);
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
        approvedTargets: restrictions.approvedTargets,
        maxValuePerTransaction: restrictions.maxValuePerTransaction,
        startTimestamp: Math.floor(restrictions.startTimestamp.getTime() / 1000),
        endTimestamp: Math.floor(restrictions.expirationTimestamp.getTime() / 1000),
      }

      encoded.push(this.contractWrapper.readContract.interface.encodeFunctionData("setRoleRestrictions", [roleRestrictions]));

      // ===== Preparing [2] `changeRole` =====
      
      // Get role request struct.
      const roleRequest: IAccountPermissions.RoleRequestStruct = {
        role,
        target: signer,
        action: this.GRANT,
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
        roleRequest
      );
      
      encoded.push(this.contractWrapper.readContract.interface.encodeFunctionData("changeRole", [roleRequest, signature]));
      
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
      // Derive role for target signer.
      const role = ethers.utils.solidityKeccak256(["string"], [signer]);


      // Get role request struct.
      const roleRequest: IAccountPermissions.RoleRequestStruct = {
        role,
        target: signer,
        action: this.REVOKE,
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
        roleRequest
      );

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "changeRole",
        args: [roleRequest, signature],
      })
    }
  )
}