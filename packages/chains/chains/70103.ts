import type { Chain } from "../src/types";
export default {
  "chainId": 70103,
  "chain": "Thinkium",
  "name": "Thinkium Mainnet Chain 103",
  "rpc": [
    "https://thinkium-chain-103.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://proxy103.thinkiumrpc.net/"
  ],
  "slug": "thinkium-chain-103",
  "faucets": [],
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "infoURL": "https://thinkium.net/",
  "shortName": "TKM103",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://chain103.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;