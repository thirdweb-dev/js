import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 929038,
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
  "name": "QR0215Y1MP",
  "nativeCurrency": {
    "name": "QR0215Y1MP Token",
    "symbol": "QAT",
    "decimals": 18
  },
  "networkId": 929038,
  "redFlags": [],
  "rpc": [
    "https://929038.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0215y1mp/mainnet/rpc"
  ],
  "shortName": "QR0215Y1MP",
  "slug": "qr0215y1mp",
  "testnet": false
} as const satisfies Chain;