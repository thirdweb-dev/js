import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 67451,
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
  "name": "QaUser6097 Testnet",
  "nativeCurrency": {
    "name": "QaUser6097 Testnet Token",
    "symbol": "NHU",
    "decimals": 18
  },
  "networkId": 67451,
  "redFlags": [],
  "rpc": [
    "https://67451.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser6097 Testnet",
  "slug": "qauser6097-testnet",
  "testnet": true
} as const satisfies Chain;