import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 82261,
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
  "name": "QI0423s1 Testnet",
  "nativeCurrency": {
    "name": "QI0423s1 Testnet Token",
    "symbol": "PUU",
    "decimals": 18
  },
  "networkId": 82261,
  "redFlags": [],
  "rpc": [
    "https://82261.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0423s1 Testnet",
  "slug": "qi0423s1-testnet",
  "testnet": true
} as const satisfies Chain;