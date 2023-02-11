export default {
  "name": "Btachain",
  "chain": "btachain",
  "rpc": [
    "https://btachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed1.btachain.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin Asset",
    "symbol": "BTA",
    "decimals": 18
  },
  "infoURL": "https://bitcoinasset.io/",
  "shortName": "bta",
  "chainId": 1657,
  "networkId": 1657,
  "testnet": false,
  "slug": "btachain"
} as const;