import * as zk from "zksync-web3";
import { twProxyArtifactZK } from "./temp-artifact/TWProxy";
import {
  convertParamValues,
  extractFunctionParamsFromAbi,
  fetchAndCacheDeployMetadata,
} from "../common";
import { BytesLike, Contract, Signer, ethers } from "ethers";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { DeployOptions } from "../types";
import { ThirdwebSDK } from "../core/sdk";
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
    if (!implementationAddress) {
      throw new Error("Contract not supported yet.");
    }

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

    // register on multichain registry
    await registerContractOnMultiChainRegistry(
      proxy.address,
      chainId,
      compilerMetadata.metadataUri,
    );

    return proxy.address;
  } else {
    throw new Error("Contract not supported yet.");
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
      return true;
    }
    // add to multichain registry with metadata uri unlocks the contract on SDK/dashboard for everyone
    await sdk.multiChainRegistry.addContract({
      address,
      chainId,
      metadataURI,
    });
    return true;
  } catch (e) {
    console.log("Error registering contract on multi chain registry", e);
    return false;
  }
}
