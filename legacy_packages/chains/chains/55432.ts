import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 55432,
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
  "name": "QIM DEMO 0527",
  "nativeCurrency": {
    "name": "QIM DEMO 0527 Token",
    "symbol": "WCC",
    "decimals": 18
  },
  "networkId": 55432,
  "redFlags": [],
  "rpc": [
    "https://55432.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qimdemo052/testnet/rpc"
  ],
  "shortName": "QIM DEMO 0527",
  "slug": "qim-demo-0527",
  "testnet": true
} as const satisfies Chain;