import type { Chain } from "../src/types";
export default {
  "name": "Patex Sepolia Testnet",
  "chain": "ETH",
  "rpc": [
    "https://patex-sepolia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-rpc.patex.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://patex.io/",
  "shortName": "psep",
  "chainId": 471100,
  "networkId": 471100,
  "testnet": true,
  "slug": "patex-sepolia-testnet"
} as const satisfies Chain;