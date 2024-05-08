import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 91924,
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
  "name": "QI0506I1",
  "nativeCurrency": {
    "name": "QI0506I1 Token",
    "symbol": "KQA",
    "decimals": 18
  },
  "networkId": 91924,
  "redFlags": [],
  "rpc": [
    "https://91924.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0506I1",
  "slug": "qi0506i1",
  "testnet": true
} as const satisfies Chain;