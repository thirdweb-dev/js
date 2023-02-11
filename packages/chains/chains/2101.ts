export default {
  "name": "Ecoball Testnet Espuma",
  "chain": "ECO",
  "rpc": [
    "https://ecoball-testnet-espuma.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.ecoball.org/espuma/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Espuma Coin",
    "symbol": "ECO",
    "decimals": 18
  },
  "infoURL": "https://ecoball.org",
  "shortName": "esp",
  "chainId": 2101,
  "networkId": 2101,
  "explorers": [
    {
      "name": "Ecoball Testnet Explorer",
      "url": "https://espuma-scan.ecoball.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "ecoball-testnet-espuma"
} as const;