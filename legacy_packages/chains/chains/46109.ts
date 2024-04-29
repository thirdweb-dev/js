import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 46109,
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
  "name": "qr0224t1tp Testnet",
  "nativeCurrency": {
    "name": "qr0224t1tp Testnet Token",
    "symbol": "CRH",
    "decimals": 18
  },
  "networkId": 46109,
  "redFlags": [],
  "rpc": [
    "https://46109.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0224t1tp/testnet/rpc"
  ],
  "shortName": "qr0224t1tp Testnet",
  "slug": "qr0224t1tp-testnet",
  "testnet": true
} as const satisfies Chain;