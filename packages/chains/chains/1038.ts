export default {
  "name": "Bronos Testnet",
  "chain": "Bronos",
  "rpc": [
    "https://bronos-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-testnet.bronos.org"
  ],
  "faucets": [
    "https://faucet.bronos.org"
  ],
  "nativeCurrency": {
    "name": "tBRO",
    "symbol": "tBRO",
    "decimals": 18
  },
  "infoURL": "https://bronos.org",
  "shortName": "bronos-testnet",
  "chainId": 1038,
  "networkId": 1038,
  "icon": {
    "url": "ipfs://bafybeifkgtmhnq4sxu6jn22i7ass7aih6ubodr77k6ygtu4tjbvpmkw2ga",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Bronos Testnet Explorer",
      "url": "https://tbroscan.bronos.org",
      "standard": "none",
      "icon": "bronos"
    }
  ],
  "testnet": true,
  "slug": "bronos-testnet"
} as const;