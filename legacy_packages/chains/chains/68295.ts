import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 68295,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": "svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "qr0116y1s",
  "nativeCurrency": {
    "name": "qr0116y1s Token",
    "symbol": "ANG",
    "decimals": 18
  },
  "networkId": 68295,
  "redFlags": [],
  "rpc": [
    "https://68295.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0116y1s/testnet/rpc"
  ],
  "shortName": "qr0116y1s",
  "slug": "qr0116y1s",
  "testnet": true
} as const satisfies Chain;