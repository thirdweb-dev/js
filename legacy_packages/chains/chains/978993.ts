import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 978993,
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
  "name": "QR0318T1TS Testnet",
  "nativeCurrency": {
    "name": "QR0318T1TS Testnet Token",
    "symbol": "OSF",
    "decimals": 18
  },
  "networkId": 978993,
  "redFlags": [],
  "rpc": [
    "https://978993.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0318t1ts/testnet/rpc"
  ],
  "shortName": "QR0318T1TS Testnet",
  "slug": "qr0318t1ts-testnet",
  "testnet": true
} as const satisfies Chain;