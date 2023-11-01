import type { Chain } from "../src/types";
export default {
  "chain": "CSC",
  "chainId": 52,
  "explorers": [
    {
      "name": "coinexscan",
      "url": "https://www.coinex.net",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.coinex.org/",
  "name": "CoinEx Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "CoinEx Chain Native Token",
    "symbol": "cet",
    "decimals": 18
  },
  "networkId": 52,
  "rpc": [
    "https://coinex-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://52.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.coinex.net"
  ],
  "shortName": "cet",
  "slug": "coinex-smart-chain",
  "testnet": false
} as const satisfies Chain;