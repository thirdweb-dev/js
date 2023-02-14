export default {
  "name": "Saakuru Mainnet",
  "chain": "Saakuru",
  "icon": {
    "url": "ipfs://QmduEdtFobPpZWSc45MU6RKxZfTEzLux2z8ikHFhT8usqv",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "rpc": [
    "https://saakuru.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.saakuru.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://saakuru.network",
  "shortName": "saakuru",
  "chainId": 7225878,
  "networkId": 7225878,
  "explorers": [
    {
      "name": "saakuru-explorer",
      "url": "https://explorer.saakuru.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "saakuru"
} as const;