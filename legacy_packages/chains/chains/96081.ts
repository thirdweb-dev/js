import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 96081,
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
  "name": "QaUser2213 Testnet",
  "nativeCurrency": {
    "name": "QaUser2213 Testnet Token",
    "symbol": "QLV",
    "decimals": 18
  },
  "networkId": 96081,
  "redFlags": [],
  "rpc": [
    "https://96081.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser2213 Testnet",
  "slug": "qauser2213-testnet",
  "testnet": true
} as const satisfies Chain;