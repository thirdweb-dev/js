import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 54454,
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
  "name": "QIM2405063 INTEROP NO PRECOMPILE",
  "nativeCurrency": {
    "name": "QIM2405063 INTEROP NO PRECOMPILE Token",
    "symbol": "BLY",
    "decimals": 18
  },
  "networkId": 54454,
  "redFlags": [],
  "rpc": [
    "https://54454.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QIM2405063 INTEROP NO PRECOMPILE",
  "slug": "qim2405063-interop-no-precompile",
  "testnet": true
} as const satisfies Chain;