import invariant from "tiny-invariant";
import { ethers, providers, Signer } from "ethers";
import {
  KeylessDeploymentInfo,
  KeylessTransaction,
} from "../types/any-evm/deploy-data";

// get create2 factory info
export const CREATE2_FACTORY_BYTECODE =
  "0x604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3";
export const SIGNATURE = {
  v: 27,
  r: "0x2222222222222222222222222222222222222222222222222222222222222222",
  s: "0x2222222222222222222222222222222222222222222222222222222222222222",
};

export async function isContractDeployed(
  address: string,
  provider: providers.Provider,
) {
  const code = await provider.getCode(address);

  return code !== "0x";
}

export async function isEIP155Enforced(
  provider: providers.Provider,
): Promise<boolean> {
  try {
    // TODO: Find a better way to check this.

    // Send a random transaction of legacy type (pre-eip-155).
    // It will fail. Parse the error message to check whether eip-155 is enforced.
    await provider.sendTransaction(
      "0xf8a58085174876e800830186a08080b853604580600e600039806000f350fe7fffffffffffffffafffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf31ba02222222222222222222222222222222222222222222222222222222222222222a02222222222222222222222222222222222222222222222222222222222222222",
    );
  } catch (e: any) {
    console.log("fncy error: ", e);
    if (e.data.message.toString().toLowerCase().includes("eip-155")) {
      return true;
    }
    return false;
  }
  return false;
}

export function getKeylessTxn(
  transaction: ethers.UnsignedTransaction,
  signature: string,
): KeylessTransaction {
  // 1. Create serialized txn string
  const digest = ethers.utils.arrayify(
    ethers.utils.keccak256(ethers.utils.serializeTransaction(transaction)),
  );

  // 2. Determine signer address from custom signature + txn
  const signer = ethers.utils.recoverAddress(digest, signature);

  // 3. Create the signed serialized txn string.
  // To be sent directly to the chain using a provider.
  const signedSerializedTx = ethers.utils.serializeTransaction(
    transaction,
    signature,
  );

  return {
    signer: signer,
    transaction: signedSerializedTx,
  };
}

function getCreate2FactoryDeploymentInfo(
  chainId: number,
): KeylessDeploymentInfo {
  const signature = ethers.utils.joinSignature(SIGNATURE);
  const deploymentTransaction = getKeylessTxn(
    {
      gasPrice: 100 * 10 ** 9,
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

export async function deployCreate2Factory(signer: Signer): Promise<string> {
  invariant(signer.provider, "No provider");

  const enforceEip155 = await isEIP155Enforced(signer.provider);
  console.log("is eip155 enforced: ", enforceEip155);
  const chainId = enforceEip155
    ? (await signer.provider.getNetwork()).chainId
    : 0;
  const deploymentInfo = getCreate2FactoryDeploymentInfo(chainId);
  console.log("deployment info: ", deploymentInfo);
  const factoryExists = await isContractDeployed(
    deploymentInfo.deployment,
    signer.provider,
  );

  // deploy community factory if not already deployed
  if (!factoryExists) {
    // send balance to the keyless signer
    if (
      (await signer.provider.getBalance(deploymentInfo.signer)).lt(
        ethers.utils.parseEther("0.01"),
      )
    ) {
      await signer.sendTransaction({
        to: deploymentInfo.signer,
        value: ethers.utils.parseEther("0.01"),
      });
    }

    // deploy
    try {
      console.log("deploying create two factory");
      await signer.provider.sendTransaction(deploymentInfo.transaction);
    } catch (err) {
      throw new Error(`Couldn't deploy CREATE2 factory: ${err}`);
    }
  }

  return deploymentInfo.deployment;
}

export async function getCreate2Factory(
  provider: providers.Provider,
): Promise<string> {
  const enforceEip155 = await isEIP155Enforced(provider);
  const chainId = enforceEip155 ? (await provider.getNetwork()).chainId : 0;
  const deploymentInfo = getCreate2FactoryDeploymentInfo(chainId);

  return deploymentInfo.deployment;
}

// encode constructor params

// get contract address -- bytecode, constructor params, deployer address, deployer type, nonce

// deploy contract

// deploy multiple contracts in single tx
