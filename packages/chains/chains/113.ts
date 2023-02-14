export default {
  "name": "Dehvo",
  "chain": "Dehvo",
  "rpc": [
    "https://dehvo.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.dehvo.com",
    "https://rpc.dehvo.com",
    "https://rpc1.dehvo.com",
    "https://rpc2.dehvo.com"
  ],
  "faucets": [
    "https://buy.dehvo.com"
  ],
  "nativeCurrency": {
    "name": "Dehvo",
    "symbol": "Deh",
    "decimals": 18
  },
  "infoURL": "https://dehvo.com",
  "shortName": "deh",
  "chainId": 113,
  "networkId": 113,
  "slip44": 714,
  "explorers": [
    {
      "name": "Dehvo Explorer",
      "url": "https://explorer.dehvo.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "dehvo"
} as const;