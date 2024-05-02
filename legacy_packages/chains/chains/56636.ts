import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 56636,
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
  "name": "QI0429I3",
  "nativeCurrency": {
    "name": "QI0429I3 Token",
    "symbol": "IJK",
    "decimals": 18
  },
  "networkId": 56636,
  "redFlags": [],
  "rpc": [
    "https://56636.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-test.io/b6421f40-aa32-4cdc-98f2-bf22d0db7b4f"
  ],
  "shortName": "QI0429I3",
  "slug": "qi0429i3",
  "testnet": true
} as const satisfies Chain;