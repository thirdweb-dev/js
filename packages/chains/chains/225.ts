export default {
  "name": "LACHAIN Mainnet",
  "chain": "LA",
  "icon": {
    "url": "ipfs://QmQxGA6rhuCQDXUueVcNvFRhMEWisyTmnF57TqL7h6k6cZ",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "rpc": [
    "https://lachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.lachain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "LA",
    "symbol": "LA",
    "decimals": 18
  },
  "infoURL": "https://lachain.io",
  "shortName": "LA",
  "chainId": 225,
  "networkId": 225,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.lachain.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "lachain"
} as const;