import type { Chain } from "../src/types";
export default {
  "name": "Polygon Supernet Arianee",
  "chain": "Arianee",
  "rpc": [
    "https://polygon-supernet-arianee.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.polygonsupernet.public.arianee.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Arianee",
    "symbol": "ARIA20",
    "decimals": 18
  },
  "infoURL": "https://arianee.org",
  "shortName": "Arianee",
  "chainId": 11891,
  "networkId": 11891,
  "explorers": [
    {
      "name": "Polygon Supernet Arianee Explorer",
      "url": "https://polygonsupernet.explorer.arianee.net",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "chain": "eip155-1",
    "type": "L2"
  },
  "testnet": false,
  "slug": "polygon-supernet-arianee"
} as const satisfies Chain;