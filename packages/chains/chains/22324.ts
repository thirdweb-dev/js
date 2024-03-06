import type { Chain } from "../src/types";
export default {
  "chain": "GoldXTestnet",
  "chainId": 22324,
  "explorers": [
    {
      "name": "GoldXChain Testnet Explorer",
      "url": "https://testnet-explorer.goldxchain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.goldxchain.io"
  ],
  "infoURL": "https://goldxchain.io",
  "name": "GoldXChain Testnet",
  "nativeCurrency": {
    "name": "GoldX",
    "symbol": "GOLDX",
    "decimals": 18
  },
  "networkId": 22324,
  "rpc": [
    "https://22324.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.goldxchain.io"
  ],
  "shortName": "goldx-testnet",
  "slug": "goldxchain-testnet",
  "testnet": true
} as const satisfies Chain;