export default {
  "name": "Taraxa Testnet",
  "chain": "Tara",
  "icon": {
    "url": "ipfs://QmQhdktNyBeXmCaVuQpi1B4yXheSUKrJA17L4wpECKzG5D",
    "width": 310,
    "height": 310,
    "format": "png"
  },
  "rpc": [
    "https://taraxa-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.taraxa.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tara",
    "symbol": "TARA",
    "decimals": 18
  },
  "infoURL": "https://taraxa.io",
  "shortName": "taratest",
  "chainId": 842,
  "networkId": 842,
  "explorers": [
    {
      "name": "Taraxa Explorer",
      "url": "https://explorer.testnet.taraxa.io",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "taraxa-testnet"
} as const;