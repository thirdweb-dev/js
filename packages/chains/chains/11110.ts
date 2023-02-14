export default {
  "name": "Astra",
  "chain": "Astra",
  "rpc": [
    "https://astra.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.astranaut.io",
    "https://rpc1.astranaut.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Astra",
    "symbol": "ASA",
    "decimals": 18
  },
  "infoURL": "https://astranaut.io",
  "shortName": "astra",
  "chainId": 11110,
  "networkId": 11110,
  "icon": {
    "url": "ipfs://QmaBtaukPNNUNjdJSUAwuFFQMLbZX1Pc3fvXKTKQcds7Kf",
    "width": 104,
    "height": 80,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Astra EVM Explorer (Blockscout)",
      "url": "https://explorer.astranaut.io",
      "standard": "none",
      "icon": "astra"
    },
    {
      "name": "Astra PingPub Explorer",
      "url": "https://ping.astranaut.io/astra",
      "standard": "none",
      "icon": "astra"
    }
  ],
  "testnet": false,
  "slug": "astra"
} as const;