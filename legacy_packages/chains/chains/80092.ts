import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 80092,
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
  "name": "QaUser4009",
  "nativeCurrency": {
    "name": "QaUser4009 Token",
    "symbol": "MHP",
    "decimals": 18
  },
  "networkId": 80092,
  "redFlags": [],
  "rpc": [
    "https://80092.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser4009",
  "slug": "qauser4009",
  "testnet": true
} as const satisfies Chain;