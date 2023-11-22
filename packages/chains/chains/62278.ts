import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 62278,
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
  "name": "qi1121i1",
  "nativeCurrency": {
    "name": "qi1121i1 Token",
    "symbol": "SJOX",
    "decimals": 18
  },
  "networkId": 62278,
  "redFlags": [],
  "rpc": [
    "https://qi1121i1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://62278.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "qi1121i1",
  "slug": "qi1121i1",
  "testnet": true
} as const satisfies Chain;