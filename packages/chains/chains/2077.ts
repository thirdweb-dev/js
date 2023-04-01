import type { Chain } from "../src/types";
export default {
  "name": "Quokkacoin Mainnet",
  "chain": "Qkacoin",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Qkacoin",
    "symbol": "QKA",
    "decimals": 18
  },
  "infoURL": "https://qkacoin.org",
  "shortName": "QKA",
  "chainId": 2077,
  "networkId": 2077,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.qkacoin.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quokkacoin"
} as const satisfies Chain;