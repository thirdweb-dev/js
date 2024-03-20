import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 52150,
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
  "name": "QI0304I1 Testnet",
  "nativeCurrency": {
    "name": "QI0304I1 Testnet Token",
    "symbol": "LOD",
    "decimals": 18
  },
  "networkId": 52150,
  "redFlags": [],
  "rpc": [
    "https://52150.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0304I1 Testnet",
  "slug": "qi0304i1-testnet",
  "testnet": true
} as const satisfies Chain;