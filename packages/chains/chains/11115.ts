export default {
  "name": "Astra Testnet",
  "chain": "Astra",
  "rpc": [
    "https://astra-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.astranaut.dev"
  ],
  "faucets": [
    "https://faucet.astranaut.dev"
  ],
  "nativeCurrency": {
    "name": "test-Astra",
    "symbol": "tASA",
    "decimals": 18
  },
  "infoURL": "https://astranaut.io",
  "shortName": "astra-testnet",
  "chainId": 11115,
  "networkId": 11115,
  "icon": {
    "url": "ipfs://QmaBtaukPNNUNjdJSUAwuFFQMLbZX1Pc3fvXKTKQcds7Kf",
    "width": 104,
    "height": 80,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Astra EVM Explorer",
      "url": "https://explorer.astranaut.dev",
      "standard": "EIP3091",
      "icon": "astra"
    },
    {
      "name": "Astra PingPub Explorer",
      "url": "https://ping.astranaut.dev/astra",
      "standard": "none",
      "icon": "astra"
    }
  ],
  "testnet": true,
  "slug": "astra-testnet"
} as const;