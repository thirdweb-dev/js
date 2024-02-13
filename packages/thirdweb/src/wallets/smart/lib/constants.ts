import { getChainIdFromChain, type Chain } from "../../../index.js";

// dev only
export const DEBUG = true;

export const DUMMY_SIGNATURE =
  "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";

export const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; // v0.6

/**
 * @internal
 */
export const getDefaultBundlerUrl = (chain: Chain) => {
  const chainId = getChainIdFromChain(chain);
  return `https://${chainId}.bundler.thirdweb.com/`;
};

/**
 * @internal
 */
export const getDefaultPaymasterUrl = (chain: Chain) => {
  const chainId = getChainIdFromChain(chain);
  return `https://${chainId}.bundler.thirdweb.com/v2`;
};
