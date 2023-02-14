export default {
  "name": "Evanesco Mainnet",
  "chain": "EVA",
  "rpc": [
    "https://evanesco.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://seed4.evanesco.org:8546"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EVA",
    "symbol": "EVA",
    "decimals": 18
  },
  "infoURL": "https://evanesco.org/",
  "shortName": "evanesco",
  "chainId": 2213,
  "networkId": 2213,
  "icon": {
    "url": "ipfs://QmZbmGYdfbMRrWJore3c7hyD6q7B5pXHJqTSNjbZZUK6V8",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Evanesco Explorer",
      "url": "https://explorer.evanesco.org",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "evanesco"
} as const;