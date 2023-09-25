import type { Chain } from "../src/types";
export default {
  "chainId": 1088,
  "chain": "ETH",
  "name": "Metis Andromeda Mainnet",
  "rpc": [
    "https://metis-andromeda.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://andromeda.metis.io/?owner=1088"
  ],
  "slug": "metis-andromeda",
  "icon": {
    "url": "ipfs://QmbWKNucbMtrMPPkHG5ZmVmvNUo8CzqHHcrpk1C2BVQsEG/2022_H-Brand_Stacked_WhiteGreen.svg",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Metis",
    "symbol": "METIS",
    "decimals": 18
  },
  "infoURL": "https://www.metis.io",
  "shortName": "metis-andromeda",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://andromeda-explorer.metis.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;