export default {
  "name": "Opulent-X BETA",
  "chainId": 41500,
  "shortName": "ox-beta",
  "chain": "Opulent-X",
  "networkId": 41500,
  "nativeCurrency": {
    "name": "Oxyn Gas",
    "symbol": "OXYN",
    "decimals": 18
  },
  "rpc": [
    "https://opulent-x-beta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.opulent-x.com"
  ],
  "faucets": [],
  "infoURL": "https://beta.opulent-x.com",
  "explorers": [
    {
      "name": "Opulent-X BETA Explorer",
      "url": "https://explorer.opulent-x.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "opulent-x-beta"
} as const;