import { getChainIdFromChain, type Chain } from "../../../chain/index.js";

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

/**
 * @internal
 */
export const USER_OP_EVENT_ABI = {
  type: "event",
  name: "UserOperationEvent",
  inputs: [
    {
      name: "userOpHash",
      type: "bytes32",
      indexed: true,
      internalType: "bytes32",
    },
    { name: "sender", type: "address", indexed: true, internalType: "address" },
    {
      name: "paymaster",
      type: "address",
      indexed: true,
      internalType: "address",
    },
    { name: "nonce", type: "uint256", indexed: false, internalType: "uint256" },
    { name: "success", type: "bool", indexed: false, internalType: "bool" },
    {
      name: "actualGasCost",
      type: "uint256",
      indexed: false,
      internalType: "uint256",
    },
    {
      name: "actualGasUsed",
      type: "uint256",
      indexed: false,
      internalType: "uint256",
    },
  ],
  anonymous: false,
} as const;
