export default {
  "name": "Saakuru Testnet",
  "chain": "Saakuru",
  "icon": {
    "url": "ipfs://QmduEdtFobPpZWSc45MU6RKxZfTEzLux2z8ikHFhT8usqv",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "rpc": [
    "https://saakuru-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.saakuru.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://saakuru.network",
  "shortName": "saakuru-testnet",
  "chainId": 247253,
  "networkId": 247253,
  "explorers": [
    {
      "name": "saakuru-explorer-testnet",
      "url": "https://explorer-testnet.saakuru.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "saakuru-testnet"
} as const;