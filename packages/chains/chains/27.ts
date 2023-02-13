export default {
  "name": "ShibaChain",
  "chain": "SHIB",
  "rpc": [
    "https://shibachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.shibachain.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SHIBA INU COIN",
    "symbol": "SHIB",
    "decimals": 18
  },
  "infoURL": "https://www.shibachain.net",
  "shortName": "shib",
  "chainId": 27,
  "networkId": 27,
  "explorers": [
    {
      "name": "Shiba Explorer",
      "url": "https://exp.shibachain.net",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "shibachain"
} as const;