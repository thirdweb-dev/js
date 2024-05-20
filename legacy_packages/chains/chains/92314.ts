import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 92314,
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
  "name": "QIM 2405081",
  "nativeCurrency": {
    "name": "QIM 2405081 Token",
    "symbol": "WCC",
    "decimals": 18
  },
  "networkId": 92314,
  "redFlags": [],
  "rpc": [
    "https://92314.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/f069738d-9c43-497b-96c1-9dda60d647e2"
  ],
  "shortName": "QIM 2405081",
  "slug": "qim-2405081",
  "testnet": true
} as const satisfies Chain;