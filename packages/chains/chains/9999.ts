export default {
  "name": "myOwn Testnet",
  "chain": "myOwn",
  "rpc": [
    "https://myown-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://geth.dev.bccloud.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MYN",
    "symbol": "MYN",
    "decimals": 18
  },
  "infoURL": "https://docs.bccloud.net/",
  "shortName": "myn",
  "chainId": 9999,
  "networkId": 9999,
  "testnet": true,
  "slug": "myown-testnet"
} as const;