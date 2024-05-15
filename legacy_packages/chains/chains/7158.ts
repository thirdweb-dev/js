import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 7158,
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
  "name": "TESTNet FirstTEST",
  "nativeCurrency": {
    "name": "TESTNet FirstTEST Token",
    "symbol": "TEST",
    "decimals": 18
  },
  "networkId": 7158,
  "redFlags": [],
  "rpc": [
    "https://7158.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/testnetfir/testnet/rpc"
  ],
  "shortName": "TESTNet FirstTEST",
  "slug": "testnet-firsttest",
  "testnet": true
} as const satisfies Chain;