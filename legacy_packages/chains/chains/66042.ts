import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 66042,
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
  "name": "QI0408I1 Testnet",
  "nativeCurrency": {
    "name": "QI0408I1 Testnet Token",
    "symbol": "YXE",
    "decimals": 18
  },
  "networkId": 66042,
  "redFlags": [],
  "rpc": [
    "https://66042.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0408I1 Testnet",
  "slug": "qi0408i1-testnet",
  "testnet": true
} as const satisfies Chain;