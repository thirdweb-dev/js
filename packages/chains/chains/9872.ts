import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 9872,
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
  "name": "QaUser0507 Testnet",
  "nativeCurrency": {
    "name": "QaUser0507 Testnet Token",
    "symbol": "KQA",
    "decimals": 18
  },
  "networkId": 9872,
  "redFlags": [],
  "rpc": [
    "https://9872.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser0507 Testnet",
  "slug": "qauser0507-testnet",
  "testnet": true
} as const satisfies Chain;