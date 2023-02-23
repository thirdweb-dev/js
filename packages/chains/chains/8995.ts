export default {
  "name": "bloxberg",
  "chain": "bloxberg",
  "rpc": [
    "https://bloxberg.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://core.bloxberg.org"
  ],
  "faucets": [
    "https://faucet.bloxberg.org/"
  ],
  "nativeCurrency": {
    "name": "BERG",
    "symbol": "U+25B3",
    "decimals": 18
  },
  "infoURL": "https://bloxberg.org",
  "shortName": "berg",
  "chainId": 8995,
  "networkId": 8995,
  "testnet": false,
  "slug": "bloxberg"
} as const;