import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 32517,
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
  "name": "QaUser4536 Testnet",
  "nativeCurrency": {
    "name": "QaUser4536 Testnet Token",
    "symbol": "ZKJ",
    "decimals": 18
  },
  "networkId": 32517,
  "redFlags": [],
  "rpc": [
    "https://32517.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser4536 Testnet",
  "slug": "qauser4536-testnet",
  "testnet": true
} as const satisfies Chain;