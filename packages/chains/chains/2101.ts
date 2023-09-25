import type { Chain } from "../src/types";
export default {
  "chainId": 2101,
  "chain": "ECO",
  "name": "Ecoball Testnet Espuma",
  "rpc": [
    "https://ecoball-testnet-espuma.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.ecoball.org/espuma/"
  ],
  "slug": "ecoball-testnet-espuma",
  "faucets": [],
  "nativeCurrency": {
    "name": "Espuma Coin",
    "symbol": "ECO",
    "decimals": 18
  },
  "infoURL": "https://ecoball.org",
  "shortName": "esp",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Ecoball Testnet Explorer",
      "url": "https://espuma-scan.ecoball.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;