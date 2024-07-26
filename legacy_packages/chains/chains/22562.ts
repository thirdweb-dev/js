import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 22562,
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
  "name": "QR0708S1TS",
  "nativeCurrency": {
    "name": "QR0708S1TS Token",
    "symbol": "QIA",
    "decimals": 18
  },
  "networkId": 22562,
  "redFlags": [],
  "rpc": [
    "https://22562.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-qr0708s1ts-a41a7.avax-test.network/ext/bc/xWY9qgnqRgxxpAiZ5xMhoZ3K68JgcDhbKTT2FJAyUXkjVzNiL/rpc?token=34b52f712e1f25b3db1f47e6f79a3f93a6d30d8d55b02ca1446c3a30610d6fc4"
  ],
  "shortName": "QR0708S1TS",
  "slug": "qr0708s1ts",
  "testnet": true
} as const satisfies Chain;