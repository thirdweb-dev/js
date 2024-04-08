import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 928010,
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
  "name": "QR0408T2TS Testnet",
  "nativeCurrency": {
    "name": "QR0408T2TS Testnet Token",
    "symbol": "XYZ",
    "decimals": 18
  },
  "networkId": 928010,
  "redFlags": [],
  "rpc": [
    "https://928010.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0408t2ts/testnet/rpc"
  ],
  "shortName": "QR0408T2TS Testnet",
  "slug": "qr0408t2ts-testnet",
  "testnet": true
} as const satisfies Chain;