import type { Chain } from "../src/types";
export default {
  "chainId": 70002,
  "chain": "Thinkium",
  "name": "Thinkium Mainnet Chain 2",
  "rpc": [
    "https://thinkium-chain-2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://proxy2.thinkiumrpc.net/"
  ],
  "slug": "thinkium-chain-2",
  "faucets": [],
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "infoURL": "https://thinkium.net/",
  "shortName": "TKM2",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://chain2.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;