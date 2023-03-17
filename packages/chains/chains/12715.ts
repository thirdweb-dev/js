export default {
  "name": "Rikeza Network Testnet",
  "title": "Rikeza Network Testnet",
  "chain": "Rikeza",
  "rpc": [
    "https://rikeza-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.rikscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rikeza",
    "symbol": "RIK",
    "decimals": 18
  },
  "infoURL": "https://rikeza.io",
  "shortName": "tRIK",
  "chainId": 12715,
  "networkId": 12715,
  "explorers": [
    {
      "name": "Rikeza Blockchain explorer",
      "url": "https://testnet.rikscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "rikeza-network-testnet"
} as const;