import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 70341,
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
  "name": "QaUser1957 Testnet",
  "nativeCurrency": {
    "name": "QaUser1957 Testnet Token",
    "symbol": "AKI",
    "decimals": 18
  },
  "networkId": 70341,
  "redFlags": [],
  "rpc": [
    "https://70341.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser1957 Testnet",
  "slug": "qauser1957-testnet",
  "testnet": true
} as const satisfies Chain;