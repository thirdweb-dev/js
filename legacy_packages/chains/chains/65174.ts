import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 65174,
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
  "name": "QaUser9821 Testnet",
  "nativeCurrency": {
    "name": "QaUser9821 Testnet Token",
    "symbol": "HKL",
    "decimals": 18
  },
  "networkId": 65174,
  "redFlags": [],
  "rpc": [
    "https://65174.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser9821 Testnet",
  "slug": "qauser9821-testnet",
  "testnet": true
} as const satisfies Chain;