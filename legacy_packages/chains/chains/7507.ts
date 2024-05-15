import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 7507,
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
  "name": "QaUser7740 Testnet",
  "nativeCurrency": {
    "name": "QaUser7740 Testnet Token",
    "symbol": "RUI",
    "decimals": 18
  },
  "networkId": 7507,
  "redFlags": [],
  "rpc": [
    "https://7507.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser7740 Testnet",
  "slug": "qauser7740-testnet",
  "testnet": true
} as const satisfies Chain;