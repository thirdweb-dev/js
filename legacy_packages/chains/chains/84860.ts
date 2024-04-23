import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 84860,
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
  "name": "QI0422I1 Testnet",
  "nativeCurrency": {
    "name": "QI0422I1 Testnet Token",
    "symbol": "LLV",
    "decimals": 18
  },
  "networkId": 84860,
  "redFlags": [],
  "rpc": [
    "https://84860.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0422I1 Testnet",
  "slug": "qi0422i1-testnet",
  "testnet": true
} as const satisfies Chain;