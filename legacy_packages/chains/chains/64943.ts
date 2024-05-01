import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 64943,
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
  "name": "QI0430I1",
  "nativeCurrency": {
    "name": "QI0430I1 Token",
    "symbol": "JIQ",
    "decimals": 18
  },
  "networkId": 64943,
  "redFlags": [],
  "rpc": [
    "https://64943.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0430I1",
  "slug": "qi0430i1-qi0430i1",
  "testnet": true
} as const satisfies Chain;