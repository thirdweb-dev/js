import type { Chain } from "../src/types";
export default {
  "chain": "Thinkium",
  "chainId": 70001,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://chain1.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://thinkium.net/",
  "name": "Thinkium Mainnet Chain 1",
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "networkId": 70001,
  "rpc": [
    "https://70001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://proxy1.thinkiumrpc.net/"
  ],
  "shortName": "TKM1",
  "slug": "thinkium-chain-1",
  "testnet": false
} as const satisfies Chain;