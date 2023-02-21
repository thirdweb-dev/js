export default {
  "name": "PolySmartChain",
  "chain": "PSC",
  "rpc": [
    "https://polysmartchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://seed0.polysmartchain.com/",
    "https://seed1.polysmartchain.com/",
    "https://seed2.polysmartchain.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PSC",
    "symbol": "PSC",
    "decimals": 18
  },
  "infoURL": "https://www.polysmartchain.com/",
  "shortName": "psc",
  "chainId": 6999,
  "networkId": 6999,
  "testnet": false,
  "slug": "polysmartchain"
} as const;