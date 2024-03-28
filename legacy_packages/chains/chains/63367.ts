import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 63367,
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
  "name": "ReSFT 1-16-24",
  "nativeCurrency": {
    "name": "ReSFT 1-16-24 Token",
    "symbol": "ZAF",
    "decimals": 18
  },
  "networkId": 63367,
  "redFlags": [],
  "rpc": [
    "https://63367.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "ReSFT 1-16-24",
  "slug": "resft-1-16-24",
  "testnet": true
} as const satisfies Chain;