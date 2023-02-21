export default {
  "name": "cheapETH",
  "chain": "cheapETH",
  "rpc": [
    "https://cheapeth.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.cheapeth.org/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "cTH",
    "symbol": "cTH",
    "decimals": 18
  },
  "infoURL": "https://cheapeth.org/",
  "shortName": "cth",
  "chainId": 777,
  "networkId": 777,
  "testnet": false,
  "slug": "cheapeth"
} as const;