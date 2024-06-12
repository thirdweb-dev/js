import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 6213,
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
  "name": "QaUser8112",
  "nativeCurrency": {
    "name": "QaUser8112 Token",
    "symbol": "PEN",
    "decimals": 18
  },
  "networkId": 6213,
  "redFlags": [],
  "rpc": [
    "https://6213.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser8112",
  "slug": "qauser8112",
  "testnet": true
} as const satisfies Chain;