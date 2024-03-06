import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 99132,
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
  "name": "QI0222I1",
  "nativeCurrency": {
    "name": "QI0222I1 Token",
    "symbol": "ZKUx",
    "decimals": 18
  },
  "networkId": 99132,
  "redFlags": [],
  "rpc": [
    "https://99132.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0222I1",
  "slug": "qi0222i1",
  "testnet": true
} as const satisfies Chain;