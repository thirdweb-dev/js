import type { Chain } from "../src/types";
export default {
  "name": "Ecoball Testnet Espuma",
  "chain": "ECO",
  "rpc": [],
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
} as const satisfies Chain;