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
  "infoURL": "https://docs.metaplayer.one/",
  "name": "Metaplayerone Dubai Testnet",
  "nativeCurrency": {
    "name": "Metaunit",
    "symbol": "MEU",
    "decimals": 18
  },
  "networkId": 2124,
  "rpc": [
    "https://2124.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-dubai.mp1network.com/"
  ],
  "shortName": "MEU",
  "slip44": 1,
  "slug": "metaplayerone-dubai-testnet",
  "testnet": true
} as const satisfies Chain;