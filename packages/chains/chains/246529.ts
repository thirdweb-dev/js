import type { Chain } from "../src/types";
export default {
  "chain": "ARTIS",
  "chainId": 246529,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://artis.eco",
  "name": "ARTIS sigma1",
  "nativeCurrency": {
    "name": "ARTIS sigma1 Ether",
    "symbol": "ATS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://artis-sigma1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.sigma1.artis.network"
  ],
  "shortName": "ats",
  "slug": "artis-sigma1",
  "testnet": false
} as const satisfies Chain;