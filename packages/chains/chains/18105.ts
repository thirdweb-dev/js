import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 18105,
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
  "name": "Found Test",
  "nativeCurrency": {
    "name": "Found Test Token",
    "symbol": "TVJ",
    "decimals": 18
  },
  "networkId": 18105,
  "redFlags": [],
  "rpc": [
    "https://found-test.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://18105.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "Found Test",
  "slug": "found-test",
  "testnet": true
} as const satisfies Chain;