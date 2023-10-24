import { Base, BaseGoerli, Chain, Sepolia } from "@thirdweb-dev/chains";
import {
  ChainId,
  fetchContractMetadataFromAddress,
  getEncodedConstructorParamsForThirdwebContract,
  verify,
} from "@thirdweb-dev/sdk";
import { apiKeyMap, apiMap } from "lib/maps";
import { getDashboardChainRpc } from "lib/rpc";
import { StorageSingleton, getEVMThirdwebSDK } from "lib/sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { fetchAllChains } from "utils/fetchChain";

interface VerifyPayload {
  contractAddress: string;
  chainId: ChainId;
}

export const VerificationStatus = {
  FAILED: "Fail - Unable to verify",
  SUCCESS: "Pass - Verified",
  PENDING: "Pending in queue",
  ALREADY_VERIFIED: "Contract source code already verified",
  AUTOMATICALLY_VERIFIED: "Already Verified",
};
export const blockExplorerMap: Record<number, { name: string; url: string }> = {
  1: { name: "Etherscan", url: "https://etherscan.io/" },
  3: { name: "Ropsten Etherscan", url: "https://ropsten.etherscan.io/" },
  5: { name: "Goerli Etherscan", url: "https://goerli.etherscan.io/" },
  [Sepolia.chainId]: {
    name: "Sepolia Etherscan",
    url: "https://sepolia.etherscan.io/",
  },
  10: {
    name: "Optimism Etherscan",
    url: "https://optimistic.etherscan.io/",
  },
  42: { name: "Kovan Etherscan", url: "https://kovan.etherscan.io/" },
  56: { name: "Bscscan", url: "https://bscscan.com/" },
  420: {
    name: "Optimism Goerli Etherscan",
    url: "https://goerli-optimism.etherscan.io/",
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
  [Base.chainId]: {
    name: "Basescan",
    url: "https://basescan.org/",
  },
  [BaseGoerli.chainId]: {
    name: "Base Goerli Basescan",
    url: "https://goerli.basescan.org/",
  },
};

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
    const allChains = await fetchAllChains();
    const chainIdToChain: Record<number, Chain> = allChains.reduce(
      (acc, chain) => {
        acc[chain.chainId] = chain;
        return acc;
      },
      {} as Record<number, Chain>,
    );

    const chain = chainIdToChain[chainId];
    if (!chain) {
      throw new Error(
        `ChainId ${chainId} is not supported for etherscan verification`,
      );
    }

    const sdk = getEVMThirdwebSDK(chain.chainId, getDashboardChainRpc(chain));

    let encodedArgs;
    try {
      const metadata = await fetchContractMetadataFromAddress(
        contractAddress,
        sdk.getProvider(),
        StorageSingleton,
      );
      encodedArgs = await getEncodedConstructorParamsForThirdwebContract(
        metadata.name,
        chainId,
        StorageSingleton,
      );
    } catch (error) {} // eslint-disable-line no-empty

    const guid = await verify(
      contractAddress,
      chainId,
      apiMap[chainId],
      apiKeyMap[chainId],
      StorageSingleton,
      encodedArgs?.toString().replace("0x", ""),
    );

    return res.status(200).json({ guid });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: (e as any).toString() });
  }
};

export default handler;
