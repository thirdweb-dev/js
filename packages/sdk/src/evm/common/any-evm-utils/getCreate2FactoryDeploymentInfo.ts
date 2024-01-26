import { utils } from "ethers";
import { KeylessDeploymentInfo } from "../../types/any-evm/deploy-data";
import { SIGNATURE, CREATE2_FACTORY_BYTECODE } from "./constants";
import { getKeylessTxn } from "./getKeylessTxn";

/**
 *
 * @internal
 * @param transaction - Unsigned transaction object
 * @param signature - Signature bytes
 */
export function getCreate2FactoryDeploymentInfo(
  chainId: number,
  gasOptions: { gasPrice?: number; gasLimit?: number },
): KeylessDeploymentInfo {
  const signature = utils.joinSignature(SIGNATURE);
  const deploymentTransaction = getKeylessTxn(
    {
      gasPrice: gasOptions.gasPrice ? gasOptions.gasPrice : 100 * 10 ** 9,
      gasLimit: gasOptions.gasLimit ? gasOptions.gasLimit : 100000,
      nonce: 0,
      data: CREATE2_FACTORY_BYTECODE,
      chainId: chainId,
    },
    signature,
  );
  const create2FactoryAddress = utils.getContractAddress({
    from: deploymentTransaction.signer,
    nonce: 0,
  });

  return {
    ...deploymentTransaction,
    deployment: create2FactoryAddress,
  };
}
