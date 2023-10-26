import {
  ChainOrRpcUrl,
  isContractDeployed,
  ThirdwebSDK,
} from "@thirdweb-dev/sdk";

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
 * @param chain
 * @param factoryAddress
 * @param smartWalletAddress
 * @returns
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
 * @param chain
 * @param factoryAddress
 * @param personalWalletAddress
 * @returns
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
 * @param chain
 * @param factoryAddress
 * @param personalWalletAddress
 * @returns
 */
export async function isSmartWalletDeployed(
  chain: ChainOrRpcUrl,
  factoryAddress: string,
  personalWalletAddress: string,
) {
  const readOnlySDK = getSDK(chain);
  const factoryContract = await readOnlySDK.getContract(factoryAddress);
  const accountAddress = await factoryContract.call("getAddress", [
    personalWalletAddress,
    "0x",
  ]);
  const isDeployed = await isContractDeployed(
    accountAddress,
    readOnlySDK.getProvider(),
  );
  return isDeployed;
}

/**
 * Get the associated smart wallet address for a given personal wallet address
 * @param chain
 * @param factoryAddress
 * @param personalWalletAddress
 * @returns
 */
export async function getSmartWalletAddress(
  chain: ChainOrRpcUrl,
  factoryAddress: string,
  personalWalletAddress: string,
): Promise<string> {
  const readOnlySDK = getSDK(chain);
  const factoryContract = await readOnlySDK.getContract(factoryAddress);
  const accountAddress = await factoryContract.call("getAddress", [
    personalWalletAddress,
    "0x",
  ]);
  return accountAddress;
}
