import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 55200,
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
  "name": "QaUser5256",
  "nativeCurrency": {
    "name": "QaUser5256 Token",
    "symbol": "UDQ",
    "decimals": 18
  },
  "networkId": 55200,
  "redFlags": [],
  "rpc": [
    "https://55200.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QaUser5256",
  "slug": "qauser5256",
  "testnet": true
} as const satisfies Chain;