import type { Chain } from "../src/types";
export default {
  "chainId": 11891,
  "chain": "Arianee",
  "name": "Polygon Supernet Arianee",
  "rpc": [
    "https://polygon-supernet-arianee.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.polygonsupernet.public.arianee.net"
  ],
  "slug": "polygon-supernet-arianee",
  "faucets": [],
  "nativeCurrency": {
    "name": "Arianee",
    "symbol": "ARIA20",
    "decimals": 18
  },
  "infoURL": "https://arianee.org",
  "shortName": "Arianee",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Polygon Supernet Arianee Explorer",
      "url": "https://polygonsupernet.explorer.arianee.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;