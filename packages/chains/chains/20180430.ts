export default {
  "name": "SmartMesh Mainnet",
  "chain": "Spectrum",
  "rpc": [
    "https://smartmesh.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonapi1.smartmesh.cn"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SmartMesh Native Token",
    "symbol": "SMT",
    "decimals": 18
  },
  "infoURL": "https://smartmesh.io",
  "shortName": "spectrum",
  "chainId": 20180430,
  "networkId": 1,
  "explorers": [
    {
      "name": "spectrum",
      "url": "https://spectrum.pub",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "smartmesh"
} as const;