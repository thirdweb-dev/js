import type { Chain } from "../types";
export default {
  "chain": "Thinkium",
  "chainId": 70000,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://chain0.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://thinkium.net/",
  "name": "Thinkium Mainnet Chain 0",
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "networkId": 70000,
  "rpc": [
    "https://thinkium-chain-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://70000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://proxy.thinkiumrpc.net/"
  ],
  "shortName": "TKM0",
  "slug": "thinkium-chain-0",
  "testnet": false
} as const satisfies Chain;