import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 68042,
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
  "name": "QI0514s1",
  "nativeCurrency": {
    "name": "QI0514s1 Token",
    "symbol": "TQA",
    "decimals": 18
  },
  "networkId": 68042,
  "redFlags": [],
  "rpc": [
    "https://68042.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0514s1",
  "slug": "qi0514s1",
  "testnet": true
} as const satisfies Chain;