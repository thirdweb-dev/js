import {
  Provider,
  ContractFactory as ZkContractFactory,
  type Signer as ZkSigner,
} from "zksync-ethers";
import { twProxyArtifactZK } from "./temp-artifact/TWProxy";
import { fetchAndCacheDeployMetadata } from "../common/any-evm-utils/fetchAndCacheDeployMetadata";
import { convertParamValues } from "../common/any-evm-utils/convertParamValues";
import { extractConstructorParamsFromAbi } from "../common/feature-detection/extractConstructorParamsFromAbi";
import { extractFunctionParamsFromAbi } from "../common/feature-detection/extractFunctionParamsFromAbi";
import { type BytesLike, Contract, type Signer, utils } from "ethers";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import type {
  DeployMetadata,
  DeployOptions,
} from "../types/deploy/deploy-options";
import { blockExplorerApiMap, getImplementation } from "./constants/addresses";
import { DeploymentTransaction } from "../types/any-evm/deploy-data";
import { zkDeployCreate2Factory } from "./zkDeployCreate2Factory";
import { getZkDeploymentInfo } from "./getZkDeploymentInfo";
import {
  zkDeployContractDeterministic,
} from "./zkDeployContractDeterministic";
import invariant from "tiny-invariant";
import { zkVerify } from "./zksync-verification";
import { zkComputeDeploymentAddress } from "./zkComputeDeploymentAddress";
import { hashBytecode } from "zksync-ethers/build/utils";
import { isZkContractDeployed } from "./isZkContractDeployed";

/**
 * Deploy a proxy contract of a given implementation via thirdweb's Clone factory
 * @param publishMetadataUri - the uri of the publish metadata
 * @param constructorParamValues - the constructor param values
 * @param deployMetadata - the deploy metadata
 * @param signer - the signer to use
 * @param options - the deploy options
 */
async function zkDeployViaAutoFactory(
  deployMetadata: DeployMetadata,
  signer: Signer,
  storage: ThirdwebStorage,
  options?: DeployOptions,
  clientId?: string,
  secretKey?: string,
): Promise<string> {
  // any evm deployment flow

  // 1. Deploy CREATE2 factory (if not already exists)
  const create2Factory = await zkDeployCreate2Factory(signer as ZkSigner);

  // 2. get deployment info for any evm
  const deploymentInfo = await getZkDeploymentInfo(
    deployMetadata,
    storage,
    signer.provider as Provider,
    create2Factory,
    clientId,
    secretKey,
  );

  const implementationAddress = deploymentInfo.find(
    (i) => i.type === "implementation",
  )?.transaction.predictedAddress as string;

  // filter out already deployed contracts (data is empty)
  const transactionsToSend = deploymentInfo.filter(
    (i) => i.transaction.bytecodeHash && i.transaction.bytecodeHash.length > 0,
  );
  const transactionsforDirectDeploy = transactionsToSend.map(
    (i) => i.transaction,
  );

  // send each transaction directly to Create2 factory
  // process txns one at a time
  for (const tx of transactionsforDirectDeploy) {
    try {
      await zkDeployContractDeterministic(
        signer as ZkSigner,
        tx,
        storage,
        deployMetadata.compilerMetadata.fetchedMetadataUri,
        options,
      );
    } catch (e) {
      console.debug(
        `Error deploying contract at ${tx.predictedAddress}`,
        (e as any)?.message,
      );
    }
  }

  return implementationAddress;
}

export async function zkDeployContractFromUri(
  publishMetadataUri: string,
  constructorParamValues: any[],
  signer: Signer,
  storage: ThirdwebStorage,
  chainId: number,
  options?: DeployOptions,
  directDeployDeterministic?: boolean,
  clientId?: string,
  secretKey?: string,
): Promise<string> {
  const { compilerMetadata, extendedMetadata } =
    await fetchAndCacheDeployMetadata(
      publishMetadataUri,
      storage,
      options?.compilerOptions,
    );
  let deterministicDeployment = false;
  if (options?.compilerOptions && extendedMetadata?.compilers) {
    if (options.compilerOptions.compilerType !== "zksolc") {
      throw Error("Invalid compiler type");
    }
    deterministicDeployment = true;
  }
  const forceDirectDeploy = options?.forceDirectDeploy || false;

  const isNetworkEnabled =
    extendedMetadata?.networksForDeployment?.networksEnabled.includes(
      chainId,
    ) || extendedMetadata?.networksForDeployment?.allNetworks;

  if (extendedMetadata?.networksForDeployment && !isNetworkEnabled) {
    throw new Error(
      `Deployments disabled on this network, with chainId: ${chainId}`,
    );
  }

  let deployedAddress;
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
      let implementationAddress;
      if (deterministicDeployment) {
        invariant(
          extendedMetadata.factoryDeploymentData
            .implementationInitializerFunction,
          `implementationInitializerFunction not set'`,
        );

        try {
          implementationAddress = await zkDeployViaAutoFactory(
            { compilerMetadata, extendedMetadata },
            signer,
            storage,
            options,
            clientId,
            secretKey,
          );
        } catch (e) {}
      }

      if (!implementationAddress) {
        implementationAddress = getImplementation(
          chainId,
          compilerMetadata.name,
          extendedMetadata.version,
        );
      }

      if (!implementationAddress) {
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

      deployedAddress = proxy.address;
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

    if (directDeployDeterministic && !deterministicDeployment) {
      throw new Error(
        "Deterministic deployment not supported for this contract.",
      );
    } else if (directDeployDeterministic && deterministicDeployment) {
      const create2Factory = await zkDeployCreate2Factory(signer as ZkSigner);

      const encodedArgs = utils.defaultAbiCoder.encode(
        constructorParamTypes,
        constructorParamValues,
      );

      deployedAddress = zkComputeDeploymentAddress(
        bytecode,
        encodedArgs,
        create2Factory,
        options?.saltForProxyDeploy,
      );

      if (
        await isZkContractDeployed(deployedAddress, signer.provider as Provider)
      ) {
        throw new Error("Contract already deployed.");
      }

      const tx = {
        predictedAddress: deployedAddress,
        to: create2Factory,
        constructorCalldata: utils.arrayify(encodedArgs),
        bytecode,
        bytecodeHash: utils.hexlify(hashBytecode(bytecode)),
        abi: compilerMetadata.abi,
        params: paramValues,
      };

      try {
        await zkDeployContractDeterministic(
          signer as ZkSigner,
          tx,
          storage,
          compilerMetadata.fetchedMetadataUri,
          options,
        );
      } catch (e) {
        console.debug(
          `Error deploying contract at ${tx.predictedAddress}`,
          (e as any)?.message,
        );
      }
    } else {
      const factory = new ZkContractFactory(
        compilerMetadata.abi,
        compilerMetadata.bytecode as BytesLike,
        signer as ZkSigner,
        "create",
      );
      const contract = await factory.deploy(...paramValues);
      deployedAddress = contract.address;
    }
  }

  // fire-and-forget verification, don't await
  zkVerify(
    deployedAddress,
    chainId,
    blockExplorerApiMap[chainId],
    "",
    storage,
    compilerMetadata.fetchedMetadataUri,
  ).catch((error) => {
    console.warn("Error verifying contract", error);
  });

  return deployedAddress;
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
