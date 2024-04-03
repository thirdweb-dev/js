import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 69399,
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
  "name": "QI0103I1",
  "nativeCurrency": {
    "name": "QI0103I1 Token",
    "symbol": "AYYX",
    "decimals": 18
  },
  "networkId": 69399,
  "redFlags": [],
  "rpc": [
    "https://69399.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0103I1",
  "slug": "qi0103i1",
  "testnet": true
} as const satisfies Chain;