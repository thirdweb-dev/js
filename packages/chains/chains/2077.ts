import type { Chain } from "../src/types";
export default {
  "chain": "Qkacoin",
  "chainId": 2077,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.qkacoin.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://qkacoin.org",
  "name": "Quokkacoin Mainnet",
  "nativeCurrency": {
    "name": "Qkacoin",
    "symbol": "QKA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://quokkacoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.qkacoin.org"
  ],
  "shortName": "QKA",
  "slug": "quokkacoin",
  "testnet": false
} as const satisfies Chain;