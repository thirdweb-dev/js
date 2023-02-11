export default {
  "name": "Genesis L1",
  "chain": "genesis",
  "rpc": [
    "https://genesis-l1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.genesisl1.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "L1 coin",
    "symbol": "L1",
    "decimals": 18
  },
  "infoURL": "https://www.genesisl1.com",
  "shortName": "L1",
  "chainId": 29,
  "networkId": 29,
  "explorers": [
    {
      "name": "Genesis L1 blockchain explorer",
      "url": "https://explorer.genesisl1.org",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "genesis-l1"
} as const;