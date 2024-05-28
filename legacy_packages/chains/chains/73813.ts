import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 73813,
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
  "name": "QIM2405082",
  "nativeCurrency": {
    "name": "QIM2405082 Token",
    "symbol": "WCC",
    "decimals": 18
  },
  "networkId": 73813,
  "redFlags": [],
  "rpc": [
    "https://73813.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QIM2405082",
  "slug": "qim2405082",
  "testnet": true
} as const satisfies Chain;