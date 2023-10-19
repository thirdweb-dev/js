import type { Chain } from "../src/types";
export default {
  "chain": "WTT",
  "chainId": 1202,
  "explorers": [
    {
      "name": "WTTScout",
      "url": "https://explorer.cadaut.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "http://www.cadaut.com",
  "name": "World Trade Technical Chain Mainnet",
  "nativeCurrency": {
    "name": "World Trade Token",
    "symbol": "WTT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://world-trade-technical-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.cadaut.com",
    "wss://rpc.cadaut.com/ws"
  ],
  "shortName": "wtt",
  "slug": "world-trade-technical-chain",
  "testnet": false
} as const satisfies Chain;