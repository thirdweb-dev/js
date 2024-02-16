import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 54414,
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
  "name": "Innovo Markets Testnet",
  "nativeCurrency": {
    "name": "Innovo Markets Testnet Token",
    "symbol": "INN",
    "decimals": 18
  },
  "networkId": 54414,
  "redFlags": [],
  "rpc": [
    "https://innovo-markets-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://54414.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/innovomark/testnet/rpc"
  ],
  "shortName": "Innovo Markets Testnet",
  "slug": "innovo-markets-testnet",
  "testnet": true
} as const satisfies Chain;