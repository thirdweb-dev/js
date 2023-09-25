import type { Chain } from "../src/types";
export default {
  "chainId": 1202,
  "chain": "WTT",
  "name": "World Trade Technical Chain Mainnet",
  "rpc": [
    "https://world-trade-technical-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.cadaut.com",
    "wss://rpc.cadaut.com/ws"
  ],
  "slug": "world-trade-technical-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "World Trade Token",
    "symbol": "WTT",
    "decimals": 18
  },
  "infoURL": "http://www.cadaut.com",
  "shortName": "wtt",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "WTTScout",
      "url": "https://explorer.cadaut.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;