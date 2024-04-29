import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 995201,
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
  "name": "QR0426T1TS",
  "nativeCurrency": {
    "name": "QR0426T1TS Token",
    "symbol": "XOF",
    "decimals": 18
  },
  "networkId": 995201,
  "redFlags": [],
  "rpc": [
    "https://995201.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0426t1ts/testnet/rpc"
  ],
  "shortName": "QR0426T1TS",
  "slug": "qr0426t1ts",
  "testnet": true
} as const satisfies Chain;