import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 62293,
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
  "name": "QI0516s1dev",
  "nativeCurrency": {
    "name": "QI0516s1dev Token",
    "symbol": "OMF",
    "decimals": 18
  },
  "networkId": 62293,
  "redFlags": [],
  "rpc": [
    "https://62293.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0516s1dev",
  "slug": "qi0516s1dev",
  "testnet": true
} as const satisfies Chain;