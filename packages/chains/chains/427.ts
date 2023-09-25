import type { Chain } from "../src/types";
export default {
  "chainId": 427,
  "chain": "ZeethChain",
  "name": "Zeeth Chain",
  "rpc": [
    "https://zeeth-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.zeeth.io"
  ],
  "slug": "zeeth-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Zeeth Token",
    "symbol": "ZTH",
    "decimals": 18
  },
  "shortName": "zeeth",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Zeeth Explorer",
      "url": "https://explorer.zeeth.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;