import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 65300,
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
  "name": "QaUser46 Testnet",
  "nativeCurrency": {
    "name": "QaUser46 Testnet Token",
    "symbol": "ZAG",
    "decimals": 18
  },
  "networkId": 65300,
  "redFlags": [],
  "rpc": [
    "https://65300.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser46 Testnet",
  "slug": "qauser46-testnet",
  "testnet": true
} as const satisfies Chain;