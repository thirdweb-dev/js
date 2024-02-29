import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 92850,
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
  "name": "QI1212I3",
  "nativeCurrency": {
    "name": "QI1212I3 Token",
    "symbol": "HSCX",
    "decimals": 18
  },
  "networkId": 92850,
  "redFlags": [],
  "rpc": [
    "https://92850.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI1212I3",
  "slug": "qi1212i3",
  "testnet": true
} as const satisfies Chain;