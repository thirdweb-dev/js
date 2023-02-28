export default {
  "name": "Metacodechain",
  "chain": "metacode",
  "rpc": [
    "https://metacodechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://j.blockcoach.com:8503"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "J",
    "symbol": "J",
    "decimals": 18
  },
  "infoURL": "https://j.blockcoach.com:8089",
  "shortName": "metacode",
  "chainId": 3666,
  "networkId": 3666,
  "explorers": [
    {
      "name": "meta",
      "url": "https://j.blockcoach.com:8089",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "metacodechain"
} as const;