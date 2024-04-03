import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 87460,
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
  "name": "QaUser1360 Testnet",
  "nativeCurrency": {
    "name": "QaUser1360 Testnet Token",
    "symbol": "KYP",
    "decimals": 18
  },
  "networkId": 87460,
  "redFlags": [],
  "rpc": [
    "https://87460.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser1360 Testnet",
  "slug": "qauser1360-testnet",
  "testnet": true
} as const satisfies Chain;