import type { Chain } from "../src/types";
export default {
  "chainId": 70001,
  "chain": "Thinkium",
  "name": "Thinkium Mainnet Chain 1",
  "rpc": [
    "https://thinkium-chain-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://proxy1.thinkiumrpc.net/"
  ],
  "slug": "thinkium-chain-1",
  "faucets": [],
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "infoURL": "https://thinkium.net/",
  "shortName": "TKM1",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://chain1.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;