import { TEST_CLIENT } from "./test-clients.js";
import { USDC_ABI } from "./abis/usdc.js";
import { FORKED_ETHEREUM_CHAIN } from "./chains.js";
import { getContract } from "../../src/contract/contract.js";

// ERC20

const USDC_CONTRACT_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

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

const AZUKI_ADDRESS = "0xED5AF388653567Af2F388E6224dC7C4b3241C544";

export const AZUKI_CONTRACT = getContract({
  client: TEST_CLIENT,
  address: AZUKI_ADDRESS,
  chain: FORKED_ETHEREUM_CHAIN,
});

const NFT_DROP_ADDRESS = "0xE333cD2f6e26A949Ce1F3FB15d7BfAc2871cc9e4";

export const NFT_DROP_CONTRACT = getContract({
  client: TEST_CLIENT,
  address: NFT_DROP_ADDRESS,
  chain: FORKED_ETHEREUM_CHAIN,
});

// ERC1155

const AURA_ADDRESS = "0x42d3641255C946CC451474295d29D3505173F22A";

export const DROP1155_CONTRACT = getContract({
  client: TEST_CLIENT,
  address: AURA_ADDRESS,
  chain: FORKED_ETHEREUM_CHAIN,
});

// ERC4626

const FRAX_ETHER_CONTRACT_ADDRESS =
  "0xac3E018457B222d93114458476f3E3416Abbe38F";

export const FRAX_ETHER_CONTRACT = getContract({
  client: TEST_CLIENT,
  address: FRAX_ETHER_CONTRACT_ADDRESS,
  chain: FORKED_ETHEREUM_CHAIN,
});
