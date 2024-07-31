import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 16680,
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
  "name": "QI0627S1TS",
  "nativeCurrency": {
    "name": "QI0627S1TS Token",
    "symbol": "JEU",
    "decimals": 18
  },
  "networkId": 16680,
  "redFlags": [],
  "rpc": [
    "https://16680.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-bestname10-a4ea7.avax-test.network/ext/bc/M4SdtZY7dfiwdJQdjcT3UL5gXY1RDdvRt5Z8BgACfAdWy8LGY/rpc?token=c052be2f5a4c2a771d71fc4970c42b184ac2e74ad325fdbac02b5556723868c2"
  ],
  "shortName": "QI0627S1TS",
  "slug": "qi0627s1ts",
  "testnet": true
} as const satisfies Chain;