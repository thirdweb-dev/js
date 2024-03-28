import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 76950,
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
  "name": "QI1204I2",
  "nativeCurrency": {
    "name": "QI1204I2 Token",
    "symbol": "BHOX",
    "decimals": 18
  },
  "networkId": 76950,
  "redFlags": [],
  "rpc": [
    "https://76950.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-test.io/ba4e7766-4bc6-44ec-b43f-598647b4ee71"
  ],
  "shortName": "QI1204I2",
  "slug": "qi1204i2",
  "testnet": true
} as const satisfies Chain;