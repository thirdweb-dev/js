export default {
  "name": "CamelArk Mainnet",
  "chainId": 20001,
  "shortName": "CamelArk",
  "chain": "ETHW",
  "icon": {
    "url": "ipfs://QmbXDcCWHh8jExE1tAUkUKzXyTb8srpC75ogZq1QYkMMRW",
    "width": 128,
    "height": 128,
    "format": "svg"
  },
  "networkId": 20001,
  "nativeCurrency": {
    "name": "EthereumPoW",
    "symbol": "ETHW",
    "decimals": 18
  },
  "rpc": [
    "https://camelark.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-http-rpc.camelark.com"
  ],
  "faucets": [],
  "explorers": [
    {
      "name": "CamelArkscan",
      "url": "https://scan.camelark.com",
      "standard": "EIP3091"
    }
  ],
  "infoURL": "https://www.camelark.com",
  "testnet": false,
  "slug": "camelark"
} as const;