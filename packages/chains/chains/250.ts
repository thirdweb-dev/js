import type { Chain } from "../src/types";
export default {
  "name": "Fantom Opera",
  "chain": "FTM",
  "rpc": [
    "https://fantom.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://fantom.publicnode.com",
    "https://fantom.publicnode.com",
    "https://rpc.ftm.tools"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Fantom",
    "symbol": "FTM",
    "decimals": 18
  },
  "infoURL": "https://fantom.foundation",
  "shortName": "ftm",
  "chainId": 250,
  "networkId": 250,
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/fantom/512.png",
    "height": 512,
    "width": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "ftmscan",
      "url": "https://ftmscan.com",
      "icon": {
        "url": "ipfs://QmRqbK449Fo9sJ3xMpkPbg6uV1weQj4yVV1xNMP9cdPmjf",
        "width": 73,
        "height": 73,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "fantom"
} as const satisfies Chain;