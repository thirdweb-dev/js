import * as zk from "zksync-web3";
import invariant from "tiny-invariant";
import { twProxyArtifactZK } from "./temp-artifact/TWProxy";
import {
  convertParamValues,
  extractConstructorParamsFromAbi,
  extractFunctionParamsFromAbi,
  fetchAndCacheDeployMetadata,
} from "../common";
import { BytesLike, Contract, Signer, ethers } from "ethers";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { DeployOptions } from "../types";
import { ThirdwebSDK } from "../core";
import { getImplementation } from "./constants/addresses";
import { DeploymentTransaction } from "../types/any-evm/deploy-data";

export async function zkDeployContractFromUri(
  publishMetadataUri: string,
  constructorParamValues: any[],
  signer: Signer,
  storage: ThirdwebStorage,
  chainId: number,
  options?: DeployOptions,
): Promise<string> {
  const { compilerMetadata, extendedMetadata } =
    await fetchAndCacheDeployMetadata(publishMetadataUri, storage);
  const forceDirectDeploy = options?.forceDirectDeploy || false;

  if (
    extendedMetadata &&
    extendedMetadata.factoryDeploymentData &&
    (extendedMetadata.isDeployableViaProxy ||
      extendedMetadata.isDeployableViaFactory) &&
    !forceDirectDeploy
  ) {
    const implementationAddress = getImplementation(
      chainId,
      compilerMetadata.name,
    );
    invariant(implementationAddress, "Contract not supported yet.");

    const initializerParamTypes = extractFunctionParamsFromAbi(
      compilerMetadata.abi,
      extendedMetadata.factoryDeploymentData.implementationInitializerFunction,
    ).map((p) => p.type);

    const paramValues = convertParamValues(
      initializerParamTypes,
      constructorParamValues,
    );

    const encodedInitializer = Contract.getInterface(
      compilerMetadata.abi,
    ).encodeFunctionData(
      extendedMetadata.factoryDeploymentData.implementationInitializerFunction,
      paramValues,
    );

    console.log("args: ", implementationAddress, encodedInitializer);
    const proxyFactory = new zk.ContractFactory(
      twProxyArtifactZK.abi,
      twProxyArtifactZK.bytecode as BytesLike,
      signer as zk.Signer,
      "create",
    );
    const proxy = await proxyFactory.deploy(
      implementationAddress,
      encodedInitializer,
    );

    await proxy.deployed();
    console.log("Proxy deployed at: ", proxy.address);

    // register on multichain registry
    await registerContractOnMultiChainRegistry(
      proxy.address,
      chainId,
      compilerMetadata.metadataUri,
    );

    return proxy.address;
  } else {
    const bytecode = compilerMetadata.bytecode.startsWith("0x")
      ? compilerMetadata.bytecode
      : `0x${compilerMetadata.bytecode}`;
    if (!ethers.utils.isHexString(bytecode)) {
      throw new Error(`Contract bytecode is invalid.\n\n${bytecode}`);
    }
    const constructorParamTypes = extractConstructorParamsFromAbi(
      compilerMetadata.abi,
    ).map((p) => p.type);
    const paramValues = convertParamValues(
      constructorParamTypes,
      constructorParamValues,
    );

    const factory = new zk.ContractFactory(
      compilerMetadata.abi,
      bytecode as BytesLike,
      signer as zk.Signer,
      "create",
    );
    const contract = await factory.deploy(...paramValues);

    await contract.deployed();
    console.log("Contract deployed at: ", contract.address);

    // register on multichain registry
    await registerContractOnMultiChainRegistry(
      contract.address,
      chainId,
      compilerMetadata.metadataUri,
    );

    return contract.address;
  }
}

export async function getZkTransactionsForDeploy(): Promise<
  DeploymentTransaction[]
> {
  let transactions: DeploymentTransaction[] = [];

  transactions.push({
    contractType: "proxy",
    addresses: [],
  });
  return transactions;
}

async function registerContractOnMultiChainRegistry(
  address: string,
  chainId: number,
  metadataURI: string,
) {
  try {
    // random wallet is fine here, we're doing gasless calls
    const wallet = ethers.Wallet.createRandom();
    const sdk = ThirdwebSDK.fromPrivateKey(wallet.privateKey, "polygon", {
      gasless: {
        openzeppelin: {
          relayerUrl:
            "https://api.defender.openzeppelin.com/autotasks/dad61716-3624-46c9-874f-0e73f15f04d5/runs/webhook/7d6a1834-dd33-4b7b-8af4-b6b4719a0b97/FdHMqyF3p6MGHw6K2nkLsv",
          relayerForwarderAddress: "0xEbc1977d1aC2fe1F6DAaF584E2957F7c436fcdEF",
        },
        experimentalChainlessSupport: true,
      },
    });
    const existingMeta = await sdk.multiChainRegistry.getContractMetadataURI(
      chainId,
      address,
    );
    if (existingMeta && existingMeta !== "") {
      console.log("Contract already registered on multi chain registry");
      return true;
    }
    console.log(
      "Registering contract on multi chain registry:",
      address,
      chainId,
    );
    // add to multichain registry with metadata uri unlocks the contract on SDK/dashboard for everyone
    const tx = await sdk.multiChainRegistry.addContract({
      address,
      chainId,
      metadataURI,
    });
    console.log(
      "Registered contract on multi chain registry",
      tx.receipt.transactionHash,
    );
    return true;
  } catch (e) {
    console.log("Error registering contract on multi chain registry", e);
    return false;
  }
}
