import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 7865,
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
  "name": "ST 02-07",
  "nativeCurrency": {
    "name": "ST 02-07 Token",
    "symbol": "TJO",
    "decimals": 18
  },
  "networkId": 7865,
  "redFlags": [],
  "rpc": [
    "https://st-02-07.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://7865.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "ST 02-07",
  "slug": "st-02-07",
  "testnet": true
} as const satisfies Chain;