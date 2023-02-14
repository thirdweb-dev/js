export default {
  "name": "Beresheet Testnet",
  "chain": "EDG",
  "rpc": [
    "https://beresheet-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beresheet1.edgewa.re"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Testnet Edge",
    "symbol": "tEDG",
    "decimals": 18
  },
  "infoURL": "http://edgewa.re",
  "shortName": "edgt",
  "chainId": 2022,
  "networkId": 2022,
  "testnet": true,
  "slug": "beresheet-testnet"
} as const;