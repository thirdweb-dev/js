import type { Chain } from "../src/types";
export default {
  "chain": "tFHE",
  "chainId": 8008135,
  "explorers": [
    {
      "name": "Fhenix Helium Explorer (Blockscout)",
      "url": "https://explorer.helium.fhenix.zone",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://get-helium.fhenix.zone"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://www.fhenix.io",
  "name": "Fhenix Helium",
  "nativeCurrency": {
    "name": "tFHE",
    "symbol": "tFHE",
    "decimals": 18
  },
  "networkId": 8008135,
  "rpc": [
    "https://8008135.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.helium.fhenix.zone"
  ],
  "shortName": "fhe-helium",
  "slug": "fhenix-helium",
  "testnet": false
} as const satisfies Chain;