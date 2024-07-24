import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 22721,
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
  "name": "QR0701S1TS",
  "nativeCurrency": {
    "name": "QR0701S1TS Token",
    "symbol": "BHQ",
    "decimals": 18
  },
  "networkId": 22721,
  "redFlags": [],
  "rpc": [
    "https://22721.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-qr0701s1ts-b5089.avax-test.network/ext/bc/26cFteUtPKbyFiDzKKbV1t1PVhcLuXTfRnSh62Sqqd7VythcKJ/rpc?token=67052c49c6e612210e3b27042731ddcaf1cfe7f8c23f3e27c887ff52014b20b6"
  ],
  "shortName": "QR0701S1TS",
  "slug": "qr0701s1ts",
  "testnet": true
} as const satisfies Chain;