import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 45544,
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
  "name": "QaUser6609 Testnet",
  "nativeCurrency": {
    "name": "QaUser6609 Testnet Token",
    "symbol": "NHU",
    "decimals": 18
  },
  "networkId": 45544,
  "redFlags": [],
  "rpc": [
    "https://45544.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser6609 Testnet",
  "slug": "qauser6609-testnet",
  "testnet": true
} as const satisfies Chain;