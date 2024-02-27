import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 993535,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": ".svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "qr1120y1",
  "nativeCurrency": {
    "name": "qr1120y1 Token",
    "symbol": "LMK",
    "decimals": 18
  },
  "networkId": 993535,
  "redFlags": [],
  "rpc": [
    "https://993535.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr1120y1/testnet/rpc"
  ],
  "shortName": "qr1120y1",
  "slug": "qr1120y1",
  "testnet": true
} as const satisfies Chain;