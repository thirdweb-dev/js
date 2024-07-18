import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 62454,
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
  "name": "QR0708T1TS",
  "nativeCurrency": {
    "name": "QR0708T1TS Token",
    "symbol": "AFH",
    "decimals": 18
  },
  "networkId": 62454,
  "redFlags": [],
  "rpc": [
    "https://62454.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-qr0708t1ts-x17f8.avax-test.network/ext/bc/7xh1BHRDzwVvbo7hnEyxiJcRr8XGvae4E9CYTreCv8xEj4keX/rpc?token=069106c959a59e709a8d93f1170654928f2216e08d07e2f1041ce1993c564f91"
  ],
  "shortName": "QR0708T1TS",
  "slug": "qr0708t1ts",
  "testnet": true
} as const satisfies Chain;