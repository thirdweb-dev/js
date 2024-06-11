import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 12885,
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
  "name": "QI0603I3",
  "nativeCurrency": {
    "name": "QI0603I3 Token",
    "symbol": "UQI",
    "decimals": 18
  },
  "networkId": 12885,
  "redFlags": [],
  "rpc": [
    "https://12885.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0603I3",
  "slug": "qi0603i3",
  "testnet": true
} as const satisfies Chain;