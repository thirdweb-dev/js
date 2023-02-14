export default {
  "name": "Klaytn Testnet Baobab",
  "chain": "KLAY",
  "rpc": [
    "https://klaytn-testnet-baobab.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.baobab.klaytn.net:8651"
  ],
  "faucets": [
    "https://baobab.wallet.klaytn.com/access?next=faucet"
  ],
  "nativeCurrency": {
    "name": "KLAY",
    "symbol": "KLAY",
    "decimals": 18
  },
  "infoURL": "https://www.klaytn.com/",
  "shortName": "Baobab",
  "chainId": 1001,
  "networkId": 1001,
  "testnet": true,
  "slug": "klaytn-testnet-baobab"
} as const;