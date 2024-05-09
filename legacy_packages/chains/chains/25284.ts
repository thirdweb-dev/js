import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 25284,
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
  "name": "QIM2405021",
  "nativeCurrency": {
    "name": "QIM2405021 Token",
    "symbol": "UZP",
    "decimals": 18
  },
  "networkId": 25284,
  "redFlags": [],
  "rpc": [
    "https://25284.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QIM2405021",
  "slug": "qim2405021",
  "testnet": true
} as const satisfies Chain;