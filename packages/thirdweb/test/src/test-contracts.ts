import { TEST_CLIENT } from "./test-clients.js";
import { USDT_ABI } from "./abis/usdt.js";
import { FORKED_ETHEREUM_CHAIN } from "./chains.js";
import { getContract } from "../../src/contract/contract.js";

// ERC20

export const USDT_CONTRACT_ADDRESS =
	"0xdAC17F958D2ee523a2206206994597C13D831ec7";

export const USDT_CONTRACT = getContract({
	client: TEST_CLIENT,
	address: USDT_CONTRACT_ADDRESS,
	chain: FORKED_ETHEREUM_CHAIN,
});

export const USDT_CONTRACT_WITH_ABI = getContract({
	client: TEST_CLIENT,
	address: USDT_CONTRACT_ADDRESS,
	chain: FORKED_ETHEREUM_CHAIN,
	abi: USDT_ABI,
});

// ERC721

const DOODLES_ADDRESS = "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e";

export const DOODLES_CONTRACT = getContract({
	client: TEST_CLIENT,
	address: DOODLES_ADDRESS,
	chain: FORKED_ETHEREUM_CHAIN,
});

const NFT_DROP_ADDRESS = "0xE333cD2f6e26A949Ce1F3FB15d7BfAc2871cc9e4";
export const NFT_DROP_IMPLEMENTATION = "0x6f6010fb5da6f757d5b1822aadf1d3b806d6546d"; // https://etherscan.io/address/0x6f6010fb5da6f757d5b1822aadf1d3b806d6546d#code

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

// Uniswap

const UNISWAPV3_FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

export const OHM_CONTRACT_ADDRESS =
	"0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5";
export const WETH_CONTRACT_ADDRESS =
	"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
export const MOG_CONTRACT_ADDRESS =
	"0xaaeE1A9723aaDB7afA2810263653A34bA2C21C7a";

export const UNISWAPV3_FACTORY_CONTRACT = getContract({
	client: TEST_CLIENT,
	address: UNISWAPV3_FACTORY_ADDRESS,
	chain: FORKED_ETHEREUM_CHAIN,
});
