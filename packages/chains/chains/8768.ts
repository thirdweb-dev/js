export default {
  "name": "TMY Chain",
  "chain": "TMY",
  "icon": {
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
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