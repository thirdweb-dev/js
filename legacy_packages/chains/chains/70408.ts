import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 70408,
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
  "name": "QI0523T2TD",
  "nativeCurrency": {
    "name": "QI0523T2TD Token",
    "symbol": "WYI",
    "decimals": 18
  },
  "networkId": 70408,
  "redFlags": [],
  "rpc": [
    "https://70408.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0523T2TD",
  "slug": "qi0523t2td",
  "testnet": true
} as const satisfies Chain;