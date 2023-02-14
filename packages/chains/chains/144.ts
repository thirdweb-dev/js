export default {
  "name": "PHI Network v2",
  "chain": "PHI",
  "rpc": [
    "https://phi-network-v2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.phi.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PHI",
    "symbol": "Φ",
    "decimals": 18
  },
  "infoURL": "https://phi.network",
  "shortName": "PHI",
  "chainId": 144,
  "networkId": 144,
  "icon": {
    "url": "ipfs://bafkreid6pm3mic7izp3a6zlfwhhe7etd276bjfsq2xash6a4s2vmcdf65a",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Phiscan",
      "url": "https://phiscan.com",
      "icon": "phi",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "phi-network-v2"
} as const;