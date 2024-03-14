import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 29645,
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
  "name": "QaUser6355 Testnet",
  "nativeCurrency": {
    "name": "QaUser6355 Testnet Token",
    "symbol": "MQO",
    "decimals": 18
  },
  "networkId": 29645,
  "redFlags": [],
  "rpc": [
    "https://29645.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser6355 Testnet",
  "slug": "qauser6355-testnet",
  "testnet": true
} as const satisfies Chain;