import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 51277,
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
  "name": "QI0344s1 Testne",
  "nativeCurrency": {
    "name": "QI0344s1 Testne Token",
    "symbol": "LKG",
    "decimals": 18
  },
  "networkId": 51277,
  "redFlags": [],
  "rpc": [
    "https://51277.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0344s1 Testne",
  "slug": "qi0344s1-testne",
  "testnet": true
} as const satisfies Chain;