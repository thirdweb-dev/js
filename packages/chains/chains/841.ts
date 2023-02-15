export default {
  "name": "Taraxa Mainnet",
  "chain": "Tara",
  "icon": {
    "url": "ipfs://QmQhdktNyBeXmCaVuQpi1B4yXheSUKrJA17L4wpECKzG5D",
    "width": 310,
    "height": 310,
    "format": "png"
  },
  "rpc": [
    "https://taraxa.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.taraxa.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tara",
    "symbol": "TARA",
    "decimals": 18
  },
  "infoURL": "https://taraxa.io",
  "shortName": "tara",
  "chainId": 841,
  "networkId": 841,
  "explorers": [
    {
      "name": "Taraxa Explorer",
      "url": "https://explorer.mainnet.taraxa.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "taraxa"
} as const;