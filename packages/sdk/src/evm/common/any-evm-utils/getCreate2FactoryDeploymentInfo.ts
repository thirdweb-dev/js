import { ethers } from "ethers";
import { KeylessDeploymentInfo } from "../../types/any-evm/deploy-data";
import { SIGNATURE, CREATE2_FACTORY_BYTECODE } from "./constants";
import { getKeylessTxn } from "./getKeylessTxn";

/**
 *
 * @public
 * @param transaction: Unsigned transaction object
 * @param signature: Signature bytes
 */
export function getCreate2FactoryDeploymentInfo(
  chainId: number,
  gasPrice?: number,
): KeylessDeploymentInfo {
  const signature = ethers.utils.joinSignature(SIGNATURE);
  const deploymentTransaction = getKeylessTxn(
    {
      gasPrice: gasPrice ? gasPrice : 100 * 10 ** 9,
      gasLimit: 100000,
      nonce: 0,
      data: CREATE2_FACTORY_BYTECODE,
      chainId: chainId,
    },
    signature,
  );
  const create2FactoryAddress = ethers.utils.getContractAddress({
    from: deploymentTransaction.signer,
    nonce: 0,
  });

  return {
    ...deploymentTransaction,
    deployment: create2FactoryAddress,
  };
}
