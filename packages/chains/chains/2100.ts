import type { Chain } from "../src/types";
export default {
  "chainId": 2100,
  "chain": "ECO",
  "name": "Ecoball Mainnet",
  "rpc": [
    "https://ecoball.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.ecoball.org/ecoball/"
  ],
  "slug": "ecoball",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ecoball Coin",
    "symbol": "ECO",
    "decimals": 18
  },
  "infoURL": "https://ecoball.org",
  "shortName": "eco",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Ecoball Explorer",
      "url": "https://scan.ecoball.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;