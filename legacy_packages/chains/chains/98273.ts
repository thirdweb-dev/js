import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 98273,
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
  "name": "QI0520I1",
  "nativeCurrency": {
    "name": "QI0520I1 Token",
    "symbol": "YZG",
    "decimals": 18
  },
  "networkId": 98273,
  "redFlags": [],
  "rpc": [
    "https://98273.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0520I1",
  "slug": "qi0520i1",
  "testnet": true
} as const satisfies Chain;