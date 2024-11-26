import type { Chain } from "../../../chains/types.js";
import { getAddress } from "../../../utils/address.js";
import { getThirdwebDomains } from "../../../utils/domains.js";

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
