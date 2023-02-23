export default {
  "name": "Smart Bitcoin Cash",
  "chain": "smartBCH",
  "rpc": [
    "https://smart-bitcoin-cash.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://smartbch.greyh.at",
    "https://rpc-mainnet.smartbch.org",
    "https://smartbch.fountainhead.cash/mainnet",
    "https://smartbch.devops.cash/mainnet"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin Cash",
    "symbol": "BCH",
    "decimals": 18
  },
  "infoURL": "https://smartbch.org/",
  "shortName": "smartbch",
  "chainId": 10000,
  "networkId": 10000,
  "testnet": false,
  "slug": "smart-bitcoin-cash"
} as const;