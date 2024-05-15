import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 72877,
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
  "name": "QaUser4 Testnet",
  "nativeCurrency": {
    "name": "QaUser4 Testnet Token",
    "symbol": "ZAG",
    "decimals": 18
  },
  "networkId": 72877,
  "redFlags": [],
  "rpc": [
    "https://72877.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser4 Testnet",
  "slug": "qauser4-testnet-qauser4 testnet-72877",
  "testnet": true
} as const satisfies Chain;