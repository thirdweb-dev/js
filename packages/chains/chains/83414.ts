import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 83414,
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
  "name": "Q IM 2402132",
  "nativeCurrency": {
    "name": "Q IM 2402132 Token",
    "symbol": "XVL",
    "decimals": 18
  },
  "networkId": 83414,
  "redFlags": [],
  "rpc": [
    "https://83414.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "Q IM 2402132",
  "slug": "q-im-2402132",
  "testnet": true
} as const satisfies Chain;