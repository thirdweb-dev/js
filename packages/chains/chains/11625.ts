import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 11625,
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
  "name": "QI M 202402121",
  "nativeCurrency": {
    "name": "QI M 202402121 Token",
    "symbol": "CYB",
    "decimals": 18
  },
  "networkId": 11625,
  "redFlags": [],
  "rpc": [
    "https://11625.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI M 202402121",
  "slug": "qi-m-202402121",
  "testnet": true
} as const satisfies Chain;