import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 21758,
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
  "name": "FST 01-16 Multi",
  "nativeCurrency": {
    "name": "FST 01-16 Multi Token",
    "symbol": "RUI",
    "decimals": 18
  },
  "networkId": 21758,
  "redFlags": [],
  "rpc": [
    "https://21758.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "FST 01-16 Multi",
  "slug": "fst-01-16-multi",
  "testnet": true
} as const satisfies Chain;