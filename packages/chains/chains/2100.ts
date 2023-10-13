import type { Chain } from "../src/types";
export default {
  "chain": "ECO",
  "chainId": 2100,
  "explorers": [
    {
      "name": "Ecoball Explorer",
      "url": "https://scan.ecoball.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://ecoball.org",
  "name": "Ecoball Mainnet",
  "nativeCurrency": {
    "name": "Ecoball Coin",
    "symbol": "ECO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ecoball.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.ecoball.org/ecoball/"
  ],
  "shortName": "eco",
  "slug": "ecoball",
  "testnet": false
} as const satisfies Chain;