import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 36530,
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
  "name": "Will's Super Subnet",
  "nativeCurrency": {
    "name": "Will's Super Subnet Token",
    "symbol": "VRJ",
    "decimals": 18
  },
  "networkId": 36530,
  "redFlags": [],
  "rpc": [
    "https://36530.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "Will's Super Subnet",
  "slug": "will-s-super-subnet",
  "testnet": true
} as const satisfies Chain;