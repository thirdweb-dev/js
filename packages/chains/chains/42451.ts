import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 42451,
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
  "name": "QI1220s1",
  "nativeCurrency": {
    "name": "QI1220s1 Token",
    "symbol": "BKX",
    "decimals": 18
  },
  "networkId": 42451,
  "redFlags": [],
  "rpc": [
    "https://42451.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI1220s1",
  "slug": "qi1220s1",
  "testnet": true
} as const satisfies Chain;