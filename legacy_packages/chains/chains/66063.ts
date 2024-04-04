import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 66063,
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
  "name": "QaUser3324 Testnet",
  "nativeCurrency": {
    "name": "QaUser3324 Testnet Token",
    "symbol": "IYM",
    "decimals": 18
  },
  "networkId": 66063,
  "redFlags": [],
  "rpc": [
    "https://66063.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser3324 Testnet",
  "slug": "qauser3324-testnet",
  "testnet": true
} as const satisfies Chain;