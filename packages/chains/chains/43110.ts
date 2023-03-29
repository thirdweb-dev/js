export default {
  "name": "Athereum",
  "chain": "ATH",
  "rpc": [
    "https://athereum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ava.network:21015/ext/evm/rpc"
  ],
  "faucets": [
    "http://athfaucet.ava.network//?address=${ADDRESS}"
  ],
  "nativeCurrency": {
    "name": "Athereum Ether",
    "symbol": "ATH",
    "decimals": 18
  },
  "infoURL": "https://athereum.ava.network",
  "shortName": "avaeth",
  "chainId": 43110,
  "networkId": 43110,
  "testnet": false,
  "slug": "athereum"
} as const;