import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 10036,
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
  "name": "Innovo Markets Mainnet",
  "nativeCurrency": {
    "name": "Innovo Markets Mainnet Token",
    "symbol": "INN",
    "decimals": 18
  },
  "networkId": 10036,
  "redFlags": [],
  "rpc": [
    "https://10036.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/innovo/mainnet/rpc"
  ],
  "shortName": "Innovo Markets Mainnet",
  "slug": "innovo-markets",
  "testnet": false
} as const satisfies Chain;