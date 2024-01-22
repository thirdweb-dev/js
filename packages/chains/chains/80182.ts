import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 80182,
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
  "name": "QI M 12051",
  "nativeCurrency": {
    "name": "QI M 12051 Token",
    "symbol": "VTV",
    "decimals": 18
  },
  "networkId": 80182,
  "redFlags": [],
  "rpc": [
    "https://qi-m-12051.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://80182.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/b19c9e32-f359-451f-ad15-7ec784625c04"
  ],
  "shortName": "QI M 12051",
  "slug": "qi-m-12051",
  "testnet": true
} as const satisfies Chain;