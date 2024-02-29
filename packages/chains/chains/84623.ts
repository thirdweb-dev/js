import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 84623,
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
  "name": "QI M 2401221",
  "nativeCurrency": {
    "name": "QI M 2401221 Token",
    "symbol": "HZU",
    "decimals": 18
  },
  "networkId": 84623,
  "redFlags": [],
  "rpc": [
    "https://84623.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/f14d837e-de8f-446d-8222-0077f26e6694"
  ],
  "shortName": "QI M 2401221",
  "slug": "qi-m-2401221",
  "testnet": true
} as const satisfies Chain;