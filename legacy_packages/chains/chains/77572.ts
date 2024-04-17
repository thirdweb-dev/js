import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 77572,
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
  "name": "QaUser0993 Testnet",
  "nativeCurrency": {
    "name": "QaUser0993 Testnet Token",
    "symbol": "JOE",
    "decimals": 18
  },
  "networkId": 77572,
  "redFlags": [],
  "rpc": [
    "https://77572.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser0993 Testnet",
  "slug": "qauser0993-testnet",
  "testnet": true
} as const satisfies Chain;