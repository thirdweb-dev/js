import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 484752,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://worldcoin.org/",
  "name": "World Chain Sepolia Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 484752,
  "rpc": [],
  "shortName": "wcsep",
  "slip44": 1,
  "slug": "world-chain-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;