export default {
  "name": "TMY Chain",
  "chain": "TMY",
  "icon": {
    "url": "ipfs://QmXQu3ib9gTo23mdVgMqmrExga6SmAzDQTTctpVBNtfDu9",
    "width": 1024,
    "height": 1023,
    "format": "svg"
  },
  "rpc": [
    "https://tmy-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.tmyblockchain.org/rpc"
  ],
  "faucets": [
    "https://faucet.tmychain.org/"
  ],
  "nativeCurrency": {
    "name": "TMY",
    "symbol": "TMY",
    "decimals": 18
  },
  "infoURL": "https://tmychain.org/",
  "shortName": "tmy",
  "chainId": 8768,
  "networkId": 8768,
  "testnet": false,
  "slug": "tmy-chain"
} as const;