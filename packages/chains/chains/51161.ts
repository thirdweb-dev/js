import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 51161,
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
  "name": "QI1212I6",
  "nativeCurrency": {
    "name": "QI1212I6 Token",
    "symbol": "HSCX",
    "decimals": 18
  },
  "networkId": 51161,
  "redFlags": [],
  "rpc": [
    "https://51161.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI1212I6",
  "slug": "qi1212i6",
  "testnet": true
} as const satisfies Chain;