import { TEST_CLIENT } from "./test-clients.js";
import { USDC_ABI } from "./abis/usdc.js";
import { FORKED_ETHEREUM_CHAIN } from "./chains.js";
import { getContract } from "../../src/contract/index.js";

// ERC20

const USDC_CONTRACT_ADDRESS =
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

export const USDC_CONTRACT = getContract({
  client: TEST_CLIENT,
  address: USDC_CONTRACT_ADDRESS,
  chain: FORKED_ETHEREUM_CHAIN,
});

export const USDC_CONTRACT_WITH_ABI = getContract({
  client: TEST_CLIENT,
  address: USDC_CONTRACT_ADDRESS,
  chain: FORKED_ETHEREUM_CHAIN,
  abi: USDC_ABI,
});

// ERC721

const DOODLES_ADDRESS = "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e";

export const DOODLES_CONTRACT = getContract({
  client: TEST_CLIENT,
  address: DOODLES_ADDRESS,
  chain: FORKED_ETHEREUM_CHAIN,
});

const DOODLES_CONTRACT_WITH_ABI = getContract({
  client: TEST_CLIENT,
  address: DOODLES_ADDRESS,
  chain: FORKED_ETHEREUM_CHAIN,
  abi: USDC_ABI,
});
