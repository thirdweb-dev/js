import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 77576,
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
  "name": "QaUser6624 Testnet",
  "nativeCurrency": {
    "name": "QaUser6624 Testnet Token",
    "symbol": "WVN",
    "decimals": 18
  },
  "networkId": 77576,
  "redFlags": [],
  "rpc": [
    "https://77576.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser6624 Testnet",
  "slug": "qauser6624-testnet",
  "testnet": true
} as const satisfies Chain;