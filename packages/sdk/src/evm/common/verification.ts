import invariant from "tiny-invariant";
import { ThirdwebSDK } from "../core";
import { allChains } from "@thirdweb-dev/chains";
import {
  extractConstructorParamsFromAbi,
  fetchSourceFilesFromMetadata,
  resolveContractUriFromAddress,
} from ".";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { Abi } from "../schema";
import { ethers, utils } from "ethers";
import { getChainProvider } from "../constants";
import { EtherscanResult } from "../types/verification";
import fetch from "cross-fetch";

//
// ==================================
// ======== Core Functions ==========
// ==================================
//

export async function isVerifiedOnEtherscan(
  contractAddress: string,
  api: string,
  apiKey: string,
): Promise<boolean> {
  const endpoint = `${api}?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}"`;

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

export async function verify(
  contractAddress: string,
  chainId: number,
  api: string,
  apiKey: string,
  storage: ThirdwebStorage,
) {
  try {
    const rpcUrl = allChains.find((chain) => chain.chainId === chainId)?.rpc[0];
    invariant(rpcUrl, "RPC URL not found");

    const sdk = new ThirdwebSDK(rpcUrl);
    const compilerMetadata = await sdk
      .getPublisher()
      .fetchCompilerMetadataFromAddress(contractAddress);
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

    const encodedConstructorArgs = await fetchConstructorParams(
      api,
      apiKey,
      contractAddress,
      chainId,
      compilerMetadata.abi,
      sdk.getProvider(),
      storage,
    );

    const requestBody: Record<string, string> = {
      apikey: apiKey,
      module: "contract",
      action: "verifysourcecode",
      contractaddress: contractAddress,
      sourceCode: JSON.stringify(compilerInput),
      codeformat: "solidity-standard-json-input",
      contractname: `${contractPath}:${compilerMetadata.name}`,
      compilerversion: `v${compilerVersion}`,
      constructorArguements: encodedConstructorArgs,
    };

    const parameters = new URLSearchParams({ ...requestBody });
    const result = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: parameters.toString(),
    });

    const data = await result.json();
    if (data.status === "1") {
      return { guid: data.result };
    } else {
      return { error: data.result };
    }
  } catch (e) {
    console.error(e);
  }
}

export async function checkVerificationStatus(
  api: string,
  apiKey: string,
  guid: string | string[],
) {
  const endpoint = `${api}?module=contract&action=checkverifystatus&guid=${guid}&apikey=${apiKey}"`;

  try {
    const result = await fetch(endpoint, {
      method: "GET",
    });

    const data = await result.json();
    if (data.status === "1") {
      return data.result;
    } else {
      return data.result;
    }
  } catch (e) {
    console.error(e);
  }
}

//
// ==================================
// ======== Helper Functions ========
// ==================================
//

/**
 * Fetch the deploy transaction from the given contract address and extract the encoded constructor parameters
 * @param contractAddress
 * @param chainId
 * @param abi
 */
async function fetchConstructorParams(
  api: string,
  apiKey: string,
  contractAddress: string,
  chainId: number,
  abi: Abi,
  provider: ethers.providers.Provider,
  storage: ThirdwebStorage,
): Promise<string> {
  const constructorParamTypes = extractConstructorParamsFromAbi(abi);
  if (constructorParamTypes.length === 0) {
    return "";
  }
  const requestBody = {
    apiKey: apiKey,
    module: "account",
    action: "txlist",
    address: contractAddress,
    page: "1",
    sort: "asc",
    offset: "1",
  };
  const parameters = new URLSearchParams({ ...requestBody });
  const result = await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: parameters.toString(),
  });
  const data = await result.json();
  if (
    data &&
    // data.status === RequestStatus.OK &&
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
        chainId,
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
      ethers.utils.defaultAbiCoder.decode(
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
 * Fetches the Publish metadata on the ContractPublisher registry (on polygon) for the given contract address (on any chain)
 * @param contractAddress
 * @param provider
 * @returns
 */
async function fetchDeployBytecodeFromPublishedContractMetadata(
  chainId: number,
  contractAddress: string,
  provider: ethers.providers.Provider,
  storage: ThirdwebStorage,
): Promise<string | undefined> {
  const compialierMetaUri = await resolveContractUriFromAddress(
    contractAddress,
    provider,
  );
  if (compialierMetaUri) {
    const pubmeta = await new ThirdwebSDK(getChainProvider(chainId, {}))
      .getPublisher()
      .resolvePublishMetadataFromCompilerMetadata(compialierMetaUri);
    return pubmeta.length > 0
      ? await (await storage.download(pubmeta[0].bytecodeUri)).text()
      : undefined;
  }
  return undefined;
}
