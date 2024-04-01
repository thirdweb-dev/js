import invariant from "tiny-invariant";
import {
  Signer,
  Wallet,
  ContractFactory as ZkContractFactory,
} from "zksync-ethers";
import { isZkContractDeployed } from "./isZkContractDeployed";
import { PUBLISHED_PRIVATE_KEY, SINGLETON_FACTORY } from "./constants";
import { BytesLike, parseEther } from "ethers/lib/utils";
import { zkSingletonFactoryArtifact } from "./temp-artifact/ZkSingletonFactory";

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

  const create2FactoryDeploy = new ZkContractFactory(
    zkSingletonFactoryArtifact.abi,
    zkSingletonFactoryArtifact.bytecode as BytesLike,
    create2Signer,
    "create",
  );
  const create2Factory = await create2FactoryDeploy.deploy();

  await create2Factory.deployed();

  return create2Factory.address;
}
