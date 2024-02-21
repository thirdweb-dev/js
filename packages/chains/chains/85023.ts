import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 85023,
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
  "name": "NishiOgikubo Subnet",
  "nativeCurrency": {
    "name": "NishiOgikubo Subnet Token",
    "symbol": "NOS",
    "decimals": 18
  },
  "networkId": 85023,
  "redFlags": [],
  "rpc": [
    "https://85023.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/nishiogiku/testnet/rpc"
  ],
  "shortName": "NishiOgikubo Subnet",
  "slug": "nishiogikubo-subnet",
  "testnet": true
} as const satisfies Chain;