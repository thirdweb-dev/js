import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 39747,
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
  "name": "QaUser41Testnet",
  "nativeCurrency": {
    "name": "QaUser41Testnet Token",
    "symbol": "GYF",
    "decimals": 18
  },
  "networkId": 39747,
  "redFlags": [],
  "rpc": [
    "https://qauser41testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://39747.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser41Testnet",
  "slug": "qauser41testnet",
  "testnet": true
} as const satisfies Chain;