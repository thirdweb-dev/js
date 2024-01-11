import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 471100,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://patex.io/",
  "name": "Patex Sepolia Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 471100,
  "rpc": [
    "https://patex-sepolia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://471100.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-rpc.patex.io/"
  ],
  "shortName": "psep",
  "slip44": 1,
  "slug": "patex-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;