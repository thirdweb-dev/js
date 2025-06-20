import { download } from "../../storage/download.js";
import { extractIPFSUri } from "../../utils/bytecode/extractIPFS.js";
import { resolveImplementation } from "../../utils/bytecode/resolveImplementation.js";
import { formatCompilerMetadata } from "../actions/compiler-metadata.js";
import type { ThirdwebContract } from "../contract.js";
import { fetchConstructorParams } from "./constructor-params.js";
import { fetchSourceFilesFromMetadata } from "./source-files.js";

const RequestStatus = {
  NOTOK: "0",
  OK: "1",
};

/**
 * @contract
 */
type VerifyContractOptions = {
  contract: ThirdwebContract;
  explorerApiUrl: string;
  explorerApiKey: string;
  encodedConstructorArgs?: string;
  type?: "etherscan" | "blockscoutV1" | "blockscoutV2" | "routescan";
};

/**
 * Verifies a contract by performing the following steps:
 * 1. Resolves the implementation of the contract.
 * 2. Extracts the IPFS URI from the contract bytecode.
 * 3. Downloads the contract source code from the IPFS URI.
 * 4. Fetches the source files from the compiler metadata.
 * 5. Compiles the contract source code using the Solidity compiler.
 * 6. Fetches the constructor parameters if not provided.
 * 7. Sends a request to the contract verification API to verify the contract source code.
 * @param options - The options for contract verification.
 * @returns A promise that resolves to the verification result.
 * @throws An error if any of the verification steps fail.
 * @example
 * ```ts
 * import { getContract } from "thirdweb/contract";
 * import { verifyContract } from "thirdweb/contract";
 *
 * const contract = getContract({ ... });
 * const verificationResult = await verifyContract({
 *  contract,
 *  explorerApiUrl: "https://api.polygonscan.com/api",
 *  explorerApiKey: "YOUR_API_KEY",
 * });
 * console.log(verificationResult);
 * ```
 * @contract
 */
export async function verifyContract(
  options: VerifyContractOptions,
): Promise<string | string[]> {
  const implementation = await resolveImplementation(options.contract);
  const ipfsUri = extractIPFSUri(implementation.bytecode);
  if (!ipfsUri) {
    throw new Error(
      "Contract bytecode does not contain IPFS URI, cannot verify",
    );
  }
  const res = await download({
    client: options.contract.client,
    uri: ipfsUri,
  });
  const compilerMetadata = formatCompilerMetadata(await res.json());

  const sources = await fetchSourceFilesFromMetadata({
    client: options.contract.client,
    publishedMetadata: compilerMetadata,
  });

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

  const compilerInput = {
    language: "Solidity",
    settings: {
      evmVersion: compilerMetadata.metadata.settings.evmVersion,
      optimizer: compilerMetadata.metadata.settings.optimizer,
      outputSelection: {
        "*": {
          "": ["ast"],
          "*": [
            "abi",
            "evm.bytecode",
            "evm.deployedBytecode",
            "evm.methodIdentifiers",
            "metadata",
          ],
        },
      },
      remappings: compilerMetadata.metadata.settings.remappings,
    },
    sources: sourcesWithContents,
  };

  const compilationTarget =
    compilerMetadata.metadata.settings.compilationTarget;
  const targets = Object.keys(compilationTarget);
  const contractPath = targets[0];

  if (options.type === "blockscoutV2") {
    const metadataBlob = new Blob([JSON.stringify(compilerInput)], {
      type: "application/json",
    });
    const formData = new FormData();
    formData.append("address_hash", options.contract.address);
    formData.append(
      "contract_name",
      `${contractPath}:${compilerMetadata.name}`,
    );
    formData.append(
      "compiler_version",
      `v${compilerMetadata.metadata.compiler.version}`,
    );
    formData.append("autodetect_constructor_args", "true");
    formData.append("files[0]", metadataBlob, "metadata.json");

    const result = await fetch(
      `${options.explorerApiUrl}/v2/smart-contracts/${options.contract.address.toLowerCase()}/verification/via/standard-input`,
      {
        body: formData,
        method: "POST",
      },
    );
    const data = await result.json();

    if (data.message) {
      return data.message;
    }
    throw new Error(`${data}`);
  }
  const encodedArgs = options.encodedConstructorArgs
    ? options.encodedConstructorArgs
    : await fetchConstructorParams({
        abi: compilerMetadata?.metadata?.output?.abi || [],
        contract: options.contract,
        explorerApiKey: options.explorerApiKey,
        explorerApiUrl: options.explorerApiUrl,
      });

  const requestBody: Record<string, string> = {
    action: "verifysourcecode",
    apikey: options.explorerApiKey,
    codeformat: "solidity-standard-json-input",
    compilerversion: `v${compilerMetadata.metadata.compiler.version}`,
    constructorArguements: encodedArgs,
    contractaddress: options.contract.address,
    contractname: `${contractPath}:${compilerMetadata.name}`,
    module: "contract",
    sourceCode: JSON.stringify(compilerInput),
  };

  const parameters = new URLSearchParams({ ...requestBody });
  const result = await fetch(options.explorerApiUrl, {
    body: parameters.toString(),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST",
  });
  const data = await result.json();
  if (data.status === RequestStatus.OK) {
    return data.result;
  }
  throw new Error(`${data.result}`);
}

const VerificationStatus = {
  ALREADY_VERIFIED: "Contract source code already verified",
  AUTOMATICALLY_VERIFIED: "Already Verified",
  FAILED: "Fail - Unable to verify",
  IN_PROGRESS: "In progress",
  PENDING: "Pending in queue",
  SUCCESS: "Pass - Verified",
};

type CheckVerificationStatusOptions = {
  explorerApiUrl: string;
  explorerApiKey: string;
  guid: string | string[];
};

/**
 * Checks the verification status of a contract.
 * @param options - The options for checking the verification status.
 * @returns A promise that resolves with the verification status data.
 * @throws An error if the verification status check fails.
 * @example
 * ```ts
 * import { checkVerificationStatus } from "thirdweb/contract";
 * const verificationStatus = await checkVerificationStatus({
 *  explorerApiUrl: "https://api.polygonscan.com/api",
 *  explorerApiKey: "YOUR_API_KEY",
 *  guid: "YOUR_GUID",
 * });
 * console.log(verificationStatus);
 * ```
 * @contract
 */
export async function checkVerificationStatus(
  options: CheckVerificationStatusOptions,
): Promise<unknown> {
  const endpoint = `${options.explorerApiUrl}?module=contract&action=checkverifystatus&guid=${options.guid}&apikey=${options.explorerApiKey}"`;
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(async () => {
      try {
        const result = await fetch(endpoint, {
          method: "GET",
        });

        const data = await result.json();

        if (
          data?.result !== VerificationStatus.PENDING &&
          data?.result !== VerificationStatus.IN_PROGRESS
        ) {
          clearInterval(intervalId);
          resolve(data);
        }
      } catch (e) {
        clearInterval(intervalId);
        reject(e);
      }
    }, 3000);
  });
}
