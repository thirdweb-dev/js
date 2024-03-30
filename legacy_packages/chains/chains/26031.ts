import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 26031,
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
  "name": "QaUser7894 Testnet",
  "nativeCurrency": {
    "name": "QaUser7894 Testnet Token",
    "symbol": "YUT",
    "decimals": 18
  },
  "networkId": 26031,
  "redFlags": [],
  "rpc": [
    "https://26031.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser7894 Testnet",
  "slug": "qauser7894-testnet",
  "testnet": true
} as const satisfies Chain;