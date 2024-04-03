import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 92978,
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
  "name": "QaUser4903 Testnet",
  "nativeCurrency": {
    "name": "QaUser4903 Testnet Token",
    "symbol": "CQS",
    "decimals": 18
  },
  "networkId": 92978,
  "redFlags": [],
  "rpc": [
    "https://92978.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser4903 Testnet",
  "slug": "qauser4903-testnet",
  "testnet": true
} as const satisfies Chain;