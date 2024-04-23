import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 68064,
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
  "name": "QaUser3451 Testnet",
  "nativeCurrency": {
    "name": "QaUser3451 Testnet Token",
    "symbol": "NKL",
    "decimals": 18
  },
  "networkId": 68064,
  "redFlags": [],
  "rpc": [
    "https://68064.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser3451 Testnet",
  "slug": "qauser3451-testnet",
  "testnet": true
} as const satisfies Chain;