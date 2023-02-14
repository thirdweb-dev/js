export default {
  "name": "Plian Mainnet Main",
  "chain": "Plian",
  "rpc": [
    "https://plian-main.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.plian.io/pchain"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Plian Token",
    "symbol": "PI",
    "decimals": 18
  },
  "infoURL": "https://plian.org/",
  "shortName": "plian-mainnet",
  "chainId": 2099156,
  "networkId": 2099156,
  "explorers": [
    {
      "name": "piscan",
      "url": "https://piscan.plian.org/pchain",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "plian-main"
} as const;