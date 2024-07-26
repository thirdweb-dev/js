import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 85677,
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
  "name": "QR0715T1TS",
  "nativeCurrency": {
    "name": "QR0715T1TS Token",
    "symbol": "EAK",
    "decimals": 18
  },
  "networkId": 85677,
  "redFlags": [],
  "rpc": [
    "https://85677.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-qr0715t1ts-yf0a5.avax-test.network/ext/bc/2gQwUZaBTv3iQz8uwQxXsnvi3vfspG5SW92MmmopZm8A3quaho/rpc?token=633edede6b5a8f598ccbee755c42d04d0483bf02e0f0b150974809aa91872a89"
  ],
  "shortName": "QR0715T1TS",
  "slug": "qr0715t1ts",
  "testnet": true
} as const satisfies Chain;