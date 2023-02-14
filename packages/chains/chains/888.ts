export default {
  "name": "Wanchain",
  "chain": "WAN",
  "rpc": [
    "https://wanchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gwan-ssl.wandevs.org:56891/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Wancoin",
    "symbol": "WAN",
    "decimals": 18
  },
  "infoURL": "https://www.wanscan.org",
  "shortName": "wan",
  "chainId": 888,
  "networkId": 888,
  "slip44": 5718350,
  "testnet": false,
  "slug": "wanchain"
} as const;