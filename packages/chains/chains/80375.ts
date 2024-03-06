import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 80375,
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
  "name": "qr0103y1s",
  "nativeCurrency": {
    "name": "qr0103y1s Token",
    "symbol": "IJB",
    "decimals": 18
  },
  "networkId": 80375,
  "redFlags": [],
  "rpc": [
    "https://80375.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0103y1s/testnet/rpc"
  ],
  "shortName": "qr0103y1s",
  "slug": "qr0103y1s",
  "testnet": true
} as const satisfies Chain;