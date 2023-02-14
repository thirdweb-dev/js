export default {
  "name": "Lucky Network",
  "chain": "LN",
  "rpc": [
    "https://lucky-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.luckynetwork.org",
    "wss://ws.lnscan.org",
    "https://rpc.lnscan.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Lucky",
    "symbol": "L99",
    "decimals": 18
  },
  "infoURL": "https://luckynetwork.org",
  "shortName": "ln",
  "chainId": 998,
  "networkId": 998,
  "icon": {
    "url": "ipfs://bafkreidmvcd5i7touug55hj45mf2pgabxamy5fziva7mtx5n664s3yap6m",
    "width": 205,
    "height": 28,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.luckynetwork.org",
      "standard": "none"
    },
    {
      "name": "expedition",
      "url": "https://lnscan.org",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "lucky-network"
} as const;