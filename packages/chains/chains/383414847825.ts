export default {
  "name": "Zeniq",
  "chain": "ZENIQ",
  "rpc": [
    "https://zeniq.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://smart.zeniq.network:9545"
  ],
  "faucets": [
    "https://faucet.zeniq.net/"
  ],
  "nativeCurrency": {
    "name": "Zeniq",
    "symbol": "ZENIQ",
    "decimals": 18
  },
  "infoURL": "https://www.zeniq.dev/",
  "shortName": "zeniq",
  "chainId": 383414847825,
  "networkId": 383414847825,
  "explorers": [
    {
      "name": "zeniq-smart-chain-explorer",
      "url": "https://smart.zeniq.net",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "zeniq"
} as const;