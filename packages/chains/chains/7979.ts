import type { Chain } from "../src/types";
export default {
  "chain": "DOS",
  "chainId": 7979,
  "explorers": [
    {
      "name": "DOScan",
      "url": "https://doscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmV2Nowzo81F6pi2qFcHePA4MwmmdMKBMUzBJUrxcymxx4",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    },
    {
      "name": "DOScan",
      "url": "https://explorer.doschain.com/",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmV2Nowzo81F6pi2qFcHePA4MwmmdMKBMUzBJUrxcymxx4",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmV2Nowzo81F6pi2qFcHePA4MwmmdMKBMUzBJUrxcymxx4",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://doschain.com/",
  "name": "DOS Chain",
  "nativeCurrency": {
    "name": "DOS",
    "symbol": "DOS",
    "decimals": 18
  },
  "networkId": 7979,
  "redFlags": [],
  "rpc": [
    "https://7979.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://main.doschain.com"
  ],
  "shortName": "dos",
  "slug": "dos-chain",
  "testnet": false
} as const satisfies Chain;