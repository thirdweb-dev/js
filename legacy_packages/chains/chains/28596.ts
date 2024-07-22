import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 28596,
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
  "name": "QR0715S1TS",
  "nativeCurrency": {
    "name": "QR0715S1TS Token",
    "symbol": "XPQ",
    "decimals": 18
  },
  "networkId": 28596,
  "redFlags": [],
  "rpc": [
    "https://28596.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-qr0715s1ts-f9cf4.avax-test.network/ext/bc/2Y3tY5z3xtrjv3PyKsgK7mQ5XNiQMcV71SVWyifirbTjnyY5fX/rpc?token=c9517b8f6efa8e63ff559ec29d189e9c6c71fe6f9e2baf2767d4881dad5d15ed"
  ],
  "shortName": "QR0715S1TS",
  "slug": "qr0715s1ts",
  "testnet": true
} as const satisfies Chain;