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
  "infoURL": "https://qkacoin.org",
  "name": "Quokkacoin Mainnet",
  "nativeCurrency": {
    "name": "Qkacoin",
    "symbol": "QKA",
    "decimals": 18
  },
  "networkId": 2077,
  "rpc": [
    "https://2077.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.qkacoin.org"
  ],
  "shortName": "QKA",
  "slug": "quokkacoin",
  "testnet": false
} as const satisfies Chain;