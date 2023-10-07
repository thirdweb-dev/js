import type { Chain } from "../src/types";
export default {
  "chain": "Arianee",
  "chainId": 11891,
  "explorers": [
    {
      "name": "Polygon Supernet Arianee Explorer",
      "url": "https://polygonsupernet.explorer.arianee.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://arianee.org",
  "name": "Polygon Supernet Arianee",
  "nativeCurrency": {
    "name": "Arianee",
    "symbol": "ARIA20",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://polygon-supernet-arianee.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.polygonsupernet.public.arianee.net"
  ],
  "shortName": "Arianee",
  "slug": "polygon-supernet-arianee",
  "testnet": false
} as const satisfies Chain;