export default {
  "name": "Lucid Blockchain",
  "chain": "Lucid Blockchain",
  "icon": {
    "url": "ipfs://bafybeigxiyyxll4vst5cjjh732mr6zhsnligxubaldyiul2xdvvi6ibktu",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "rpc": [
    "https://lucid-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.lucidcoin.io"
  ],
  "faucets": [
    "https://faucet.lucidcoin.io"
  ],
  "nativeCurrency": {
    "name": "LUCID",
    "symbol": "LUCID",
    "decimals": 18
  },
  "infoURL": "https://lucidcoin.io",
  "shortName": "LUCID",
  "chainId": 800,
  "networkId": 800,
  "explorers": [
    {
      "name": "Lucid Explorer",
      "url": "https://explorer.lucidcoin.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "lucid-blockchain"
} as const;