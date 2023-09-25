import { isContractDeployed } from "./any-evm-utils/isContractDeployed";
import { getEncodedConstructorParamsForThirdwebContract } from "./any-evm-utils/getEncodedConstructorParamsForThirdwebContract";
import { getThirdwebContractAddress } from "./any-evm-utils/getThirdwebContractAddress";
import { extractConstructorParamsFromAbi } from "./feature-detection/extractConstructorParamsFromAbi";
import { resolveContractUriFromAddress } from "./feature-detection/resolveContractUriFromAddress";
import { fetchSourceFilesFromMetadata } from "./fetchSourceFilesFromMetadata";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { Abi } from "../schema/contracts/custom";
import { Contract, utils, providers } from "ethers";
import { EtherscanResult, VerificationStatus } from "../types/verification";
import fetch from "cross-fetch";
import { ConstructorParamMap } from "../types/any-evm/deploy-data";
import { getChainProvider } from "../constants/urls";
import invariant from "tiny-invariant";
import { fetchContractMetadataFromAddress } from "./metadata-resolver";
import type { ContractPublisher } from "@thirdweb-dev/contracts-js";
import ContractPublisherAbi from "@thirdweb-dev/contracts-js/dist/abis/ContractPublisher.json";
import { fetchExtendedReleaseMetadata } from "./feature-detection/fetchExtendedReleaseMetadata";
import { getContractPublisherAddress } from "../constants/addresses/getContractPublisherAddress";

const RequestStatus = {
  OK: "1",
  NOTOK: "0",
};

//
// ==================================
// ======== Core Functions ==========
// ==================================
//

/**
 * @public
 *
 * Verifies a Thirdweb Prebuilt Contract, e.g. Marketplace, DropERC721, etc
 *
 * @example
 * ```javascript
 *
 * const explorerAPIUrl = "" // e.g. https://api.etherscan.io/api
 * const explorerAPIKey = "" // Generate API key on the explorer
 * const chainId = 1 // Change according to the network
 *
 * await sdk.verifier.verifyThirdwebPrebuiltImplementation(
 *   "DropERC721",
 *   chainId,
 *   explorerAPIUrl,
 *   explorerAPIKey,
 *   storage // this could be used from the SDK instance, e.g. sdk.storage
 * );
 * ```
 * @param contractName
 * @param chainId
 * @param explorerAPIUrl
 * @param explorerAPIKey
 * @param storage
 */
export async function verifyThirdwebPrebuiltImplementation(
  contractName: string,
  chainId: number,
  explorerAPIUrl: string,
  explorerAPIKey: string,
  storage: ThirdwebStorage,
  contractVersion: string = "latest",
  clientId?: string,
  secretKey?: string,
  constructorArgs?: ConstructorParamMap,
): Promise<string | string[]> {
  const [contractAddress, encodedArgs] = await Promise.all([
    getThirdwebContractAddress(
      contractName,
      chainId,
      storage,
      contractVersion,
      clientId,
      secretKey,
    ),
    getEncodedConstructorParamsForThirdwebContract(
      contractName,
      chainId,
      storage,
      contractVersion,
      clientId,
      secretKey,
      constructorArgs,
    ),
  ]);

  console.info(`Verifying ${contractName} at address ${contractAddress}`);

  const guid = await verify(
    contractAddress,
    chainId,
    explorerAPIUrl,
    explorerAPIKey,
    storage,
    encodedArgs?.toString().replace("0x", ""),
  );

  return guid;
}

/**
 * @public
 *
 * Verifies any contract
 *
 * @example
 * ```javascript
 *
 * const contractAddress = ""
 * const explorerAPIUrl = "" // e.g. https://api.etherscan.io/api
 * const explorerAPIKey = "" // Generate API key on the explorer
 * const chainId = 1 // Change according to the network
 *
 * await sdk.verifier.verify(
 *   contractAddress,
 *   chainId,
 *   explorerAPIUrl,
 *   explorerAPIKey,
 *   storage // this could be used from the SDK instance, e.g. sdk.storage
 * );
 * ```
 * @param contractAddress
 * @param chainId
 * @param explorerAPIUrl
 * @param explorerAPIKey
 * @param storage
 */
export async function verify(
  contractAddress: string,
  chainId: number,
  explorerAPIUrl: string,
  explorerAPIKey: string,
  storage: ThirdwebStorage,
  encodedConstructorArgs?: string,
): Promise<string | string[]> {
  try {
    const provider = getChainProvider(chainId, {});
    const compilerMetadata = await fetchContractMetadataFromAddress(
      contractAddress,
      provider,
      storage,
    );

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

    const encodedArgs = encodedConstructorArgs
      ? encodedConstructorArgs
      : await fetchConstructorParams(
          explorerAPIUrl,
          explorerAPIKey,
          contractAddress,
          compilerMetadata.abi,
          provider,
          storage,
        );

    const requestBody: Record<string, string> = {
      apikey: explorerAPIKey,
      module: "contract",
      action: "verifysourcecode",
      contractaddress: contractAddress,
      sourceCode: JSON.stringify(compilerInput),
      codeformat: "solidity-standard-json-input",
      contractname: `${contractPath}:${compilerMetadata.name}`,
      compilerversion: `v${compilerVersion}`,
      constructorArguements: encodedArgs,
    };

    const parameters = new URLSearchParams({ ...requestBody });
    const result = await fetch(explorerAPIUrl, {
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
  } catch (e: any) {
    throw new Error(e.toString());
  }
}

//
// ==================================
// ======== Helper Functions ========
// ==================================
//

/**
 * @internal
 *
 * Check status of the contract submitted for verification to the explorer
 * @param explorerAPIUrl
 * @param explorerAPIKey
 * @param guid
 */
export async function checkVerificationStatus(
  explorerAPIUrl: string,
  explorerAPIKey: string,
  guid: string | string[],
) {
  const endpoint = `${explorerAPIUrl}?module=contract&action=checkverifystatus&guid=${guid}&apikey=${explorerAPIKey}"`;
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

/**
 * @internal
 *
 * Check if the contract is already verified on etherscan
 * @param contractAddress
 * @param chainId
 * @param explorerAPIUrl
 * @param explorerAPIKey
 * ClientId get from https://thirdweb.com/create-api-key
 * @param clientId
 */
export async function isVerifiedOnEtherscan(
  contractAddress: string,
  chainId: number,
  explorerAPIUrl: string,
  explorerAPIKey: string,
  clientId?: string,
): Promise<boolean> {
  const provider = getChainProvider(chainId, {
    clientId,
  });
  invariant(
    await isContractDeployed(contractAddress, provider),
    "Contract not deployed yet.",
  );
  const endpoint = `${explorerAPIUrl}?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${explorerAPIKey}"`;

  try {
    const result = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    const data = await result.json();
    const etherscanResult = data.result[0] as EtherscanResult;
    if (etherscanResult.ABI === "Contract source code not verified") {
      return false;
    }
    return true;
  } catch (e) {
    throw new Error(
      `Error checking verification for contract ${contractAddress}: ${e}`,
    );
  }
}

/**
 * @internal
 *
 * Fetch the deploy transaction from the given contract address and extract the encoded constructor parameters
 * @param explorerAPIUrl
 * @param explorerAPIKey
 * @param contractAddress
 * @param abi
 * @param provider
 * @param storage
 */
async function fetchConstructorParams(
  explorerAPIUrl: string,
  explorerAPIKey: string,
  contractAddress: string,
  abi: Abi,
  provider: providers.Provider,
  storage: ThirdwebStorage,
): Promise<string> {
  const constructorParamTypes = extractConstructorParamsFromAbi(abi);
  if (constructorParamTypes.length === 0) {
    return "";
  }
  const requestBody = {
    apiKey: explorerAPIKey,
    module: "account",
    action: "txlist",
    address: contractAddress,
    page: "1",
    sort: "asc",
    offset: "1",
  };
  const parameters = new URLSearchParams({ ...requestBody });
  const result = await fetch(explorerAPIUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: parameters.toString(),
  });
  const data = await result.json();
  if (
    data &&
    data.status === RequestStatus.OK &&
    data.result[0] !== undefined
  ) {
    const contract = new utils.Interface(abi);
    const txDeployBytecode = data.result[0].input;
    let constructorArgs = "";

    if (contract.deploy.inputs.length === 0) {
      return "";
    }

    // first: attempt to get it from Publish
    try {
      const bytecode = await fetchDeployBytecodeFromPublishedContractMetadata(
        contractAddress,
        provider,
        storage,
      );

      if (bytecode) {
        // contract was realeased, use the deployable bytecode method (proper solution)
        const bytecodeHex = bytecode.startsWith("0x")
          ? bytecode
          : `0x${bytecode}`;

        constructorArgs = txDeployBytecode.substring(bytecodeHex.length);
      }
    } catch (e) {
      // contracts not published through thirdweb
    }

    // second: attempt to decode it from solc metadata bytecode
    if (!constructorArgs) {
      // couldn't find bytecode from Publish, using regex to locate consturctor args thruogh solc metadata
      // https://docs.soliditylang.org/en/v0.8.17/metadata.html#encoding-of-the-metadata-hash-in-the-bytecode
      // {6} = solc version
      // {4} = 0033, but noticed some contracts have values other than 00 33. (uniswap)
      const matches = [
        ...txDeployBytecode.matchAll(
          /(64736f6c6343[\w]{6}[\w]{4})(?!.*\1)(.*)$/g,
        ),
      ];

      // regex finds the LAST occurence of solc metadata bytes, result always in same position
      if (matches.length > 0) {
        // TODO: we currently don't handle error string embedded in the bytecode, need to strip ascii (upgradeableProxy) in patterns[2]
        // https://etherscan.io/address/0xee6a57ec80ea46401049e92587e52f5ec1c24785#code
        constructorArgs = matches[0][2];
      }
    }

    // third: attempt to guess it from the ABI inputs
    if (!constructorArgs) {
      // TODO: need to guess array / struct properly
      const constructorParamByteLength = constructorParamTypes.length * 64;
      constructorArgs = txDeployBytecode.substring(
        txDeployBytecode.length - constructorParamByteLength,
      );
    }

    try {
      // sanity check that the constructor params are valid
      // TODO: should we sanity check after each attempt?
      utils.defaultAbiCoder.decode(
        contract.deploy.inputs,
        `0x${constructorArgs}`,
      );
    } catch (e) {
      throw new Error(
        "Verifying this contract requires it to be published. Run `npx thirdweb publish` to publish this contract, then try again.",
      );
    }

    return constructorArgs;
  } else {
    // Could not retrieve constructor parameters, using empty parameters as fallback
    return "";
  }
}

/**
 * @internal
 *
 * Fetches the Publish metadata on the ContractPublisher registry (on polygon) for the given contract address (on any chain)
 * @param contractAddress
 * @param provider
 * @param storage
 * @returns
 */
async function fetchDeployBytecodeFromPublishedContractMetadata(
  contractAddress: string,
  provider: providers.Provider,
  storage: ThirdwebStorage,
): Promise<string | undefined> {
  const compilerMetaUri = await resolveContractUriFromAddress(
    contractAddress,
    provider,
  );
  if (compilerMetaUri) {
    const contract = new Contract(
      getContractPublisherAddress(),
      ContractPublisherAbi,
      getChainProvider("polygon", {}),
    ) as ContractPublisher;

    const publishedMetadataUri = await contract.getPublishedUriFromCompilerUri(
      compilerMetaUri,
    );
    if (publishedMetadataUri.length === 0) {
      throw Error(
        `Could not resolve published metadata URI from ${compilerMetaUri}`,
      );
    }
    const pubmeta = await Promise.all(
      publishedMetadataUri
        .filter((uri) => uri.length > 0)
        .map((uri) => fetchExtendedReleaseMetadata(uri, storage)),
    );

    return pubmeta.length > 0
      ? await (await storage.download(pubmeta[0].bytecodeUri)).text()
      : undefined;
  }
  return undefined;
}
