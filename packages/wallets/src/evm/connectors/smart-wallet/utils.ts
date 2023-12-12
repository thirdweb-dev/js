import {
  ChainOrRpcUrl,
  isContractDeployed,
  ThirdwebSDK,
} from "@thirdweb-dev/sdk";
import { BytesLike } from "ethers";
import { ENTRYPOINT_ADDRESS } from "./lib/constants";
import { EntryPoint__factory } from "@account-abstraction/contracts";

export type AccessibleSmartWallets = {
  owned: string;
  hasSignerRole: string[];
};

const sdkCache = new Map<ChainOrRpcUrl, ThirdwebSDK>();

function getSDK(chain: ChainOrRpcUrl): ThirdwebSDK {
  const cached = sdkCache.get(chain);
  if (cached) {
    return cached;
  }
  const sdk = new ThirdwebSDK(chain);
  sdkCache.set(chain, sdk);
  return sdk;
}

/**
 * Get all the signers added to the given smart wallet (excluding owner)
 * @param chain - The chain to use
 * @param factoryAddress - The factory address
 * @param smartWalletAddress - The smart wallet address
 * @returns The list of signers
 */
export async function getAllSigners(
  chain: ChainOrRpcUrl,
  factoryAddress: string,
  smartWalletAddress: string,
) {
  const readOnlySDK = getSDK(chain);
  const factoryContract = await readOnlySDK.getContract(factoryAddress);
  const signers = await factoryContract.call("getSignersOfAccount", [
    smartWalletAddress,
  ]);
  return signers;
}

/**
 * Get all the smart wallets associated with a personal wallet address
 * @param chain - The chain to use
 * @param factoryAddress - The factory address
 * @param personalWalletAddress - The personal wallet address
 * @returns The list of smart wallets
 */
export async function getAllSmartWallets(
  chain: ChainOrRpcUrl,
  factoryAddress: string,
  personalWalletAddress: string,
): Promise<AccessibleSmartWallets> {
  const readOnlySDK = getSDK(chain);
  const factoryContract = await readOnlySDK.getContract(factoryAddress);
  const ownedAccount = await getSmartWalletAddress(
    chain,
    factoryAddress,
    personalWalletAddress,
  );
  const accessibleAccounts: string[] = await factoryContract.call(
    "getAccountsOfSigner",
    [personalWalletAddress],
  );
  return {
    owned: ownedAccount,
    hasSignerRole: accessibleAccounts,
  };
}

/**
 * Check if a smart wallet is deployed for a given personal wallet address
 * @param chain - The chain to use
 * @param factoryAddress - The factory address
 * @param personalWalletAddress - The personal wallet address
 * @returns True if the smart wallet is deployed
 */
export async function isSmartWalletDeployed(
  chain: ChainOrRpcUrl,
  factoryAddress: string,
  personalWalletAddress: string,
  data: BytesLike = "0x",
) {
  const readOnlySDK = getSDK(chain);
  const factoryContract = await readOnlySDK.getContract(factoryAddress);
  const accountAddress = await factoryContract.call("getAddress", [
    personalWalletAddress,
    data,
  ]);
  const isDeployed = await isContractDeployed(
    accountAddress,
    readOnlySDK.getProvider(),
  );
  return isDeployed;
}

/**
 * Get the associated smart wallet address for a given personal wallet address
 * @param chain - The chain to use
 * @param factoryAddress - The factory address
 * @param personalWalletAddress - The personal wallet address
 * @returns The smart wallet address
 */
export async function getSmartWalletAddress(
  chain: ChainOrRpcUrl,
  factoryAddress: string,
  personalWalletAddress: string,
  data: BytesLike = "0x",
): Promise<string> {
  const readOnlySDK = getSDK(chain);
  const factoryContract = await readOnlySDK.getContract(factoryAddress);
  const accountAddress = await factoryContract.call("getAddress", [
    personalWalletAddress,
    data,
  ]);
  return accountAddress;
}

export async function getUserOpReceipt(
  chain: ChainOrRpcUrl,
  userOpHash: string,
  timeout = 30000,
  interval = 2000,
  entryPointAddress?: string,
): Promise<string | null> {
  const readOnlySDK = getSDK(chain);
  const entrypoint = await readOnlySDK.getContract(
    entryPointAddress || ENTRYPOINT_ADDRESS,
    EntryPoint__factory.abi,
  );

  // do a first check for the last 5000 blocks
  const pastEvents = await entrypoint.events.getEvents("UserOperationEvent", {
    fromBlock: -9000, // look at the last 9000 blocks
    filters: {
      userOpHash,
    },
  });

  if (pastEvents && pastEvents.length > 0) {
    return pastEvents[0]?.data.transactionHash;
  }

  // if not found, query the last 100 blocks every 2 seconds for the next 30 seconds
  const endtime = Date.now() + timeout;
  while (Date.now() < endtime) {
    const events = await entrypoint.events.getEvents("UserOperationEvent", {
      fromBlock: -100,
      filters: {
        userOpHash,
      },
    });
    if (events[0]) {
      return events[0].data.transactionHash;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  return null;
}
