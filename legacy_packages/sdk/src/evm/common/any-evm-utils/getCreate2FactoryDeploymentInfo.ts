import { BigNumber, utils } from "ethers";
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
  gasOptions: { gasPrice?: BigNumber; gasLimit?: BigNumber },
): KeylessDeploymentInfo {
  const signature = utils.joinSignature(SIGNATURE);

  // 100000 is default deployment gas limit and 100 gwei is default gas price for create2 factory deployment
  // (See: https://github.com/Arachnid/deterministic-deployment-proxy?tab=readme-ov-file#deployment-gas-limit)
  const gasPrice = gasOptions.gasPrice ? gasOptions.gasPrice : 100 * 10 ** 9;
  const gasLimit = gasOptions.gasLimit ? gasOptions.gasLimit : 100000;

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
    valueToSend: BigNumber.from(gasPrice).mul(gasLimit),
  };
}
