import type { Chain } from "../src/types";
export default {
  "chainId": 53,
  "chain": "CSC",
  "name": "CoinEx Smart Chain Testnet",
  "rpc": [
    "https://coinex-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.coinex.net/"
  ],
  "slug": "coinex-smart-chain-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "CoinEx Chain Test Native Token",
    "symbol": "cett",
    "decimals": 18
  },
  "infoURL": "https://www.coinex.org/",
  "shortName": "tcet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "coinexscan",
      "url": "https://testnet.coinex.net",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;