export default {
  "name": "Aquachain",
  "chain": "AQUA",
  "rpc": [
    "https://aquachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://c.onical.org",
    "https://tx.aquacha.in/api"
  ],
  "faucets": [
    "https://aquacha.in/faucet"
  ],
  "nativeCurrency": {
    "name": "Aquachain Ether",
    "symbol": "AQUA",
    "decimals": 18
  },
  "infoURL": "https://aquachain.github.io",
  "shortName": "aqua",
  "chainId": 61717561,
  "networkId": 61717561,
  "slip44": 61717561,
  "testnet": false,
  "slug": "aquachain"
} as const;