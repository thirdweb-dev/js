import type { Chain } from "../src/types";
export default {
  "chain": "ARTIS",
  "chainId": 246529,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://artis.eco",
  "name": "ARTIS sigma1",
  "nativeCurrency": {
    "name": "ARTIS sigma1 Ether",
    "symbol": "ATS",
    "decimals": 18
  },
  "networkId": 246529,
  "rpc": [
    "https://artis-sigma1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://246529.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.sigma1.artis.network"
  ],
  "shortName": "ats",
  "slip44": 246529,
  "slug": "artis-sigma1",
  "testnet": false
} as const satisfies Chain;