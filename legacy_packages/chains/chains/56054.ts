import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 56054,
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
  "name": "QaUser4688",
  "nativeCurrency": {
    "name": "QaUser4688 Token",
    "symbol": "DPN",
    "decimals": 18
  },
  "networkId": 56054,
  "redFlags": [],
  "rpc": [
    "https://56054.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser4688",
  "slug": "qauser4688",
  "testnet": true
} as const satisfies Chain;