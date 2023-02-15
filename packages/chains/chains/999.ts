export default {
  "name": "Wanchain Testnet",
  "chain": "WAN",
  "rpc": [
    "https://wanchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gwan-ssl.wandevs.org:46891/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Wancoin",
    "symbol": "WAN",
    "decimals": 18
  },
  "infoURL": "https://testnet.wanscan.org",
  "shortName": "twan",
  "chainId": 999,
  "networkId": 999,
  "testnet": true,
  "slug": "wanchain-testnet"
} as const;