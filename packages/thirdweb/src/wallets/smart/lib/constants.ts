import type { Chain } from "../../../chains/types.js";

// dev only
export const DEBUG = false;

export const DUMMY_SIGNATURE =
  "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";

export const DEFAULT_ACCOUNT_FACTORY =
  "0x85e23b94e7F5E9cC1fF78BCe78cfb15B81f0DF00";

export const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; // v0.6
export const MANAGED_ACCOUNT_GAS_BUFFER = 50000n;

/**
 * @internal
 */
export const getDefaultBundlerUrl = (chain: Chain) => {
  return `https://${chain.id}.bundler.thirdweb.com/`;
};

/**
 * @internal
 */
export const getDefaultPaymasterUrl = (chain: Chain) => {
  return `https://${chain.id}.bundler.thirdweb.com/`;
};
