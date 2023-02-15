export default {
  "name": "T-EKTA",
  "title": "EKTA Testnet T-EKTA",
  "chain": "T-EKTA",
  "rpc": [
    "https://t-ekta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test.ekta.io:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "T-EKTA",
    "symbol": "T-EKTA",
    "decimals": 18
  },
  "infoURL": "https://www.ekta.io",
  "shortName": "t-ekta",
  "chainId": 1004,
  "networkId": 1004,
  "icon": {
    "url": "ipfs://QmfMd564KUPK8eKZDwGCT71ZC2jMnUZqP6LCtLpup3rHH1",
    "width": 2100,
    "height": 2100,
    "format": "png"
  },
  "explorers": [
    {
      "name": "test-ektascan",
      "url": "https://test.ektascan.io",
      "icon": "ekta",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "t-ekta"
} as const;