import type { Chain } from "../src/types";
export default {
  "chainId": 70000,
  "chain": "Thinkium",
  "name": "Thinkium Mainnet Chain 0",
  "rpc": [
    "https://thinkium-chain-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://proxy.thinkiumrpc.net/"
  ],
  "slug": "thinkium-chain-0",
  "faucets": [],
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "infoURL": "https://thinkium.net/",
  "shortName": "TKM0",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://chain0.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;