export default {
  "name": "Oone Chain Testnet",
  "chain": "OONE",
  "rpc": [
    "https://oone-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://blockchain-test.adigium.world"
  ],
  "faucets": [
    "https://apps-test.adigium.com/faucet"
  ],
  "nativeCurrency": {
    "name": "Oone",
    "symbol": "tOONE",
    "decimals": 18
  },
  "infoURL": "https://oone.world",
  "shortName": "oonetest",
  "chainId": 333777,
  "networkId": 333777,
  "explorers": [
    {
      "name": "expedition",
      "url": "https://explorer-test.adigium.world",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "oone-chain-testnet"
} as const;