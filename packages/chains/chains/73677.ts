import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 73677,
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
  "name": "QaUser9318 Testnet",
  "nativeCurrency": {
    "name": "QaUser9318 Testnet Token",
    "symbol": "XUK",
    "decimals": 18
  },
  "networkId": 73677,
  "redFlags": [],
  "rpc": [
    "https://73677.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser9318 Testnet",
  "slug": "qauser9318-testnet",
  "testnet": true
} as const satisfies Chain;