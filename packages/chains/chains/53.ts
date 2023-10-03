import type { Chain } from "../src/types";
export default {
  "chain": "CSC",
  "chainId": 53,
  "explorers": [
    {
      "name": "coinexscan",
      "url": "https://testnet.coinex.net",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.coinex.org/",
  "name": "CoinEx Smart Chain Testnet",
  "nativeCurrency": {
    "name": "CoinEx Chain Test Native Token",
    "symbol": "cett",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://coinex-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.coinex.net/"
  ],
  "shortName": "tcet",
  "slug": "coinex-smart-chain-testnet",
  "testnet": true
} as const satisfies Chain;