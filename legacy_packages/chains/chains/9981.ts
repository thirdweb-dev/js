import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 9981,
  "explorers": [
    {
      "name": "Volley Mainnet Explorer",
      "url": "https://volleyscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": "svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "QaUser4131",
  "nativeCurrency": {
    "name": "QaUser4131 Token",
    "symbol": "SGT",
    "decimals": 18
  },
  "networkId": 9981,
  "redFlags": [],
  "rpc": [
    "https://9981.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc",
    "https://main-rpc.volleychain.com"
  ],
  "shortName": "QaUser4131",
  "slug": "qauser4131",
  "testnet": true
} as const satisfies Chain;