import type { Chain } from "../src/types";
export default {
  "chain": "Thinkium",
  "chainId": 70002,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://chain2.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://thinkium.net/",
  "name": "Thinkium Mainnet Chain 2",
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "networkId": 70002,
  "rpc": [
    "https://70002.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://proxy2.thinkiumrpc.net/"
  ],
  "shortName": "TKM2",
  "slug": "thinkium-chain-2",
  "testnet": false
} as const satisfies Chain;