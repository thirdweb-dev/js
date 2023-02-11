export default {
  "name": "Crypto Emergency",
  "chain": "CEM",
  "rpc": [
    "https://crypto-emergency.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cemchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Crypto Emergency",
    "symbol": "CEM",
    "decimals": 18
  },
  "infoURL": "https://cemblockchain.com/",
  "shortName": "cem",
  "chainId": 193,
  "networkId": 193,
  "explorers": [
    {
      "name": "cemscan",
      "url": "https://cemscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "crypto-emergency"
} as const;