import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 33841,
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
  "name": "QI0422s2 Testnet",
  "nativeCurrency": {
    "name": "QI0422s2 Testnet Token",
    "symbol": "HOS",
    "decimals": 18
  },
  "networkId": 33841,
  "redFlags": [],
  "rpc": [
    "https://33841.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0422s2 Testnet",
  "slug": "qi0422s2-testnet",
  "testnet": true
} as const satisfies Chain;