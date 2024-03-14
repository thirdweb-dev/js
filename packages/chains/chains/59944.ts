import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 59944,
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
  "name": "QaUser7920 Testnet",
  "nativeCurrency": {
    "name": "QaUser7920 Testnet Token",
    "symbol": "USH",
    "decimals": 18
  },
  "networkId": 59944,
  "redFlags": [],
  "rpc": [
    "https://59944.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser7920 Testnet",
  "slug": "qauser7920-testnet",
  "testnet": true
} as const satisfies Chain;