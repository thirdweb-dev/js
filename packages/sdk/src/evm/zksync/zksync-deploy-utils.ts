import {
  ContractFactory as ZkContractFactory,
  type Signer as ZkSigner,
} from "zksync-web3";
import { twProxyArtifactZK } from "./temp-artifact/TWProxy";
import { fetchAndCacheDeployMetadata } from "../common/any-evm-utils/fetchAndCacheDeployMetadata";
import { convertParamValues } from "../common/any-evm-utils/convertParamValues";
import { extractConstructorParamsFromAbi } from "../common/feature-detection/extractConstructorParamsFromAbi";
import { extractFunctionParamsFromAbi } from "../common/feature-detection/extractFunctionParamsFromAbi";
import { type BytesLike, Contract, type Signer, utils, Wallet } from "ethers";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { DeployOptions } from "../types/deploy/deploy-options";
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

  if (!forceDirectDeploy) {
    throw new Error("Deployments disabled temporarily.");
  }

  const isNetworkEnabled =
    extendedMetadata?.networksForDeployment?.networksEnabled.includes(
      chainId,
    ) || extendedMetadata?.networksForDeployment?.allNetworks;

  if (extendedMetadata?.networksForDeployment && !isNetworkEnabled) {
    throw new Error(
      `Deployments disabled on this network, with chainId: ${chainId}`,
    );
  }

  if (
    extendedMetadata &&
    extendedMetadata.factoryDeploymentData &&
    !forceDirectDeploy &&
    (!extendedMetadata.deployType || extendedMetadata.deployType !== "standard")
  ) {
    if (
      extendedMetadata.isDeployableViaProxy ||
      extendedMetadata.isDeployableViaFactory ||
      extendedMetadata.deployType === "autoFactory"
    ) {
      const implementationAddress = getImplementation(
        chainId,
        compilerMetadata.name,
        extendedMetadata.version,
      );
      if (implementationAddress) {
        throw new Error("Contract not supported yet.");
      }

      const initializerParamTypes = extractFunctionParamsFromAbi(
        compilerMetadata.abi,
        extendedMetadata.factoryDeploymentData
          .implementationInitializerFunction,
      ).map((p) => p.type);

      const paramValues = convertParamValues(
        initializerParamTypes,
        constructorParamValues,
      );

      const encodedInitializer = Contract.getInterface(
        compilerMetadata.abi,
      ).encodeFunctionData(
        extendedMetadata.factoryDeploymentData
          .implementationInitializerFunction,
        paramValues,
      );

      const proxyFactory = new ZkContractFactory(
        twProxyArtifactZK.abi,
        twProxyArtifactZK.bytecode as BytesLike,
        signer as ZkSigner,
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
      throw new Error("Invalid deploy type");
    }
  } else {
    // throw new Error("Contract not supported yet.");
    const bytecode = compilerMetadata.bytecode.startsWith("0x")
      ? compilerMetadata.bytecode
      : `0x${compilerMetadata.bytecode}`;
    if (!utils.isHexString(bytecode)) {
      throw new Error(`Contract bytecode is invalid.\n\n${bytecode}`);
    }
    const constructorParamTypes = extractConstructorParamsFromAbi(
      compilerMetadata.abi,
    ).map((p) => p.type);
    const paramValues = convertParamValues(
      constructorParamTypes,
      constructorParamValues,
    );

    const factory = new ZkContractFactory(
      compilerMetadata.abi,
      compilerMetadata.bytecode as BytesLike,
      signer as ZkSigner,
      "create",
    );
    const contract = await factory.deploy(...paramValues);

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
  const transactions: DeploymentTransaction[] = [];

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
    const wallet = Wallet.createRandom();
    const sdk = ThirdwebSDK.fromPrivateKey(wallet.privateKey, "polygon", {
      gasless: {
        openzeppelin: {
          relayerUrl:
            "https://api.defender.openzeppelin.com/autotasks/dad61716-3624-46c9-874f-0e73f15f04d5/runs/webhook/7d6a1834-dd33-4b7b-8af4-b6b4719a0b97/FdHMqyF3p6MGHw6K2nkLsv",
          relayerForwarderAddress: "0x409d530a6961297ece29121dbee2c917c3398659",
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
