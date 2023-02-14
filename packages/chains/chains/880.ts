export default {
  "name": "Ambros Chain Mainnet",
  "chain": "ambroschain",
  "rpc": [
    "https://ambros-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.ambros.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "AMBROS",
    "symbol": "AMBROS",
    "decimals": 18
  },
  "infoURL": "https://ambros.network",
  "shortName": "ambros",
  "chainId": 880,
  "networkId": 880,
  "explorers": [
    {
      "name": "Ambros Chain Explorer",
      "url": "https://ambrosscan.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "ambros-chain"
} as const;