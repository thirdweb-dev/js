import type { Chain } from "../../../chains/types.js";
import { getAddress } from "../../../utils/address.js";
import { getThirdwebDomains } from "../../../utils/domains.js";
import type { TokenPaymasterConfig } from "../types.js";

export const DUMMY_SIGNATURE =
  "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";

export const DEFAULT_ACCOUNT_FACTORY_V0_6 =
  "0x85e23b94e7F5E9cC1fF78BCe78cfb15B81f0DF00";
export const DEFAULT_ACCOUNT_FACTORY_V0_7 =
  "0x4be0ddfebca9a5a4a617dee4dece99e7c862dceb";

export const ENTRYPOINT_ADDRESS_v0_6 =
  "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; // v0.6
export const ENTRYPOINT_ADDRESS_v0_7 =
  "0x0000000071727De22E5E9d8BAf0edAc6f37da032"; // v0.7

export const MANAGED_ACCOUNT_GAS_BUFFER = 50000n;

type PAYMASTERS = "BASE_USDC" | "CELO_CUSD" | "LISK_LSK";
export const TokenPaymaster: Record<PAYMASTERS, TokenPaymasterConfig> = {
  BASE_USDC: {
    balanceStorageSlot: 9n,
    chainId: 8453,
    paymasterAddress: "0x2222f2738BE6bB7aA0Bfe4AEeAf2908172CF5539",
    tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
  CELO_CUSD: {
    balanceStorageSlot: 9n,
    chainId: 42220,
    paymasterAddress: "0x3feA3c5744D715ff46e91C4e5C9a94426DfF2aF9",
    tokenAddress: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  },
  LISK_LSK: {
    balanceStorageSlot: 9n,
    chainId: 1135,
    paymasterAddress: "0x9eb8cf7fBa5ed9EeDCC97a0d52254cc0e9B1AC25",
    tokenAddress: "0xac485391EB2d7D88253a7F1eF18C37f4242D1A24",
  },
};

/*
 * @internal
 */
export const getDefaultAccountFactory = (entryPointAddress?: string) => {
  const version = getEntryPointVersion(
    entryPointAddress || ENTRYPOINT_ADDRESS_v0_6,
  );
  if (version === "v0.7") {
    return DEFAULT_ACCOUNT_FACTORY_V0_7;
  }
  return DEFAULT_ACCOUNT_FACTORY_V0_6;
};

/**
 * @internal
 */
export const getDefaultBundlerUrl = (chain: Chain) => {
  const domain = getThirdwebDomains().bundler;
  if (domain.startsWith("localhost:")) {
    return `http://${domain}/v2?chain=${chain.id}`;
  }
  return `https://${chain.id}.${domain}/v2`;
};

export const getEntryPointVersion = (address: string): "v0.6" | "v0.7" => {
  const checksummedAddress = getAddress(address);
  if (checksummedAddress === ENTRYPOINT_ADDRESS_v0_6) {
    return "v0.6";
  }
  if (checksummedAddress === ENTRYPOINT_ADDRESS_v0_7) {
    return "v0.7";
  }
  throw new Error("Unknown paymaster version");
};
