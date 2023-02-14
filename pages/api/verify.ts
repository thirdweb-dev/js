import { Chain, Polygon, allChains } from "@thirdweb-dev/chains";
import {
  Abi,
  ChainId,
  extractConstructorParamsFromAbi,
  fetchSourceFilesFromMetadata,
  resolveContractUriFromAddress,
} from "@thirdweb-dev/sdk/evm";
import { ethers, utils } from "ethers";
import { getDashboardChainRpc } from "lib/rpc";
import { StorageSingleton, getEVMThirdwebSDK } from "lib/sdk";
import { NextApiRequest, NextApiResponse } from "next";

interface VerifyPayload {
  contractAddress: string;
  chainId: ChainId;
}

const RequestStatus = {
  OK: "1",
  NOTOK: "0",
};

export const VerificationStatus = {
  FAILED: "Fail - Unable to verify",
  SUCCESS: "Pass - Verified",
  PENDING: "Pending in queue",
  ALREADY_VERIFIED: "Contract source code already verified",
  AUTOMATICALLY_VERIFIED: "Already Verified",
};

export const apiMap: Record<number, string> = {
  1: "https://api.etherscan.io/api",
  3: "https://api-ropsten.etherscan.io/api",
  5: "https://api-goerli.etherscan.io/api",
  10: "https://api-optimistic.etherscan.io/api",
  25: "https://api.cronoscan.com/api",
  42: "https://api-kovan.etherscan.io/api",
  56: "https://api.bscscan.com/api",
  97: "https://api-testnet.bscscan.com/api",
  128: "https://api.hecoinfo.com/api",
  137: "https://api.polygonscan.com/api",
  199: "https://api.bttcscan.com/api",
  250: "https://api.ftmscan.com/api",
  256: "https://api-testnet.hecoinfo.com/api",
  420: "https://api-goerli-optimistic.etherscan.io/api",
  1029: "https://api-testnet.bttcscan.com/api",
  1284: "https://api-moonbeam.moonscan.io/api",
  1285: "https://api-moonriver.moonscan.io/api",
  1287: "https://api-moonbase.moonscan.io/api",
  4002: "https://api-testnet.ftmscan.com/api",
  42161: "https://api.arbiscan.io/api",
  43113: "https://api-testnet.snowtrace.io/api",
  43114: "https://api.snowtrace.io/api",
  421613: "https://api-goerli.arbiscan.io/api",
  80001: "https://api-testnet.polygonscan.com/api",
  1313161554: "https://api.aurorascan.dev/api",
  1313161555: "https://api-testnet.aurorascan.dev/api",
};

export const blockExplorerMap: Record<number, { name: string; url: string }> = {
  1: { name: "Etherscan", url: "https://etherscan.io/" },
  3: { name: "Ropsten Etherscan", url: "https://ropsten.etherscan.io/" },
  5: { name: "Goerli Etherscan", url: "https://goerli.etherscan.io/" },
  10: {
    name: "Optimism Etherscan",
    url: "https://optimistic.etherscan.io/",
  },
  42: { name: "Kovan Etherscan", url: "https://kovan.etherscan.io/" },
  56: { name: "Bscscan", url: "https://bscscan.com/" },
  420: {
    name: "Optimism Goerli Etherscan",
    url: "https://goerli-optimistic.etherscan.io/",
  },
  97: { name: "Bscscan Testnet", url: "https://testnet.bscscan.com/" },
  137: { name: "Polygonscan", url: "https://polygonscan.com/" },
  250: { name: "FTMScan", url: "https://ftmscan.com/" },
  4002: { name: "FTMScan Testnet", url: "https://testnet.ftmscan.com/" },
  42161: { name: "Arbiscan", url: "https://arbiscan.io/" },
  43113: { name: "Snowtrace Testnet", url: "https://testnet.snowtrace.io/" },
  43114: { name: "Snowtrace", url: "https://snowtrace.io/" },
  421613: {
    name: "Arbiscan Goerli",
    url: "https://goerli-rollup-explorer.arbitrum.io/",
  },
  80001: {
    name: "Mumbai Polygonscan",
    url: "https://mumbai.polygonscan.com/",
  },
};

export const apiKeyMap: Record<number, string> = {
  [ChainId.Mainnet]: process.env.ETHERSCAN_KEY as string,
  [ChainId.Goerli]: process.env.ETHERSCAN_KEY as string,
  [ChainId.Polygon]: process.env.POLYGONSCAN_KEY as string,
  [ChainId.Mumbai]: process.env.POLYGONSCAN_KEY as string,
  [ChainId.Fantom]: process.env.FANTOMSCAN_KEY as string,
  [ChainId.FantomTestnet]: process.env.FANTOMSCAN_KEY as string,
  [ChainId.Avalanche]: process.env.SNOWTRACE_KEY as string,
  [ChainId.AvalancheFujiTestnet]: process.env.SNOWTRACE_KEY as string,
  [ChainId.Arbitrum]: process.env.ARBITRUMSCAN_KEY as string,
  [ChainId.ArbitrumGoerli]: process.env.ARBITRUMSCAN_KEY as string,
  [ChainId.Optimism]: process.env.OPTIMISMSCAN_KEY as string,
  [ChainId.OptimismGoerli]: process.env.OPTIMISMSCAN_KEY as string,
  [ChainId.BinanceSmartChainMainnet]: process.env.BSCSCAN_KEY as string,
  [ChainId.BinanceSmartChainTestnet]: process.env.BSCSCAN_KEY as string,
};

const chhainIdToChain: Record<number, Chain> = allChains.reduce(
  (acc, chain) => {
    acc[chain.chainId] = chain;
    return acc;
  },
  {} as Record<number, Chain>,
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "invalid method" });
  }

  try {
    const { contractAddress, chainId } = req.body as VerifyPayload;

    const endpoint: string | undefined = apiMap[chainId];

    if (!endpoint) {
      throw new Error(
        `ChainId ${chainId} is not supported for etherscan verification`,
      );
    }

    const chain = chhainIdToChain[chainId];
    if (!chain) {
      throw new Error(
        `ChainId ${chainId} is not supported for etherscan verification`,
      );
    }

    const sdk = getEVMThirdwebSDK(chain.chainId, getDashboardChainRpc(chain));
    const compilerMetadata = await sdk
      .getPublisher()
      .fetchCompilerMetadataFromAddress(contractAddress);
    const compilerVersion = compilerMetadata.metadata.compiler.version;

    const sources = await fetchSourceFilesFromMetadata(
      compilerMetadata,
      StorageSingleton,
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
      contractAddress,
      chainId,
      compilerMetadata.abi,
      sdk.getProvider(),
    );

    const requestBody: Record<string, string> = {
      apikey: apiKeyMap[chainId],
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
    const result = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: parameters.toString(),
    });

    const data = await result.json();
    if (data.status === RequestStatus.OK) {
      return res.status(200).json({ guid: data.result });
    } else {
      return res.status(200).json({ error: data.result });
    }
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: (e as any).toString() });
  }
};

/**
 * Fetch the deploy transaction from the given contract address and extract the encoded constructor parameters
 * @param contractAddress
 * @param chainId
 * @param abi
 */
async function fetchConstructorParams(
  contractAddress: string,
  chainId: ChainId,
  abi: Abi,
  provider: ethers.providers.Provider,
): Promise<string> {
  const constructorParamTypes = extractConstructorParamsFromAbi(abi);
  if (constructorParamTypes.length === 0) {
    return "";
  }
  const requestBody = {
    apiKey: apiKeyMap[chainId],
    module: "account",
    action: "txlist",
    address: contractAddress,
    page: "1",
    sort: "asc",
    offset: "1",
  };
  const parameters = new URLSearchParams({ ...requestBody });
  const result = await fetch(apiMap[chainId], {
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

    // first: attempt to get it from Release
    try {
      const bytecode = await fetchDeployBytecodeFromReleaseMetadata(
        contractAddress,
        provider,
      );

      if (bytecode) {
        // contract was realeased, use the deployable bytecode method (proper solution)
        const bytecodeHex = bytecode.startsWith("0x")
          ? bytecode
          : `0x${bytecode}`;

        constructorArgs = txDeployBytecode.substring(bytecodeHex.length);
      }
    } catch (e) {
      // contracts not released through thirdweb
    }

    // second: attempt to decode it from solc metadata bytecode
    if (!constructorArgs) {
      // couldn't find bytecode from release, using regex to locate consturctor args thruogh solc metadata
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
        "Verifying this contract requires a release. Run `npx thirdweb release` to create a release for this contract, then try again.",
      );
    }

    return constructorArgs;
  } else {
    // Could not retrieve constructor parameters, using empty parameters as fallback
    return "";
  }
}

/**
 * Fetches the release metadata on the ContractPublisher registry (on polygon) for the given contract address (on any chain)
 * @param contractAddress
 * @param provider
 * @returns
 */
async function fetchDeployBytecodeFromReleaseMetadata(
  contractAddress: string,
  provider: ethers.providers.Provider,
): Promise<string | undefined> {
  const compialierMetaUri = await resolveContractUriFromAddress(
    contractAddress,
    provider,
  );
  if (compialierMetaUri) {
    const pubmeta = await getEVMThirdwebSDK(
      Polygon.chainId,
      getDashboardChainRpc(Polygon),
    )
      .getPublisher()
      .resolvePublishMetadataFromCompilerMetadata(compialierMetaUri);
    return pubmeta.length > 0
      ? await (await StorageSingleton.download(pubmeta[0].bytecodeUri)).text()
      : undefined;
  }
  return undefined;
}

export default handler;
