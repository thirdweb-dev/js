import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 50528,
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
  "name": "QaUser9606 Testnet",
  "nativeCurrency": {
    "name": "QaUser9606 Testnet Token",
    "symbol": "JTW",
    "decimals": 18
  },
  "networkId": 50528,
  "redFlags": [],
  "rpc": [
    "https://50528.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser9606 Testnet",
  "slug": "qauser9606-testnet",
  "testnet": true
} as const satisfies Chain;