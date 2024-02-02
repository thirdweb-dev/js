import { getContract } from "../src/contract/index.js";
import { CLIENT_ID_CLIENT } from "./test-clients.js";
import { USDC_ABI } from "./abis/usdc.js";

export const USDC_CONTRACT_ADDRESS =
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

export const USDC_CONTRACT = getContract({
  client: CLIENT_ID_CLIENT,
  address: USDC_CONTRACT_ADDRESS,
  chain: 1,
});

export const USDC_CONTRACT_WITH_ABI = getContract({
  client: CLIENT_ID_CLIENT,
  address: USDC_CONTRACT_ADDRESS,
  chain: 1,
  abi: USDC_ABI,
});
