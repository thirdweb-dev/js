export default {
  "name": "BTCIX Network",
  "chain": "BTCIX",
  "rpc": [
    "https://btcix-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://seed.btcix.org/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTCIX Network",
    "symbol": "BTCIX",
    "decimals": 18
  },
  "infoURL": "https://bitcolojix.org",
  "shortName": "btcix",
  "chainId": 19845,
  "networkId": 19845,
  "explorers": [
    {
      "name": "BTCIXScan",
      "url": "https://btcixscan.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "btcix-network"
} as const;