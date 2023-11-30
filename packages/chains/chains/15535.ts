import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 15535,
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
  "name": "QI M 11271",
  "nativeCurrency": {
    "name": "QI M 11271 Token",
    "symbol": "JZW",
    "decimals": 18
  },
  "networkId": 15535,
  "redFlags": [],
  "rpc": [
    "https://qi-m-11271.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://15535.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/a47e1c06-fa75-4536-a900-1574d198e197"
  ],
  "shortName": "QI M 11271",
  "slug": "qi-m-11271",
  "testnet": true
} as const satisfies Chain;