import type { Chain } from "../src/types";
export default {
  "chainId": 31337,
  "chain": "GO",
  "name": "GoChain Testnet",
  "rpc": [
    "https://gochain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.gochain.io"
  ],
  "slug": "gochain-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "GoChain Coin",
    "symbol": "GO",
    "decimals": 18
  },
  "infoURL": "https://gochain.io",
  "shortName": "got",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "GoChain Testnet Explorer",
      "url": "https://testnet-explorer.gochain.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;