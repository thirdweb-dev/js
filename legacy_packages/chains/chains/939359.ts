import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 939359,
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
  "name": "QR0501T1TS",
  "nativeCurrency": {
    "name": "QR0501T1TS Token",
    "symbol": "ZGM",
    "decimals": 18
  },
  "networkId": 939359,
  "redFlags": [],
  "rpc": [
    "https://939359.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0501t1ts/testnet/rpc"
  ],
  "shortName": "QR0501T1TS",
  "slug": "qr0501t1ts",
  "testnet": true
} as const satisfies Chain;