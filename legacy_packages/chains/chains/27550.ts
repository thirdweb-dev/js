import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 27550,
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
  "name": "QIM2405065 NO INTEROP NO SIM",
  "nativeCurrency": {
    "name": "QIM2405065 NO INTEROP NO SIM Token",
    "symbol": "BLY",
    "decimals": 18
  },
  "networkId": 27550,
  "redFlags": [],
  "rpc": [
    "https://27550.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qim2405065/testnet/rpc"
  ],
  "shortName": "QIM2405065 NO INTEROP NO SIM",
  "slug": "qim2405065-no-interop-no-sim",
  "testnet": true
} as const satisfies Chain;