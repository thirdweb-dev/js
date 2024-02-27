import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 83900,
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
  "name": "QI0122I1 Testnet",
  "nativeCurrency": {
    "name": "QI0122I1 Testnet Token",
    "symbol": "XTT",
    "decimals": 18
  },
  "networkId": 83900,
  "redFlags": [],
  "rpc": [
    "https://83900.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-test.io/a5f62fea-1375-4ddd-b88f-72b56b435259"
  ],
  "shortName": "QI0122I1 Testnet",
  "slug": "qi0122i1-testnet-qi0122i1 testnet",
  "testnet": true
} as const satisfies Chain;