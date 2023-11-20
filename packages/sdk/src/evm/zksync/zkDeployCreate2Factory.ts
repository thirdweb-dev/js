import invariant from "tiny-invariant";
import {
  Signer,
  Wallet,
  ContractFactory as ZkContractFactory,
} from "zksync-web3";
import { isZkContractDeployed } from "./isZkContractDeployed";
import { PUBLISHED_PRIVATE_KEY, SINGLETON_FACTORY } from "./constants";
import { BytesLike, parseEther } from "ethers/lib/utils";
import { zkSingletonFactoryArtifact } from "./temp-artifact/ZkSingletonFactory";
import { ContractInterface, providers, utils } from "ethers";
import { DeploymentType } from "zksync-web3/build/src/types";
import { CONTRACT_DEPLOYER, hashBytecode } from "zksync-web3/build/src/utils";

class ContractFactory extends ZkContractFactory {
  constructor(
    abi: ContractInterface,
    bytecode: BytesLike,
    signer: Wallet,
    deploymentType?: DeploymentType,
  ) {
    super(abi, bytecode, signer, deploymentType);
  }

  // private encodeCalldata(salt: BytesLike, bytecodeHash: BytesLike, constructorCalldata: BytesLike) {
  //     if (this.deploymentType == 'create') {
  //         return CONTRACT_DEPLOYER.encodeFunctionData('create', [salt, bytecodeHash, constructorCalldata]);
  //     } else if (this.deploymentType == 'createAccount') {
  //         return CONTRACT_DEPLOYER.encodeFunctionData('createAccount', [
  //             salt,
  //             bytecodeHash,
  //             constructorCalldata,
  //             AccountAbstractionVersion.Version1
  //         ]);
  //     } else {
  //         throw new Error(`Unsupported deployment type ${this.deploymentType}`);
  //     }
  // }

  override getDeployTransaction(...args: any[]): providers.TransactionRequest {
    let salt = utils.id("salt1234");
    const txRequest = super.getDeployTransaction(...args);

    // Removing overrides
    if (this.interface.deploy.inputs.length + 1 == args.length) {
      args.pop();
    }

    // Salt argument is not used, so we provide a placeholder value.
    const bytecodeHash = hashBytecode(this.bytecode);
    const constructorCalldata = utils.arrayify(
      this.interface.encodeDeploy(args),
    );
    txRequest.data = CONTRACT_DEPLOYER.encodeFunctionData("create2", [
      salt,
      bytecodeHash,
      constructorCalldata,
    ]);

    return txRequest;
  }
}

/**
 * Deploy ZkSyncSingletonFactory
 * Ref: https://explorer.zksync.io/address/0xa51baf6a9c0ef5Db8C1898d5aDD92Bf3227d6088
 *
 * @public
 * @param signer - The signer to use
 */
export async function zkDeployCreate2Factory(signer: Signer): Promise<string> {
  invariant(signer.provider, "No provider");
  const singletonFactoryExists = await isZkContractDeployed(
    SINGLETON_FACTORY,
    signer.provider,
  );
  if (singletonFactoryExists) {
    return SINGLETON_FACTORY;
  }

  // send balance to the create2 signer
  const valueToSend = parseEther("0.01");

  const create2Signer = new Wallet(PUBLISHED_PRIVATE_KEY, signer.provider);

  if ((await create2Signer.getBalance()).lt(valueToSend)) {
    await signer.transfer({
      to: create2Signer.address,
      amount: valueToSend,
    });
  }

  const create2FactoryDeploy = new ContractFactory(
    zkSingletonFactoryArtifact.abi,
    zkSingletonFactoryArtifact.bytecode as BytesLike,
    create2Signer,
    "create",
  );
  const create2Factory = await create2FactoryDeploy.deploy();

  await create2Factory.deployed();

  return create2Factory.address;
}
