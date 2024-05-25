import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 996699,
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
  "name": "QR0521T1TS",
  "nativeCurrency": {
    "name": "QR0521T1TS Token",
    "symbol": "ATH",
    "decimals": 18
  },
  "networkId": 996699,
  "redFlags": [],
  "rpc": [
    "https://996699.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0521t1ts/testnet/rpc"
  ],
  "shortName": "QR0521T1TS",
  "slug": "qr0521t1ts",
  "testnet": true
} as const satisfies Chain;