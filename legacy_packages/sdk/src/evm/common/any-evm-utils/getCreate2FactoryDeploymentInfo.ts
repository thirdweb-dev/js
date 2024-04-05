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
  gasOptions: { gasPrice?: bigint; gasLimit?: bigint },
): KeylessDeploymentInfo {
  const signature = utils.joinSignature(SIGNATURE);
  const gasPrice = gasOptions.gasPrice ? gasOptions.gasPrice : 100n * 10n ** 9n;
  const gasLimit = gasOptions.gasLimit ? gasOptions.gasLimit : 100000n;

  const deploymentTransaction = getKeylessTxn(
    {
      gasPrice,
      gasLimit,
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
    valueToSend: gasPrice * gasLimit,
  };
}
