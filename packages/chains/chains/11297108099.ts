export default {
  "name": "Palm Testnet",
  "chain": "Palm",
  "rpc": [
    "https://palm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://palm-testnet.infura.io/v3/${INFURA_API_KEY}"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PALM",
    "symbol": "PALM",
    "decimals": 18
  },
  "infoURL": "https://palm.io",
  "shortName": "tpalm",
  "chainId": 11297108099,
  "networkId": 11297108099,
  "explorers": [
    {
      "name": "Palm Testnet Explorer",
      "url": "https://explorer.palm-uat.xyz",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "palm-testnet"
} as const;