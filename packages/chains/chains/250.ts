import type { Chain } from "../src/types";
export default {
  "chain": "FTM",
  "chainId": 250,
  "explorers": [
    {
      "name": "ftmscan",
      "url": "https://ftmscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/fantom/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://fantom.foundation",
  "name": "Fantom Opera",
  "nativeCurrency": {
    "name": "Fantom",
    "symbol": "FTM",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://fantom.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://fantom.publicnode.com",
    "https://fantom.publicnode.com",
    "https://rpc.ftm.tools"
  ],
  "shortName": "ftm",
  "slug": "fantom",
  "testnet": false
} as const satisfies Chain;