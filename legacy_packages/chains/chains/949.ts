import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 949,
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
  "name": "QI0521s5t",
  "nativeCurrency": {
    "name": "QI0521s5t Token",
    "symbol": "VTV",
    "decimals": 18
  },
  "networkId": 949,
  "redFlags": [],
  "rpc": [
    "https://949.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0521s5t",
  "slug": "qi0521s5t",
  "testnet": true
} as const satisfies Chain;