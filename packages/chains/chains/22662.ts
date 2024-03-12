import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 22662,
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
  "name": "QA5-03-07 Testnet",
  "nativeCurrency": {
    "name": "QA5-03-07 Testnet Token",
    "symbol": "TYP",
    "decimals": 18
  },
  "networkId": 22662,
  "redFlags": [],
  "rpc": [
    "https://22662.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QA5-03-07 Testnet",
  "slug": "qa5-03-07-testnet",
  "testnet": true
} as const satisfies Chain;