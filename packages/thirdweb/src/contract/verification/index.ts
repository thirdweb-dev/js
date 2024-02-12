import { download } from "../../storage/download.js";
import { extractIPFSUri } from "../../utils/bytecode/extractIPFS.js";
import { resolveImplementation } from "../../utils/bytecode/resolveImplementation.js";
import type { ThirdwebContract } from "../contract.js";
import { formatCompilerMetadata } from "../actions/compiler-metadata.js";
import { fetchConstructorParams } from "./constructor-params.js";
import { fetchSourceFilesFromMetadata } from "./source-files.js";
import type { Chain } from "../../chain/index.js";
import type { ThirdwebClient } from "../../client/client.js";

const RequestStatus = {
  OK: "1",
  NOTOK: "0",
};

export type VerifyContractOptions = {
  contract: ThirdwebContract;
  explorerApiUrl: string;
  explorerApiKey: string;
  encodedConstructorArgs?: string;
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
 * import { verifyContract } from "thirdweb/contract/verification";
 *
 * const contract = getContract({ ... });
 * const verificationResult = await verifyContract({
 *  contract,
 *  explorerApiUrl: "https://api.polygonscan.com/api",
 *  explorerApiKey: "YOUR_API_KEY",
 * });
 * console.log(verificationResult);
 * ```
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
    uri: ipfsUri,
    client: options.contract.client,
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
    sources: sourcesWithContents,
    settings: {
      optimizer: compilerMetadata.metadata.settings.optimizer,
      evmVersion: compilerMetadata.metadata.settings.evmVersion,
      remappings: compilerMetadata.metadata.settings.remappings,
      outputSelection: {
        "*": {
          "*": [
            "abi",
            "evm.bytecode",
            "evm.deployedBytecode",
            "evm.methodIdentifiers",
            "metadata",
          ],
          "": ["ast"],
        },
      },
    },
  };

  const compilationTarget =
    compilerMetadata.metadata.settings.compilationTarget;
  const targets = Object.keys(compilationTarget);
  const contractPath = targets[0];

  const encodedArgs = options.encodedConstructorArgs
    ? options.encodedConstructorArgs
    : await fetchConstructorParams({
        abi: compilerMetadata?.metadata?.output?.abi || [],
        contract: options.contract,
        explorerApiUrl: options.explorerApiUrl,
        explorerApiKey: options.explorerApiKey,
      });

  const requestBody: Record<string, string> = {
    apikey: options.explorerApiKey,
    module: "contract",
    action: "verifysourcecode",
    contractaddress: options.contract.address,
    sourceCode: JSON.stringify(compilerInput),
    codeformat: "solidity-standard-json-input",
    contractname: `${contractPath}:${compilerMetadata.name}`,
    compilerversion: `v${compilerMetadata.metadata.compiler.version}`,
    constructorArguements: encodedArgs,
  };

  const parameters = new URLSearchParams({ ...requestBody });
  const result = await fetch(options.explorerApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: parameters.toString(),
  });

  const data = await result.json();
  if (data.status === RequestStatus.OK) {
    return data.result;
  } else {
    throw new Error(`${data.result}`);
  }
}

const VerificationStatus = {
  FAILED: "Fail - Unable to verify",
  SUCCESS: "Pass - Verified",
  PENDING: "Pending in queue",
  ALREADY_VERIFIED: "Contract source code already verified",
  AUTOMATICALLY_VERIFIED: "Already Verified",
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
 * import { checkVerificationStatus } from "thirdweb/contract/verification";
 * const verificationStatus = await checkVerificationStatus({
 *  explorerApiUrl: "https://api.polygonscan.com/api",
 *  explorerApiKey: "YOUR_API_KEY",
 *  guid: "YOUR_GUID",
 * });
 * console.log(verificationStatus);
 * ```
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

        if (data?.result !== VerificationStatus.PENDING) {
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

export type VerifyThirdwebContractOptions = {
  client: ThirdwebClient;
  chain: Chain;
  explorerApiUrl: string;
  explorerApiKey: string;
  contractName: string;
  contractVersion?: string;
  encodedConstructorArgs?: string;
};

// /**
//  *
//  * @internal
//  */
// export async function verifyThirdwebContract(
//   options: VerifyThirdwebContractOptions,
// ): Promise<string | string[]> {
//   const contractAddress =
// }
