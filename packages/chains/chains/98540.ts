import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 98540,
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
  "name": "QI1212I5",
  "nativeCurrency": {
    "name": "QI1212I5 Token",
    "symbol": "HSCX",
    "decimals": 18
  },
  "networkId": 98540,
  "redFlags": [],
  "rpc": [
    "https://98540.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-test.io/ba4e7766-4bc6-44ec-b43f-598647b4ee71"
  ],
  "shortName": "QI1212I5",
  "slug": "qi1212i5",
  "testnet": true
} as const satisfies Chain;