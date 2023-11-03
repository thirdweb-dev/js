import type { Chain } from "../types";
export default {
  "chain": "ZeethChain",
  "chainId": 427,
  "explorers": [
    {
      "name": "Zeeth Explorer",
      "url": "https://explorer.zeeth.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "name": "Zeeth Chain",
  "nativeCurrency": {
    "name": "Zeeth Token",
    "symbol": "ZTH",
    "decimals": 18
  },
  "networkId": 427,
  "rpc": [
    "https://zeeth-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://427.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.zeeth.io"
  ],
  "shortName": "zeeth",
  "slug": "zeeth-chain",
  "testnet": false
} as const satisfies Chain;