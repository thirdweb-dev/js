import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { providers, utils } from "ethers";
import invariant from "tiny-invariant";
import { extractConstructorParamsFromAbi } from "../common/feature-detection/extractConstructorParamsFromAbi";
import { getChainProvider } from "../constants/urls";
import { Abi } from "../schema/contracts/custom";
import { twProxyArtifactZK } from "./temp-artifact/TWProxy";
import { fetchSourceFilesFromMetadata } from "../common/fetchSourceFilesFromMetadata";
import { fetchRawPredeployMetadata } from "../common/feature-detection/fetchRawPredeployMetadata";
import { fetchContractMetadata } from "../common/fetchContractMetadata";

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
  contractUri?: string,
  encodedConstructorArgs?: string,
): Promise<string | string[]> {
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
      invariant(contractUri, "No contract URI provided");
      const rawMeta = await fetchRawPredeployMetadata(contractUri, storage);
      const metadataUri = rawMeta.compilers?.zksolc?.metadataUri;

      invariant(metadataUri, "ZkSolc metadata not found");
      const parsedMetadata = await fetchContractMetadata(metadataUri, storage);

      compilerMetadata = {
        name: rawMeta.name,
        abi: parsedMetadata.abi,
        metadata: parsedMetadata,
        zk_version: rawMeta.zk_version,
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
      settings: compilerMetadata.metadata.settings,
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
      return data.result;
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
    return "";
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

      return decoded[2];
    } else {
      // TODO: decode for create2 deployments via factory
      return "";
    }
  } else {
    // Could not retrieve constructor parameters, using empty parameters as fallback
    return "";
  }
}
