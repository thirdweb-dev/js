import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 64092,
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
  "name": "QaUser3186 Testnet",
  "nativeCurrency": {
    "name": "QaUser3186 Testnet Token",
    "symbol": "KII",
    "decimals": 18
  },
  "networkId": 64092,
  "redFlags": [],
  "rpc": [
    "https://64092.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser3186 Testnet",
  "slug": "qauser3186-testnet",
  "testnet": true
} as const satisfies Chain;