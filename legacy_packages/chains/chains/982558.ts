import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 982558,
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
  "name": "QR0429T1TS",
  "nativeCurrency": {
    "name": "QR0429T1TS Token",
    "symbol": "EXT",
    "decimals": 18
  },
  "networkId": 982558,
  "redFlags": [],
  "rpc": [
    "https://982558.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0429t1ts/testnet/rpc"
  ],
  "shortName": "QR0429T1TS",
  "slug": "qr0429t1ts",
  "testnet": true
} as const satisfies Chain;