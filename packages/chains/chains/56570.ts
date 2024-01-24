import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 56570,
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
  "name": "QaUser4Testnet",
  "nativeCurrency": {
    "name": "QaUser4Testnet Token",
    "symbol": "GYF",
    "decimals": 18
  },
  "networkId": 56570,
  "redFlags": [],
  "rpc": [
    "https://qauser4testnet-qauser4testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://56570.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser4Testnet",
  "slug": "qauser4testnet-qauser4testnet",
  "testnet": true
} as const satisfies Chain;