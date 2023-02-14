export default {
  "name": "Anduschain Mainnet",
  "chain": "anduschain",
  "rpc": [
    "https://anduschain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.anduschain.io/rpc",
    "wss://rpc.anduschain.io/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DAON",
    "symbol": "DEB",
    "decimals": 18
  },
  "infoURL": "https://anduschain.io/",
  "shortName": "anduschain-mainnet",
  "chainId": 14288640,
  "networkId": 14288640,
  "explorers": [
    {
      "name": "anduschain explorer",
      "url": "https://explorer.anduschain.io",
      "icon": "daon",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "anduschain"
} as const;