import type { Chain } from "../src/types";
export default {
  "chainId": 2124,
  "chain": "MP1 Dubai-Testnet",
  "name": "Metaplayerone Dubai Testnet",
  "rpc": [
    "https://metaplayerone-dubai-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-dubai.mp1network.com/"
  ],
  "slug": "metaplayerone-dubai-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Metaunit",
    "symbol": "MEU",
    "decimals": 18
  },
  "infoURL": "https://docs.metaplayer.one/",
  "shortName": "MEU",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "MP1Scan",
      "url": "https://dubai.mp1scan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;