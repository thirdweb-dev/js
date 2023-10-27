import type { Chain } from "../src/types";
export default {
  "chain": "Thinkium",
  "chainId": 70103,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://chain103.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://thinkium.net/",
  "name": "Thinkium Mainnet Chain 103",
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "networkId": 70103,
  "rpc": [
    "https://thinkium-chain-103.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://70103.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://proxy103.thinkiumrpc.net/"
  ],
  "shortName": "TKM103",
  "slug": "thinkium-chain-103",
  "testnet": false
} as const satisfies Chain;