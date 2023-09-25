import type { Chain } from "../src/types";
export default {
  "chainId": 246529,
  "chain": "ARTIS",
  "name": "ARTIS sigma1",
  "rpc": [
    "https://artis-sigma1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.sigma1.artis.network"
  ],
  "slug": "artis-sigma1",
  "faucets": [],
  "nativeCurrency": {
    "name": "ARTIS sigma1 Ether",
    "symbol": "ATS",
    "decimals": 18
  },
  "infoURL": "https://artis.eco",
  "shortName": "ats",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;