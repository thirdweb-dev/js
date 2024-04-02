import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { providers, utils } from "ethers";
import invariant from "tiny-invariant";
import { extractConstructorParamsFromAbi } from "../common/feature-detection/extractConstructorParamsFromAbi";
import { getChainProvider } from "../constants/urls";
import { Abi } from "../schema/contracts/custom";
import { twProxyArtifactZK } from "./temp-artifact/TWProxy";
import { fetchSourceFilesFromMetadata } from "../common/fetchSourceFilesFromMetadata";
import { fetchContractMetadata } from "../common/fetchContractMetadata";
import { checkVerificationStatus } from "../common/verification";
import { ThirdwebSDK } from "../core/sdk";

const RequestStatus = {
  OK: "1",
  NOTOK: "0",
};

//
// ==================================
// ======== Core Functions ==========
// ==================================
//

export async function zkVerify(
  contractAddress: string,
  chainId: number,
  explorerAPIUrl: string,
  explorerAPIKey: string,
  storage: ThirdwebStorage,
  metadataUri?: string,
  zkVersion?: string,
  encodedConstructorArgs?: string,
) {
  try {
    const provider = getChainProvider(chainId, {});
    const contractBytecode = await provider.getCode(contractAddress);
    let compilerMetadata: any = {};
    if (contractBytecode === twProxyArtifactZK.bytecode) {
      compilerMetadata = {
        name: twProxyArtifactZK.contractName,
        abi: twProxyArtifactZK.abi,
        metadata: JSON.parse(twProxyArtifactZK.metadata.solc_metadata),
        zk_version: twProxyArtifactZK.metadata.zk_version,
      };
      compilerMetadata.metadata.sources = twProxyArtifactZK.sources;
    } else {
      if (!metadataUri || metadataUri.length === 0) {
        metadataUri = await fetchFromMultiChainRegistry(
          contractAddress,
          chainId,
        );
      }
      invariant(metadataUri && metadataUri.length > 0, "No contract URI found");

      const parsedMetadata = await fetchContractMetadata(metadataUri, storage);
      const zk_version =
        parsedMetadata.metadata.settings.zkVersion || zkVersion;
      if (!zk_version) {
        console.error("zk version not found");
      }

      compilerMetadata = {
        name: parsedMetadata.name,
        abi: parsedMetadata.abi,
        metadata: parsedMetadata.metadata,
        zk_version,
      };
    }

    const compilerVersion = compilerMetadata.metadata.compiler.version;
    const sources = await fetchSourceFilesFromMetadata(
      compilerMetadata,
      storage,
    );

    const sourcesWithUrl = compilerMetadata.metadata.sources;
    const sourcesWithContents: Record<string, { content: string }> = {};
    for (const path of Object.keys(sourcesWithUrl)) {
      const sourceCode = sources.find((source) => path === source.filename);
      if (!sourceCode) {
        throw new Error(`Could not find source file for ${path}`);
      }
      sourcesWithContents[path] = {
        content: sourceCode.source,
      };
    }

    const compilerInput: any = {
      language: "Solidity",
      settings: compilerMetadata.metadata.settings.optimizer,
      sources: sourcesWithContents,
    };

    const compilationTarget =
      compilerMetadata.metadata.settings.compilationTarget;
    const targets = Object.keys(compilationTarget);
    const contractPath = targets[0];

    const encodedArgs = encodedConstructorArgs
      ? encodedConstructorArgs
      : await zkFetchConstructorParams(
          explorerAPIUrl,
          explorerAPIKey,
          contractAddress,
          compilerMetadata.abi,
          provider,
        );

    const requestBody: Record<string, string> = {
      module: "contract",
      action: "verifysourcecode",
      contractaddress: contractAddress,
      sourceCode: compilerInput,
      codeformat: "solidity-standard-json-input",
      contractname: `${contractPath}:${compilerMetadata.name}`,
      compilerversion: `${compilerVersion.split("+")[0]}`,
      zkCompilerVersion: `v${compilerMetadata.zk_version}`,
      runs: compilerMetadata.metadata.settings.optimizer.runs,
      optimizationUsed: compilerMetadata.metadata.settings.optimizer.enabled
        ? "1"
        : "0",
      constructorArguements: encodedArgs,
    };

    const result = await fetch(`${explorerAPIUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await result.json();
    if (data.status === RequestStatus.OK) {
      console.info("Checking verification status...");
      const verificationStatus = await checkVerificationStatus(
        explorerAPIUrl,
        explorerAPIKey,
        data.result,
      );
      console.info(verificationStatus);
    } else {
      throw new Error(`${data.result}`);
    }
  } catch (e: any) {
    throw new Error(e.toString());
  }
}

//
// ==================================
// ======== Helper Functions ========
// ==================================
//

async function zkFetchConstructorParams(
  explorerAPIUrl: string,
  explorerAPIKey: string,
  contractAddress: string,
  abi: Abi,
  provider: providers.Provider,
): Promise<string> {
  const constructorParamTypes = extractConstructorParamsFromAbi(abi);
  if (constructorParamTypes.length === 0) {
    return "0x";
  }

  const result = await fetch(
    `${explorerAPIUrl}?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}&apikey=${explorerAPIKey}`,
  );
  const creationTx = await result.json();

  if (
    creationTx &&
    creationTx.status === RequestStatus.OK &&
    creationTx.result[0] !== undefined
  ) {
    const txHash = creationTx.result[0].txHash;
    const transaction = await provider.getTransaction(txHash);
    if (transaction.to === "0x0000000000000000000000000000000000008006") {
      const decoded = utils.defaultAbiCoder.decode(
        ["bytes32", "bytes32", "bytes"],
        utils.hexDataSlice(transaction.data, 4),
      );

      return decoded[2].startsWith("0x") ? decoded[2] : `0x${decoded[2]}`;
    } else {
      // TODO: decode for create2 deployments via factory
      return "0x";
    }
  } else {
    // Could not retrieve constructor parameters, using empty parameters as fallback
    return "0x";
  }
}

async function fetchFromMultiChainRegistry(
  address: string,
  chainId: number,
): Promise<string | undefined> {
  try {
    // random wallet is fine here, we're doing gasless calls
    const sdk = new ThirdwebSDK("polygon");
    const uri = await sdk.multiChainRegistry.getContractMetadataURI(
      chainId,
      address,
    );
    return uri;
  } catch (e) {}
}
