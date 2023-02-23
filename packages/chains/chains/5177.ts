export default {
  "name": "TLChain Network Mainnet",
  "chain": "TLC",
  "icon": {
    "url": "ipfs://QmaR5TsgnWSjLys6wGaciKUbc5qYL3Es4jtgQcosVqDWR3",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "rpc": [
    "https://tlchain-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.tlxscan.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TLChain Network",
    "symbol": "TLC",
    "decimals": 18
  },
  "infoURL": "https://tlchain.network/",
  "shortName": "tlc",
  "chainId": 5177,
  "networkId": 5177,
  "explorers": [
    {
      "name": "TLChain Explorer",
      "url": "https://explorer.tlchain.network",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "tlchain-network"
} as const;