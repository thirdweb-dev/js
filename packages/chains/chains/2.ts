export default {
  "name": "Expanse Network",
  "chain": "EXP",
  "rpc": [
    "https://expanse-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.expanse.tech"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Expanse Network Ether",
    "symbol": "EXP",
    "decimals": 18
  },
  "infoURL": "https://expanse.tech",
  "shortName": "exp",
  "chainId": 2,
  "networkId": 1,
  "slip44": 40,
  "testnet": false,
  "slug": "expanse-network"
} as const;