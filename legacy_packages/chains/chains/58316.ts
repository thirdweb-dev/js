import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 58316,
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
  "name": "QaUser1943 Testnet",
  "nativeCurrency": {
    "name": "QaUser1943 Testnet Token",
    "symbol": "JAI",
    "decimals": 18
  },
  "networkId": 58316,
  "redFlags": [],
  "rpc": [
    "https://58316.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser1943 Testnet",
  "slug": "qauser1943-testnet",
  "testnet": true
} as const satisfies Chain;