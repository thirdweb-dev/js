import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 91513,
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
  "name": "Jambon Universe",
  "nativeCurrency": {
    "name": "Jambon Universe Token",
    "symbol": "NIX",
    "decimals": 18
  },
  "networkId": 91513,
  "redFlags": [],
  "rpc": [
    "https://91513.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/jambonuvrs/testnet/rpc"
  ],
  "shortName": "Jambon Universe",
  "slug": "jambon-universe",
  "testnet": true
} as const satisfies Chain;