import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 40868,
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
  "name": "QaUser5110 Testnet",
  "nativeCurrency": {
    "name": "QaUser5110 Testnet Token",
    "symbol": "CRL",
    "decimals": 18
  },
  "networkId": 40868,
  "redFlags": [],
  "rpc": [
    "https://40868.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser5110 Testnet",
  "slug": "qauser5110-testnet",
  "testnet": true
} as const satisfies Chain;