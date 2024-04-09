import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 914031,
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
  "name": "QR0408T1TS Testnet",
  "nativeCurrency": {
    "name": "QR0408T1TS Testnet Token",
    "symbol": "HOK",
    "decimals": 18
  },
  "networkId": 914031,
  "redFlags": [],
  "rpc": [
    "https://914031.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0408t1ts/testnet/rpc"
  ],
  "shortName": "QR0408T1TS Testnet",
  "slug": "qr0408t1ts-testnet",
  "testnet": true
} as const satisfies Chain;