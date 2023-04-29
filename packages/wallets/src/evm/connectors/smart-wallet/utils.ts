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

export async function isSmartWalletDeployed(
  chain: ChainOrRpcUrl,
  factoryAddress: string,
  personalWalletAddress: string,
) {
  const readOnlySDK = getSDK(chain);
  const factoryContract = await readOnlySDK.getContract(factoryAddress);
  const accountAddress = await factoryContract.call("getAddress", [
    personalWalletAddress,
  ]);
  const isDeployed = await isContractDeployed(
    accountAddress,
    readOnlySDK.getProvider(),
  );
  return isDeployed;
}

async function getSmartWalletAddress(
  chain: ChainOrRpcUrl,
  factoryAddress: string,
  personalWalletAddress: string,
): Promise<string> {
  const readOnlySDK = getSDK(chain);
  const factoryContract = await readOnlySDK.getContract(factoryAddress);
  const accountAddress = await factoryContract.call("getAddress", [
    personalWalletAddress,
  ]);
  return accountAddress;
}
