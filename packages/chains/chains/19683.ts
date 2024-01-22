import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 19683,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": ".svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "ST 12-07 V1",
  "nativeCurrency": {
    "name": "ST 12-07 V1 Token",
    "symbol": "XRL",
    "decimals": 18
  },
  "networkId": 19683,
  "redFlags": [],
  "rpc": [
    "https://st-12-07-v1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://19683.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-test.io/d26b972e-1832-4d3a-bf7b-d0ce1f4331c2"
  ],
  "shortName": "ST 12-07 V1",
  "slug": "st-12-07-v1",
  "testnet": true
} as const satisfies Chain;