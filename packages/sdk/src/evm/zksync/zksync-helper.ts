import * as zk from "zksync-web3";
import invariant from "tiny-invariant";
import { twProxyArtifactZK } from "./temp-artifact/TWProxy";
import { getContractTypeForRemoteName } from "../contracts";
import {
  extractFunctionParamsFromAbi,
  fetchAndCacheDeployMetadata,
} from "../common";
import { BigNumber, BytesLike, Contract, Signer, ethers } from "ethers";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { getApprovedImplementation } from "../constants";
import { DeployOptions } from "../types";
import { ThirdwebSDK } from "../core";

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

  const contractType = getContractTypeForRemoteName(compilerMetadata.name);
  invariant(contractType !== "custom", "Can't deploy custom contracts yet.");

  const implementationAddress = getApprovedImplementation(
    chainId,
    contractType,
  );
  invariant(implementationAddress, "Implementation not found");

  if (
    extendedMetadata &&
    extendedMetadata.factoryDeploymentData &&
    (extendedMetadata.isDeployableViaProxy ||
      extendedMetadata.isDeployableViaFactory) &&
    !forceDirectDeploy
  ) {
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
    throw new Error("Error deploying contract");
  }
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

function convertParamValues(
  constructorParamTypes: string[],
  constructorParamValues: any[],
) {
  // check that both arrays are same length
  if (constructorParamTypes.length !== constructorParamValues.length) {
    throw Error(
      `Passed the wrong number of constructor arguments: ${constructorParamValues.length}, expected ${constructorParamTypes.length}`,
    );
  }
  return constructorParamTypes.map((p, index) => {
    if (p === "tuple" || p.endsWith("[]")) {
      if (typeof constructorParamValues[index] === "string") {
        return JSON.parse(constructorParamValues[index]);
      } else {
        return constructorParamValues[index];
      }
    }
    if (p === "bytes32") {
      invariant(
        ethers.utils.isHexString(constructorParamValues[index]),
        `Could not parse bytes32 value. Expected valid hex string but got "${constructorParamValues[index]}".`,
      );
      return ethers.utils.hexZeroPad(constructorParamValues[index], 32);
    }
    if (p.startsWith("bytes")) {
      invariant(
        ethers.utils.isHexString(constructorParamValues[index]),
        `Could not parse bytes value. Expected valid hex string but got "${constructorParamValues[index]}".`,
      );
      return constructorParamValues[index];
    }
    if (p.startsWith("uint") || p.startsWith("int")) {
      return BigNumber.from(constructorParamValues[index].toString());
    }
    return constructorParamValues[index];
  });
}
