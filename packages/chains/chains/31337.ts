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
  "infoURL": "https://gochain.io",
  "name": "GoChain Testnet",
  "nativeCurrency": {
    "name": "GoChain Coin",
    "symbol": "GO",
    "decimals": 18
  },
  "networkId": 31337,
  "rpc": [
    "https://gochain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://31337.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.gochain.io"
  ],
  "shortName": "got",
  "slip44": 1,
  "slug": "gochain-testnet",
  "testnet": true
} as const satisfies Chain;