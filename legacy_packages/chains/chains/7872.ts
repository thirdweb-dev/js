import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 7872,
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
  "name": "QAUSer4 Testnet",
  "nativeCurrency": {
    "name": "QAUSer4 Testnet Token",
    "symbol": "VVC",
    "decimals": 18
  },
  "networkId": 7872,
  "redFlags": [],
  "rpc": [
    "https://7872.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QAUSer4 Testnet",
  "slug": "qauser4-testnet",
  "testnet": true
} as const satisfies Chain;