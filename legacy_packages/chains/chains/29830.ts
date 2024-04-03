import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 29830,
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
  "name": "QaUser6165 Testnet",
  "nativeCurrency": {
    "name": "QaUser6165 Testnet Token",
    "symbol": "TGQ",
    "decimals": 18
  },
  "networkId": 29830,
  "redFlags": [],
  "rpc": [
    "https://29830.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser6165 Testnet",
  "slug": "qauser6165-testnet",
  "testnet": true
} as const satisfies Chain;