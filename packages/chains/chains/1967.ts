export default {
  "name": "Eleanor",
  "title": "Metatime Testnet Eleanor",
  "chain": "MTC",
  "rpc": [
    "https://eleanor.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.metatime.com/eleanor",
    "wss://ws.metatime.com/eleanor"
  ],
  "faucets": [
    "https://faucet.metatime.com/eleanor"
  ],
  "nativeCurrency": {
    "name": "Eleanor Metacoin",
    "symbol": "MTC",
    "decimals": 18
  },
  "infoURL": "https://eleanor.metatime.com",
  "shortName": "mtc",
  "chainId": 1967,
  "networkId": 1967,
  "explorers": [
    {
      "name": "metaexplorer-eleanor",
      "url": "https://explorer.metatime.com/eleanor",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "eleanor"
} as const;