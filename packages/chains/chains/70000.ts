import type { Chain } from "../src/types";
export default {
  "name": "Thinkium Mainnet Chain 0",
  "chain": "Thinkium",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "infoURL": "https://thinkium.net/",
  "shortName": "TKM0",
  "chainId": 70000,
  "networkId": 70000,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://chain0.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "thinkium-chain-0"
} as const satisfies Chain;