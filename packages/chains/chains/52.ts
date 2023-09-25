import type { Chain } from "../src/types";
export default {
  "chainId": 52,
  "chain": "CSC",
  "name": "CoinEx Smart Chain Mainnet",
  "rpc": [
    "https://coinex-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.coinex.net"
  ],
  "slug": "coinex-smart-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "CoinEx Chain Native Token",
    "symbol": "cet",
    "decimals": 18
  },
  "infoURL": "https://www.coinex.org/",
  "shortName": "cet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "coinexscan",
      "url": "https://www.coinex.net",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;