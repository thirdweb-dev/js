export default {
  "name": "Popcateum Mainnet",
  "chain": "POPCATEUM",
  "rpc": [
    "https://popcateum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed.popcateum.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Popcat",
    "symbol": "POP",
    "decimals": 18
  },
  "infoURL": "https://popcateum.org",
  "shortName": "popcat",
  "chainId": 1213,
  "networkId": 1213,
  "explorers": [
    {
      "name": "popcateum explorer",
      "url": "https://explorer.popcateum.org",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "popcateum"
} as const;