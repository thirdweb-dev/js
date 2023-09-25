import type { Chain } from "../src/types";
export default {
  "chainId": 2077,
  "chain": "Qkacoin",
  "name": "Quokkacoin Mainnet",
  "rpc": [
    "https://quokkacoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.qkacoin.org"
  ],
  "slug": "quokkacoin",
  "faucets": [],
  "nativeCurrency": {
    "name": "Qkacoin",
    "symbol": "QKA",
    "decimals": 18
  },
  "infoURL": "https://qkacoin.org",
  "shortName": "QKA",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.qkacoin.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;