import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 78933,
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
  "name": "FST 12-22 V2",
  "nativeCurrency": {
    "name": "FST 12-22 V2 Token",
    "symbol": "EJJ",
    "decimals": 18
  },
  "networkId": 78933,
  "redFlags": [],
  "rpc": [
    "https://fst-12-22-v2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://78933.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "FST 12-22 V2",
  "slug": "fst-12-22-v2",
  "testnet": true
} as const satisfies Chain;