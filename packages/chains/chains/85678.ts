import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 85678,
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
  "name": "QI0122I1 Testnet",
  "nativeCurrency": {
    "name": "QI0122I1 Testnet Token",
    "symbol": "KIP",
    "decimals": 18
  },
  "networkId": 85678,
  "redFlags": [],
  "rpc": [
    "https://85678.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0122I1 Testnet",
  "slug": "qi0122i1-testnet-qi0122i1 testnet-85678",
  "testnet": true
} as const satisfies Chain;