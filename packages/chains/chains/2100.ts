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
  "infoURL": "https://ecoball.org",
  "name": "Ecoball Mainnet",
  "nativeCurrency": {
    "name": "Ecoball Coin",
    "symbol": "ECO",
    "decimals": 18
  },
  "networkId": 2100,
  "rpc": [
    "https://2100.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.ecoball.org/ecoball/"
  ],
  "shortName": "eco",
  "slug": "ecoball",
  "testnet": false
} as const satisfies Chain;