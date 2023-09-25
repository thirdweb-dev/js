import type { Chain } from "../src/types";
export default {
  "chainId": 250,
  "chain": "FTM",
  "name": "Fantom Opera",
  "rpc": [
    "https://fantom.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://fantom.publicnode.com",
    "https://fantom.publicnode.com",
    "https://rpc.ftm.tools"
  ],
  "slug": "fantom",
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/fantom/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Fantom",
    "symbol": "FTM",
    "decimals": 18
  },
  "infoURL": "https://fantom.foundation",
  "shortName": "ftm",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "ftmscan",
      "url": "https://ftmscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;