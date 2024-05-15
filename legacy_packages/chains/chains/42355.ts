import type { Chain } from "../src/types";
export default {
  "chain": "GoldX",
  "chainId": 42355,
  "explorers": [
    {
      "name": "GoldXChain Explorer",
      "url": "https://explorer.goldxchain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://goldxchain.io",
  "name": "GoldXChain Mainnet",
  "nativeCurrency": {
    "name": "GoldX",
    "symbol": "GOLDX",
    "decimals": 18
  },
  "networkId": 42355,
  "rpc": [
    "https://42355.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.goldxchain.io"
  ],
  "shortName": "goldx",
  "slug": "goldxchain",
  "testnet": false
} as const satisfies Chain;