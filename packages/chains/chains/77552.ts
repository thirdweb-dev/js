import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 77552,
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
  "name": "QaUser3673 Testnet",
  "nativeCurrency": {
    "name": "QaUser3673 Testnet Token",
    "symbol": "YSI",
    "decimals": 18
  },
  "networkId": 77552,
  "redFlags": [],
  "rpc": [
    "https://77552.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser3673 Testnet",
  "slug": "qauser3673-testnet",
  "testnet": true
} as const satisfies Chain;