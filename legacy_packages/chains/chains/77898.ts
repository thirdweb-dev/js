import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 77898,
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
  "name": "QI0517I1",
  "nativeCurrency": {
    "name": "QI0517I1 Token",
    "symbol": "YGV",
    "decimals": 18
  },
  "networkId": 77898,
  "redFlags": [],
  "rpc": [
    "https://77898.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0517I1",
  "slug": "qi0517i1",
  "testnet": true
} as const satisfies Chain;