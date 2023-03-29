export default {
  "name": "Palm",
  "chain": "Palm",
  "rpc": [
    "https://palm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://palm-mainnet.infura.io/v3/${INFURA_API_KEY}"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PALM",
    "symbol": "PALM",
    "decimals": 18
  },
  "infoURL": "https://palm.io",
  "shortName": "palm",
  "chainId": 11297108109,
  "networkId": 11297108109,
  "explorers": [
    {
      "name": "Palm Explorer",
      "url": "https://explorer.palm.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "palm"
} as const;