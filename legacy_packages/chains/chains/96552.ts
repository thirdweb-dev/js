import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 96552,
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
  "name": "QI032924 Testnet",
  "nativeCurrency": {
    "name": "QI032924 Testnet Token",
    "symbol": "KJA",
    "decimals": 18
  },
  "networkId": 96552,
  "redFlags": [],
  "rpc": [
    "https://96552.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI032924 Testnet",
  "slug": "qi032924-testnet",
  "testnet": true
} as const satisfies Chain;