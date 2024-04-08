import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 99733,
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
  "name": "QaUser6779 Testnet",
  "nativeCurrency": {
    "name": "QaUser6779 Testnet Token",
    "symbol": "WAG",
    "decimals": 18
  },
  "networkId": 99733,
  "redFlags": [],
  "rpc": [
    "https://99733.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser6779 Testnet",
  "slug": "qauser6779-testnet",
  "testnet": true
} as const satisfies Chain;