import type { Chain } from "../src/types";
export default {
  "chain": "MP1 Dubai-Testnet",
  "chainId": 2124,
  "explorers": [
    {
      "name": "MP1Scan",
      "url": "https://dubai.mp1scan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://docs.metaplayer.one/",
  "name": "Metaplayerone Dubai Testnet",
  "nativeCurrency": {
    "name": "Metaunit",
    "symbol": "MEU",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://metaplayerone-dubai-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-dubai.mp1network.com/"
  ],
  "shortName": "MEU",
  "slug": "metaplayerone-dubai-testnet",
  "testnet": true
} as const satisfies Chain;