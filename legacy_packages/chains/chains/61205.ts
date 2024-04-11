import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 61205,
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
  "name": "QaUser6116 Testnet",
  "nativeCurrency": {
    "name": "QaUser6116 Testnet Token",
    "symbol": "YLJ",
    "decimals": 18
  },
  "networkId": 61205,
  "redFlags": [],
  "rpc": [
    "https://61205.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser6116 Testnet",
  "slug": "qauser6116-testnet",
  "testnet": true
} as const satisfies Chain;