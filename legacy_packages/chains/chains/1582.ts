import type { Chain } from "../src/types";
export default {
  "chain": "gETH",
  "chainId": 1582,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafybeibfpls2ealp4e5fdeoxessfjjkldgjnrcx2erph7524pg7alskk6a/1f9cb.svg",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://bubstestnet.com",
  "name": "Bubs Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "gETH",
    "decimals": 18
  },
  "networkId": 1582,
  "redFlags": [],
  "rpc": [],
  "shortName": "Bubs",
  "slug": "bubs-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;