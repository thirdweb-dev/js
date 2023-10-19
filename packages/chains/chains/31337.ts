import type { Chain } from "../src/types";
export default {
  "chain": "GO",
  "chainId": 31337,
  "explorers": [
    {
      "name": "GoChain Testnet Explorer",
      "url": "https://testnet-explorer.gochain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://gochain.io",
  "name": "GoChain Testnet",
  "nativeCurrency": {
    "name": "GoChain Coin",
    "symbol": "GO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://gochain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.gochain.io"
  ],
  "shortName": "got",
  "slug": "gochain-testnet",
  "testnet": true
} as const satisfies Chain;