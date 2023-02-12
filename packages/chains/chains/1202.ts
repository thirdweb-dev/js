export default {
  "name": "World Trade Technical Chain Mainnet",
  "chain": "WTT",
  "rpc": [
    "https://world-trade-technical-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.cadaut.com",
    "wss://rpc.cadaut.com/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "World Trade Token",
    "symbol": "WTT",
    "decimals": 18
  },
  "infoURL": "http://www.cadaut.com",
  "shortName": "wtt",
  "chainId": 1202,
  "networkId": 2048,
  "explorers": [
    {
      "name": "WTTScout",
      "url": "https://explorer.cadaut.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "world-trade-technical-chain"
} as const;