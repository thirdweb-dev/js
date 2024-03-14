import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 66904,
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
  "name": "QaUser1335 Testnet",
  "nativeCurrency": {
    "name": "QaUser1335 Testnet Token",
    "symbol": "KFZ",
    "decimals": 18
  },
  "networkId": 66904,
  "redFlags": [],
  "rpc": [
    "https://66904.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser1335 Testnet",
  "slug": "qauser1335-testnet",
  "testnet": true
} as const satisfies Chain;