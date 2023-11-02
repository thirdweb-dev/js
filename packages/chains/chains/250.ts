import type { Chain } from "../src/types";
export default {
  "chain": "FTM",
  "chainId": 250,
  "explorers": [
    {
      "name": "ftmscan",
      "url": "https://ftmscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRqbK449Fo9sJ3xMpkPbg6uV1weQj4yVV1xNMP9cdPmjf",
        "width": 73,
        "height": 73,
        "format": "png"
      }
    },
    {
      "name": "dexguru",
      "url": "https://fantom.dex.guru",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRaASKRSjQ5btoUQ2rNTJNxKtx2a2RoewgA7DMQkLVEne",
        "width": 83,
        "height": 82,
        "format": "svg"
      }
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
  "networkId": 250,
  "redFlags": [],
  "rpc": [
    "https://fantom.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://250.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ftm.tools",
    "https://fantom.publicnode.com",
    "wss://fantom.publicnode.com"
  ],
  "shortName": "ftm",
  "slug": "fantom",
  "testnet": false
} as const satisfies Chain;