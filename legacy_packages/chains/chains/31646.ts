import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 31646,
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
  "name": "QaUser9492 Testnet",
  "nativeCurrency": {
    "name": "QaUser9492 Testnet Token",
    "symbol": "UVI",
    "decimals": 18
  },
  "networkId": 31646,
  "redFlags": [],
  "rpc": [
    "https://31646.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser9492 Testnet",
  "slug": "qauser9492-testnet",
  "testnet": true
} as const satisfies Chain;