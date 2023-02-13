export default {
  "name": "Ekta",
  "chain": "EKTA",
  "rpc": [
    "https://ekta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://main.ekta.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EKTA",
    "symbol": "EKTA",
    "decimals": 18
  },
  "infoURL": "https://www.ekta.io",
  "shortName": "ekta",
  "chainId": 1994,
  "networkId": 1994,
  "icon": {
    "url": "ipfs://QmfMd564KUPK8eKZDwGCT71ZC2jMnUZqP6LCtLpup3rHH1",
    "width": 2100,
    "height": 2100,
    "format": "png"
  },
  "explorers": [
    {
      "name": "ektascan",
      "url": "https://ektascan.io",
      "icon": "ekta",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "ekta"
} as const;