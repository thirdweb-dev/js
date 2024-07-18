import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 8022,
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
  "name": "numine",
  "nativeCurrency": {
    "name": "numine Token",
    "symbol": "numine",
    "decimals": 18
  },
  "networkId": 8022,
  "redFlags": [],
  "rpc": [
    "https://8022.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-numine-vc73e.avax-test.network/ext/bc/26XPa2jA4T31hKmaUGJt3g32xwsbaUfvcnMx1m18dWmrgxV2Mw/rpc?token=5f79a4d7746a18615d32562a9f9f9c2e87cae9d9cad53a94f7a204cba2434058"
  ],
  "shortName": "numine",
  "slug": "numine",
  "testnet": true
} as const satisfies Chain;