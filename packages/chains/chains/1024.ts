export default {
  "name": "CLV Parachain",
  "chain": "CLV",
  "rpc": [
    "https://clv-parachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api-para.clover.finance"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CLV",
    "symbol": "CLV",
    "decimals": 18
  },
  "infoURL": "https://clv.org",
  "shortName": "clv",
  "chainId": 1024,
  "networkId": 1024,
  "testnet": false,
  "slug": "clv-parachain"
} as const;