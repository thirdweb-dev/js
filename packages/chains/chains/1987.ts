export default {
  "name": "EtherGem",
  "chain": "EGEM",
  "rpc": [
    "https://ethergem.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.egem.io/custom"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EtherGem Ether",
    "symbol": "EGEM",
    "decimals": 18
  },
  "infoURL": "https://egem.io",
  "shortName": "egem",
  "chainId": 1987,
  "networkId": 1987,
  "slip44": 1987,
  "testnet": false,
  "slug": "ethergem"
} as const;