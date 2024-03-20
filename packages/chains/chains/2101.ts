import type { Chain } from "../src/types";
export default {
  "chain": "ECO",
  "chainId": 2101,
  "explorers": [
    {
      "name": "Ecoball Testnet Explorer",
      "url": "https://espuma-scan.ecoball.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://ecoball.org",
  "name": "Ecoball Testnet Espuma",
  "nativeCurrency": {
    "name": "Espuma Coin",
    "symbol": "ECO",
    "decimals": 18
  },
  "networkId": 2101,
  "rpc": [
    "https://2101.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.ecoball.org/espuma/"
  ],
  "shortName": "esp",
  "slip44": 1,
  "slug": "ecoball-testnet-espuma",
  "testnet": true
} as const satisfies Chain;