export default {
  "name": "Findora Mainnet",
  "chain": "Findora",
  "rpc": [
    "https://findora.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.findora.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "FRA",
    "symbol": "FRA",
    "decimals": 18
  },
  "infoURL": "https://findora.org/",
  "shortName": "fra",
  "chainId": 2152,
  "networkId": 2152,
  "explorers": [
    {
      "name": "findorascan",
      "url": "https://evm.findorascan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "findora"
} as const;