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
  "infoURL": "https://arianee.org",
  "name": "Polygon Supernet Arianee",
  "nativeCurrency": {
    "name": "Arianee",
    "symbol": "ARIA20",
    "decimals": 18
  },
  "networkId": 11891,
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  },
  "rpc": [
    "https://11891.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.polygonsupernet.public.arianee.net"
  ],
  "shortName": "Arianee",
  "slug": "polygon-supernet-arianee",
  "testnet": false
} as const satisfies Chain;